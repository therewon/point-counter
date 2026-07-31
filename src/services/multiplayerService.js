import {
  get,
  onDisconnect,
  onValue,
  push,
  ref,
  remove,
  runTransaction,
  serverTimestamp,
  set,
} from "firebase/database";
import { realtimeDb } from "../firebase";

const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/;
const SCORE_ACTIONS = new Set([-5, -1, 1, 5]);
const MAX_ROOM_CODE_ATTEMPTS = 12;

const errorMessages = {
  "auth-required": "Multiplayer üçün hesabınıza daxil olun.",
  "invalid-room-code": "Room code 6 düzgün simvoldan ibarət olmalıdır.",
  "room-not-found": "Otaq tapılmadı.",
  "room-started": "Bu oyun artıq başlayıb.",
  "room-finished": "Bu oyun artıq bitib.",
  "room-create-failed": "Otaq yaradılarkən xəta baş verdi.",
  "room-join-failed": "Otağa qoşulmaq mümkün olmadı.",
  "not-a-member": "Siz bu otağın iştirakçısı deyilsiniz.",
  "host-only": "Bu əməliyyatı yalnız host edə bilər.",
  "minimum-players": "Minimum 2 oyunçu tələb olunur.",
  "score-owner-only": "Yalnız öz xalınızı dəyişə bilərsiniz.",
  "invalid-score-action": "Bu xal dəyişikliyinə icazə verilmir.",
  "score-change-failed": "Xal dəyişdirilə bilmədi.",
  "network-error": "İnternet bağlantısını yoxlayın.",
  "room-leave-failed": "Otaqdan çıxmaq mümkün olmadı.",
  "game-restart-failed": "Oyunu yenidən başlatmaq mümkün olmadı.",
};

export class MultiplayerError extends Error {
  constructor(code, cause) {
    super(errorMessages[code] || "Gözlənilməz xəta baş verdi.");
    this.name = "MultiplayerError";
    this.code = code;
    this.cause = cause;
  }
}

const getRoomRef = (roomCode) =>
  ref(realtimeDb, `rooms/${normalizeRoomCode(roomCode)}`);

const getPlayerRef = (roomCode, userId) =>
  ref(
    realtimeDb,
    `rooms/${normalizeRoomCode(roomCode)}/players/${userId}`,
  );

const getRoomHistoryRef = (roomCode) =>
  ref(
    realtimeDb,
    `rooms/${normalizeRoomCode(roomCode)}/history`,
  );

const getPlayerName = (user) => user.displayName?.trim() || "Oyunçu";

const createPlayer = (user, isHost = false) => ({
  id: user.uid,
  name: getPlayerName(user),
  score: 0,
  isHost,
  isOnline: true,
  joinedAt: serverTimestamp(),
  lastSeen: serverTimestamp(),
});

const createHistoryEvent = (eventRef, event) => ({
  id: eventRef.key,
  ...event,
  createdAt: serverTimestamp(),
});

const appendRoomHistory = async (roomCode, event) => {
  const eventRef = push(getRoomHistoryRef(roomCode));
  await set(eventRef, createHistoryEvent(eventRef, event));
};

const requireUser = (user) => {
  if (!user?.uid) {
    throw new MultiplayerError("auth-required");
  }
};

const requireValidCode = (roomCode) => {
  const normalizedCode = normalizeRoomCode(roomCode);

  if (!ROOM_CODE_PATTERN.test(normalizedCode)) {
    throw new MultiplayerError("invalid-room-code");
  }

  return normalizedCode;
};

const isNetworkError = (error) => {
  const code = String(error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  return (
    code.includes("network") ||
    code.includes("disconnected") ||
    message.includes("network") ||
    message.includes("offline")
  );
};

const asMultiplayerError = (error, fallbackCode) => {
  if (error instanceof MultiplayerError) {
    return error;
  }

  if (isNetworkError(error)) {
    return new MultiplayerError("network-error", error);
  }

  return new MultiplayerError(fallbackCode, error);
};

const sortPlayersByJoinTime = (players) =>
  [...players].sort(
    (firstPlayer, secondPlayer) =>
      Number(firstPlayer.joinedAt || 0) -
      Number(secondPlayer.joinedAt || 0),
  );

export const normalizeRoomCode = (roomCode = "") =>
  roomCode.trim().toUpperCase();

export const generateRoomCode = () => {
  const values = crypto.getRandomValues(
    new Uint32Array(ROOM_CODE_LENGTH),
  );

  return Array.from(
    values,
    (value) => ROOM_CODE_ALPHABET[value % ROOM_CODE_ALPHABET.length],
  ).join("");
};

export const createRoom = async (user, customSettings = {}) => {
  requireUser(user);

  const settings = {
    targetScore: Math.max(1, Number(customSettings.targetScore) || 100),
    scoreStep: Math.max(1, Number(customSettings.scoreStep) || 1),
    allowNegativeScore: Boolean(customSettings.allowNegativeScore),
  };

  try {
    for (let attempt = 0; attempt < MAX_ROOM_CODE_ATTEMPTS; attempt += 1) {
      const roomCode = generateRoomCode();
      const roomRef = getRoomRef(roomCode);
      const historyEventRef = push(getRoomHistoryRef(roomCode));
      const room = {
        code: roomCode,
        hostId: user.uid,
        status: "waiting",
        createdAt: serverTimestamp(),
        settings,
        players: {
          [user.uid]: createPlayer(user, true),
        },
        history: {
          [historyEventRef.key]: createHistoryEvent(historyEventRef, {
            type: "join",
            userId: user.uid,
            playerName: getPlayerName(user),
          }),
        },
      };

      const result = await runTransaction(
        roomRef,
        (currentRoom) => (currentRoom == null ? room : undefined),
        { applyLocally: false },
      );

      if (result.committed && result.snapshot.child("hostId").val() === user.uid) {
        return roomCode;
      }
    }

    throw new MultiplayerError("room-create-failed");
  } catch (error) {
    throw asMultiplayerError(error, "room-create-failed");
  }
};

export const getRoom = async (roomCode) => {
  const normalizedCode = requireValidCode(roomCode);

  try {
    const snapshot = await get(getRoomRef(normalizedCode));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    throw asMultiplayerError(error, "room-not-found");
  }
};

export const joinRoom = async (roomCode, user) => {
  requireUser(user);
  const normalizedCode = requireValidCode(roomCode);

  try {
    const roomRef = getRoomRef(normalizedCode);
    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
      throw new MultiplayerError("room-not-found");
    }

    const room = roomSnapshot.val();
    const existingPlayer = room.players?.[user.uid];

    if (!existingPlayer && room.status === "playing") {
      throw new MultiplayerError("room-started");
    }

    if (!existingPlayer && room.status === "finished") {
      throw new MultiplayerError("room-finished");
    }

    const playerRef = getPlayerRef(normalizedCode, user.uid);

    if (!existingPlayer) {
      const result = await runTransaction(
        playerRef,
        (currentPlayer) => currentPlayer || createPlayer(user),
        { applyLocally: false },
      );

      if (!result.committed) {
        throw new MultiplayerError("room-join-failed");
      }

      await appendRoomHistory(normalizedCode, {
        type: "join",
        userId: user.uid,
        playerName: getPlayerName(user),
      });
    }

    await Promise.all([
      set(ref(realtimeDb, `rooms/${normalizedCode}/players/${user.uid}/isOnline`), true),
      set(
        ref(realtimeDb, `rooms/${normalizedCode}/players/${user.uid}/lastSeen`),
        serverTimestamp(),
      ),
    ]);

    return normalizedCode;
  } catch (error) {
    throw asMultiplayerError(error, "room-join-failed");
  }
};

export const subscribeToRoom = (roomCode, onRoomChange, onError) => {
  const normalizedCode = requireValidCode(roomCode);

  return onValue(
    getRoomRef(normalizedCode),
    (snapshot) => onRoomChange(snapshot.exists() ? snapshot.val() : null),
    (error) => onError?.(asMultiplayerError(error, "room-not-found")),
  );
};

export const startGame = async (roomCode, userId) => {
  const normalizedCode = requireValidCode(roomCode);

  try {
    const roomRef = getRoomRef(normalizedCode);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new MultiplayerError("room-not-found");
    }

    const room = snapshot.val();

    if (room.hostId !== userId) {
      throw new MultiplayerError("host-only");
    }

    if (Object.keys(room.players || {}).length < 2) {
      throw new MultiplayerError("minimum-players");
    }

    const statusResult = await runTransaction(
      ref(realtimeDb, `rooms/${normalizedCode}/status`),
      (status) => (status === "waiting" ? "playing" : undefined),
      { applyLocally: false },
    );

    if (!statusResult.committed) {
      throw new MultiplayerError(
        room.status === "finished" ? "room-finished" : "room-started",
      );
    }

    await set(
      ref(realtimeDb, `rooms/${normalizedCode}/startedAt`),
      serverTimestamp(),
    );
  } catch (error) {
    throw asMultiplayerError(error, "room-started");
  }
};

export const finishGame = async (roomCode, userId) => {
  const normalizedCode = requireValidCode(roomCode);

  try {
    const roomSnapshot = await get(getRoomRef(normalizedCode));

    if (!roomSnapshot.exists()) {
      throw new MultiplayerError("room-not-found");
    }

    const room = roomSnapshot.val();
    const player = room.players?.[userId];
    const targetScore = Number(room.settings?.targetScore || 100);

    if (!player || Number(player.score || 0) < targetScore) {
      return false;
    }

    const winnerResult = await runTransaction(
      ref(realtimeDb, `rooms/${normalizedCode}/winnerId`),
      (winnerId) => (winnerId == null ? userId : undefined),
      { applyLocally: false },
    );

    const winnerId = winnerResult.snapshot.val();

    if (winnerId !== userId) {
      return false;
    }

    const statusResult = await runTransaction(
      ref(realtimeDb, `rooms/${normalizedCode}/status`),
      (status) => (status === "playing" ? "finished" : undefined),
      { applyLocally: false },
    );

    if (statusResult.committed || statusResult.snapshot.val() === "finished") {
      await set(
        ref(realtimeDb, `rooms/${normalizedCode}/finishedAt`),
        serverTimestamp(),
      );
    }

    return true;
  } catch (error) {
    throw asMultiplayerError(error, "score-change-failed");
  }
};

export const changePlayerScore = async (
  roomCode,
  playerId,
  userId,
  amount,
) => {
  const normalizedCode = requireValidCode(roomCode);

  if (playerId !== userId) {
    throw new MultiplayerError("score-owner-only");
  }

  if (!SCORE_ACTIONS.has(amount)) {
    throw new MultiplayerError("invalid-score-action");
  }

  try {
    const roomSnapshot = await get(getRoomRef(normalizedCode));

    if (!roomSnapshot.exists()) {
      throw new MultiplayerError("room-not-found");
    }

    const room = roomSnapshot.val();

    if (!room.players?.[userId]) {
      throw new MultiplayerError("not-a-member");
    }

    if (room.status !== "playing") {
      throw new MultiplayerError(
        room.status === "finished" ? "room-finished" : "room-started",
      );
    }

    const currentScore = Number(room.players[userId].score || 0);

    if (
      !room.settings?.allowNegativeScore &&
      currentScore + amount < 0
    ) {
      return currentScore;
    }

    const scoreRef = ref(
      realtimeDb,
      `rooms/${normalizedCode}/players/${playerId}/score`,
    );
    const allowNegativeScore = Boolean(room.settings?.allowNegativeScore);
    const scoreResult = await runTransaction(
      scoreRef,
      (score) => {
        const currentScore = Number(score || 0);
        const nextScore = currentScore + amount;
        return allowNegativeScore ? nextScore : Math.max(0, nextScore);
      },
      { applyLocally: false },
    );

    if (!scoreResult.committed) {
      throw new MultiplayerError("score-change-failed");
    }

    const newScore = Number(scoreResult.snapshot.val() || 0);
    const targetScore = Number(room.settings?.targetScore || 100);

    await appendRoomHistory(normalizedCode, {
      type: "score",
      userId,
      playerName: room.players[userId].name,
      amount,
      previousScore: newScore - amount,
      newScore,
    });

    if (newScore >= targetScore) {
      await finishGame(normalizedCode, userId);
    }

    return newScore;
  } catch (error) {
    throw asMultiplayerError(error, "score-change-failed");
  }
};

export const restartGame = async (roomCode, userId) => {
  const normalizedCode = requireValidCode(roomCode);

  try {
    const roomSnapshot = await get(getRoomRef(normalizedCode));

    if (!roomSnapshot.exists()) {
      throw new MultiplayerError("room-not-found");
    }

    const room = roomSnapshot.val();

    if (room.hostId !== userId) {
      throw new MultiplayerError("host-only");
    }

    if (room.status !== "finished") {
      throw new MultiplayerError("game-restart-failed");
    }

    await Promise.all(
      Object.keys(room.players || {}).map((playerId) =>
        runTransaction(
          ref(
            realtimeDb,
            `rooms/${normalizedCode}/players/${playerId}/score`,
          ),
          () => 0,
          { applyLocally: false },
        ),
      ),
    );

    await Promise.all([
      remove(ref(realtimeDb, `rooms/${normalizedCode}/winnerId`)),
      remove(ref(realtimeDb, `rooms/${normalizedCode}/finishedAt`)),
      remove(ref(realtimeDb, `rooms/${normalizedCode}/startedAt`)),
    ]);

    const statusResult = await runTransaction(
      ref(realtimeDb, `rooms/${normalizedCode}/status`),
      (status) => (status === "finished" ? "waiting" : undefined),
      { applyLocally: false },
    );

    if (!statusResult.committed) {
      throw new MultiplayerError("game-restart-failed");
    }
  } catch (error) {
    throw asMultiplayerError(error, "game-restart-failed");
  }
};

export const setupPlayerPresence = (roomCode, userId, playerName = "Oyunçu") => {
  const normalizedCode = requireValidCode(roomCode);
  const onlineRef = ref(
    realtimeDb,
    `rooms/${normalizedCode}/players/${userId}/isOnline`,
  );
  const lastSeenRef = ref(
    realtimeDb,
    `rooms/${normalizedCode}/players/${userId}/lastSeen`,
  );
  const connectedRef = ref(realtimeDb, ".info/connected");
  const onlineDisconnect = onDisconnect(onlineRef);
  const lastSeenDisconnect = onDisconnect(lastSeenRef);
  let historyDisconnect;

  const unsubscribe = onValue(connectedRef, async (snapshot) => {
    if (snapshot.val() !== true) {
      return;
    }

    try {
      const offlineEventRef = push(getRoomHistoryRef(normalizedCode));
      historyDisconnect = onDisconnect(offlineEventRef);

      await onlineDisconnect.set(false);
      await lastSeenDisconnect.set(serverTimestamp());
      await historyDisconnect.set(
        createHistoryEvent(offlineEventRef, {
          type: "offline",
          userId,
          playerName,
        }),
      );
      await Promise.all([
        set(onlineRef, true),
        set(lastSeenRef, serverTimestamp()),
      ]);
    } catch (error) {
      console.error("Presence yenilənə bilmədi:", error);
    }
  });

  return () => {
    unsubscribe();

    Promise.all([
      onlineDisconnect.cancel(),
      lastSeenDisconnect.cancel(),
      historyDisconnect?.cancel(),
    ])
      .then(() =>
        Promise.all([
          set(onlineRef, false),
          set(lastSeenRef, serverTimestamp()),
          appendRoomHistory(normalizedCode, {
            type: "offline",
            userId,
            playerName,
          }),
        ]),
      )
      .catch(() => {});
  };
};

export const syncPlayerHostFlag = async (roomCode, userId, isHost) => {
  const normalizedCode = requireValidCode(roomCode);

  try {
    await set(
      ref(
        realtimeDb,
        `rooms/${normalizedCode}/players/${userId}/isHost`,
      ),
      Boolean(isHost),
    );
  } catch (error) {
    throw asMultiplayerError(error, "room-join-failed");
  }
};

const transferHostAndLeave = async (roomCode, userId, attempt = 0) => {
  const roomRef = getRoomRef(roomCode);
  const roomSnapshot = await get(roomRef);

  if (!roomSnapshot.exists()) {
    return;
  }

  const room = roomSnapshot.val();

  if (!room.players?.[userId]) {
    return;
  }

  if (room.hostId !== userId) {
    await remove(getPlayerRef(roomCode, userId));
    return;
  }

  const remainingPlayers = sortPlayersByJoinTime(
    Object.values(room.players).filter((player) => player.id !== userId),
  );

  if (remainingPlayers.length === 0) {
    const deleteResult = await runTransaction(
      roomRef,
      (currentRoom) => {
        if (!currentRoom || currentRoom.hostId !== userId) {
          return undefined;
        }

        const otherPlayerIds = Object.keys(currentRoom.players || {}).filter(
          (playerId) => playerId !== userId,
        );

        return otherPlayerIds.length === 0 ? null : undefined;
      },
      { applyLocally: false },
    );

    if (!deleteResult.committed && attempt < 2) {
      await transferHostAndLeave(roomCode, userId, attempt + 1);
    }

    return;
  }

  const nextHost =
    remainingPlayers.find((player) => player.isOnline) ||
    remainingPlayers[0];

  try {
    const hostResult = await runTransaction(
      ref(realtimeDb, `rooms/${roomCode}/hostId`),
      (hostId) => (hostId === userId ? nextHost.id : undefined),
      { applyLocally: false },
    );

    if (!hostResult.committed) {
      throw new MultiplayerError("room-leave-failed");
    }

    await remove(getPlayerRef(roomCode, userId));
  } catch (error) {
    if (attempt < 2) {
      await transferHostAndLeave(roomCode, userId, attempt + 1);
      return;
    }

    throw error;
  }
};

export const leaveRoom = async (roomCode, userId) => {
  const normalizedCode = requireValidCode(roomCode);

  try {
    const room = await getRoom(normalizedCode);
    const player = room?.players?.[userId];

    if (player) {
      await appendRoomHistory(normalizedCode, {
        type: "leave",
        userId,
        playerName: player.name,
      });
    }

    await transferHostAndLeave(normalizedCode, userId);
  } catch (error) {
    throw asMultiplayerError(error, "room-leave-failed");
  }
};

export const removeRoom = async (roomCode, userId) => {
  const normalizedCode = requireValidCode(roomCode);
  const room = await getRoom(normalizedCode);

  if (!room) {
    return;
  }

  if (room.hostId !== userId) {
    throw new MultiplayerError("host-only");
  }

  try {
    await remove(getRoomRef(normalizedCode));
  } catch (error) {
    throw asMultiplayerError(error, "room-leave-failed");
  }
};
