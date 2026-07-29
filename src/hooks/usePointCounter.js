import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLocalStorage } from "./useLocalStorage";

const DEFAULT_PLAYERS = [{ id: 1, name: "The Rewon", score: 0 }];

export const usePointCounter = () => {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useLocalStorage("players", DEFAULT_PLAYERS);
  const [history, setHistory] = useLocalStorage("history", []);
  const [scoreInput, setScoreInput] = useLocalStorage("scoreInput", {});

  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isRolling, setIsRolling] = useState(false);

  const rollingIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rollingIntervalRef.current) {
        clearInterval(rollingIntervalRef.current);
      }
    };
  }, []);

  const addHistoryItem = (text) => {
    setHistory((previous) => [
      ...previous,
      { id: crypto.randomUUID(), text, time: Date.now() },
    ]);
  };

  const addPlayer = () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      toast.warning("İstifadəçi adını daxil edin!");
      return;
    }

    const alreadyExists = players.some(
      (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      toast.error("Bu istifadəçi artıq mövcuddur!");
      return;
    }

    setPlayers((previous) => [
      ...previous,
      { id: Date.now(), name: trimmedName, score: 0 },
    ]);

    addHistoryItem(`${trimmedName} əlavə olundu!`);
    toast.success(`${trimmedName} əlavə olundu!`);
    setPlayerName("");
  };

  const removePlayer = (id) => {
    const player = players.find((item) => item.id === id);
    if (!player) return;

    setPlayers((previous) => previous.filter((item) => item.id !== id));

    setScoreInput((previous) => {
      const updatedInputs = { ...previous };
      delete updatedInputs[id];
      return updatedInputs;
    });

    addHistoryItem(`${player.name} silindi!`);
    toast.info(`${player.name} silindi.`);
  };

  const updateScore = (id, amount) => {
    const player = players.find((item) => item.id === id);
    if (!player || !amount) return;

    setPlayers((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, score: item.score + amount } : item
      )
    );

    if (amount > 0) {
      addHistoryItem(`${player.name} +${amount} xal qazandı!`);
      toast.success(`${player.name} +${amount} xal qazandı`);
    } else {
      addHistoryItem(`${player.name} ${Math.abs(amount)} xal itirdi!`);
      toast.error(`${player.name} ${Math.abs(amount)} xal itirdi`);
    }
  };

  const updateCustomScoreInput = (playerId, value) => {
    setScoreInput((previous) => ({ ...previous, [playerId]: value }));
  };

  const submitCustomScore = (playerId) => {
    const value = Number(scoreInput[playerId] || 0);
    if (!value) return;

    updateScore(playerId, value);
    updateCustomScoreInput(playerId, "");
  };

  const resetGame = () => {
    setPlayers([]);
    setHistory([]);
    setScoreInput({});
    setStartingPlayer(null);
    setActiveIndex(-1);
    setIsStartModalOpen(false);

    toast.success("Bütün məlumatlar silindi.");
  };

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players]
  );

  const closeStartModal = () => {
    if (rollingIntervalRef.current) {
      clearInterval(rollingIntervalRef.current);
      rollingIntervalRef.current = null;
    }

    setIsRolling(false);
    setIsStartModalOpen(false);
  };

  const chooseStartingPlayer = () => {
    if (players.length === 0) {
      toast.warning("Oyunçu əlavə edin!");
      return;
    }

    if (players.length === 1) {
      toast.warning("Minimum 2 oyunçu olmalıdır!");
      return;
    }

    setStartingPlayer(null);
    setActiveIndex(-1);
    setIsStartModalOpen(true);
    setIsRolling(true);

    let count = 0;

    rollingIntervalRef.current = setInterval(() => {
      setActiveIndex(Math.floor(Math.random() * players.length));
      count += 1;

      if (count >= 20) {
        clearInterval(rollingIntervalRef.current);
        rollingIntervalRef.current = null;

        const selectedPlayer =
          players[Math.floor(Math.random() * players.length)];

        setStartingPlayer(selectedPlayer);
        setActiveIndex(
          players.findIndex((player) => player.id === selectedPlayer.id)
        );
        setIsRolling(false);

        toast.success(`${selectedPlayer.name} oyuna başlayır!`);
      }
    }, 120);
  };

  return {
    playerName,
    setPlayerName,
    players,
    sortedPlayers,
    history,
    scoreInput,
    startingPlayer,
    isStartModalOpen,
    activeIndex,
    isRolling,
    addPlayer,
    removePlayer,
    updateScore,
    updateCustomScoreInput,
    submitCustomScore,
    resetGame,
    chooseStartingPlayer,
    closeStartModal,
  };
};
