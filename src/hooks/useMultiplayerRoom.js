import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  changePlayerScore,
  leaveRoom as leaveMultiplayerRoom,
  restartGame as restartMultiplayerGame,
  setupPlayerPresence,
  startGame as startMultiplayerGame,
  subscribeToRoom,
  syncPlayerHostFlag,
} from "../services/multiplayerService";

export const useMultiplayerRoom = (roomCode) => {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    let unsubscribe;

    try {
      unsubscribe = subscribeToRoom(
        roomCode,
        (roomData) => {
          setRoom(roomData);
          setLoading(false);

          if (!roomData) {
            setError("Otaq tapılmadı.");
          }
        },
        (subscriptionError) => {
          console.error("Otaq izlənilə bilmədi:", subscriptionError);
          setError(subscriptionError.message);
          setLoading(false);
        },
      );
    } catch (subscriptionError) {
      console.error("Otaq abunəliyi yaradıla bilmədi:", subscriptionError);
      setError(subscriptionError.message);
      setLoading(false);
    }

    return () => unsubscribe?.();
  }, [roomCode]);

  const isMember = Boolean(user?.uid && room?.players?.[user.uid]);
  const currentPlayer = useMemo(
    () => (user?.uid ? room?.players?.[user.uid] || null : null),
    [room?.players, user?.uid],
  );

  useEffect(() => {
    if (!user?.uid || !isMember || !currentPlayer?.name) {
      return undefined;
    }

    return setupPlayerPresence(roomCode, user.uid, currentPlayer.name);
  }, [currentPlayer?.name, isMember, roomCode, user?.uid]);

  const isHost = Boolean(user?.uid && room?.hostId === user.uid);

  useEffect(() => {
    if (!currentPlayer || currentPlayer.isHost === isHost || !user?.uid) {
      return;
    }

    syncPlayerHostFlag(roomCode, user.uid, isHost).catch((syncError) => {
      console.error("Host göstəricisi sinxronlaşdırıla bilmədi:", syncError);
    });
  }, [currentPlayer, isHost, roomCode, user?.uid]);

  const players = useMemo(
    () =>
      Object.values(room?.players || {}).sort(
        (firstPlayer, secondPlayer) =>
          Number(secondPlayer.score || 0) -
            Number(firstPlayer.score || 0) ||
          Number(firstPlayer.joinedAt || 0) -
            Number(secondPlayer.joinedAt || 0),
      ),
    [room?.players],
  );

  const history = useMemo(
    () =>
      Object.values(room?.history || {}).sort(
        (firstEvent, secondEvent) =>
          Number(secondEvent.createdAt || 0) -
          Number(firstEvent.createdAt || 0),
      ),
    [room?.history],
  );

  const runAction = useCallback(async (actionName, action) => {
    setActionLoading(actionName);
    setError("");

    try {
      const result = await action();
      return result;
    } catch (actionError) {
      console.error(`Multiplayer əməliyyatı alınmadı (${actionName}):`, actionError);
      setError(actionError.message || "Gözlənilməz xəta baş verdi.");
      return false;
    } finally {
      setActionLoading("");
    }
  }, []);

  const startGame = useCallback(
    () =>
      runAction("start", () =>
        startMultiplayerGame(roomCode, user?.uid),
      ),
    [roomCode, runAction, user?.uid],
  );

  const changeScore = useCallback(
    (playerId, amount) =>
      runAction(`score-${playerId}`, () =>
        changePlayerScore(roomCode, playerId, user?.uid, amount),
      ),
    [roomCode, runAction, user?.uid],
  );

  const leaveRoom = useCallback(
    () =>
      runAction("leave", () =>
        leaveMultiplayerRoom(roomCode, user?.uid),
      ),
    [roomCode, runAction, user?.uid],
  );

  const restartGame = useCallback(
    () =>
      runAction("restart", () =>
        restartMultiplayerGame(roomCode, user?.uid),
      ),
    [roomCode, runAction, user?.uid],
  );

  return {
    room,
    players,
    history,
    currentPlayer,
    isHost,
    loading,
    actionLoading,
    error,
    setError,
    startGame,
    changeScore,
    leaveRoom,
    restartGame,
  };
};
