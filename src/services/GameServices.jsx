import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export const saveGame = async ({
  gameName,
  players,
  winner,
  user,
}) => {
  if (!user) {
    throw new Error("Oyunu saxlamaq üçün istifadəçi daxil olmalıdır");
  }

  const formattedPlayers = players.map((player, index) => ({
    id: player.id ?? String(index + 1),
    name: player.name || `Oyunçu ${index + 1}`,
    score: Number(player.score ?? player.points ?? 0),
  }));

  const gameData = {
    name: gameName,
    userId: user.uid,

    players: formattedPlayers,

    winner: winner
      ? {
          id: winner.id ?? null,
          name: winner.name,
          score: Number(winner.score ?? winner.points ?? 0),
        }
      : null,

    playerCount: formattedPlayers.length,

    createdAt: serverTimestamp(),
  };

  const documentReference = await addDoc(
    collection(db, "savedGames"),
    gameData
  );

  return documentReference.id;
};