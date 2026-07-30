import "./App.css";
import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import AddPlayerForm from "./components/AddPlayerForm";
import AppHeader from "./components/AppHeader";
import History from "./components/History";
import ScoreBoard from "./components/ScoreBoard";
import StartingPlayerModal from "./components/StartingPlayerModal";
import Header from "./components/Header";
import SaveGameButton from "./components/SaveGameButton";
import SaveGameModal from "./components/SaveGameModal";

import { usePointCounter } from "./hooks/usePointCounter";
import { auth } from "./firebase";
import { saveGame } from "./services/GameServices";
import AllGamesButton from "./components/AllGamesButton";
import { getAllGames } from "./services/GameServices";
import AllGamesModal from "./components/AllGamesModal";

export default function App() {
  const user = auth.currentUser;

  const [isSaveGameModalOpen, setIsSaveGameModalOpen] = useState(false);
  const [isSavingGame, setIsSavingGame] = useState(false);

  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);

  const {
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
  } = usePointCounter();


  const [isAllGamesModalOpen, setIsAllGamesModalOpen] = useState(false);
  const fetchGames = async () => {
    setLoadingGames(true);

    try {
      const data = await getAllGames();
      setGames(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGames(false);
    }
  };
  const openAllGamesModal = async () => {
    await fetchGames();
    setIsAllGamesModalOpen(true);
  };

  const winner = useMemo(() => {
    if (!players.length) {
      return null;
    }

    return players.reduce((currentWinner, player) => {
      const currentWinnerScore = Number(
        currentWinner.score ?? currentWinner.points ?? 0
      );

      const playerScore = Number(player.score ?? player.points ?? 0);

      return playerScore > currentWinnerScore
        ? player
        : currentWinner;
    });
  }, [players]);

  const openSaveGameModal = () => {
    if (!user) {
      toast.error("Oyunu saxlamaq üçün hesabınıza daxil olun");
      return;
    }

    if (players.length < 2) {
      toast.warning("Oyunu saxlamaq üçün ən azı 2 oyunçu olmalıdır");
      return;
    }

    setIsSaveGameModalOpen(true);
  };

  const closeSaveGameModal = () => {
    if (isSavingGame) {
      return;
    }

    setIsSaveGameModalOpen(false);
  };

  const handleSaveGame = async (gameName) => {
    if (!user) {
      toast.error("İstifadəçi məlumatı tapılmadı");
      return;
    }

    try {
      setIsSavingGame(true);

      await saveGame({
        gameName,
        players,
        winner,
        history,
        startingPlayer,
        user,
      });

      toast.success("Oyun uğurla yadda saxlanıldı");
      setIsSaveGameModalOpen(false);
    } catch (error) {
      console.error("Oyun saxlanılarkən xəta baş verdi:", error);

      toast.error(
        error?.message || "Oyun saxlanılarkən xəta baş verdi"
      );
    } finally {
      setIsSavingGame(false);
    }
  };

  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />


      <div className="container px-3!">
        <AppHeader
          onChooseStarter={chooseStartingPlayer}
          onReset={resetGame}
        />

        <div className="grid items-start">
          <AddPlayerForm
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onAddPlayer={addPlayer}
          />

          <ScoreBoard
            players={players}
            sortedPlayers={sortedPlayers}
            scoreInput={scoreInput}
            onScoreChange={updateScore}
            onCustomScoreChange={updateCustomScoreInput}
            onCustomScoreSubmit={submitCustomScore}
            onRemovePlayer={removePlayer}
          />
        </div>

        <History history={history} />

        <div className="flex justify-end items-center py-4! gap-2">
          <AllGamesButton onClick={openAllGamesModal} />
          <SaveGameButton onClick={openSaveGameModal} players={players} />
        </div>
      </div>

      {isAllGamesModalOpen && (
        <AllGamesModal
          games={games}
          loading={loadingGames}
          onClose={() => setIsAllGamesModalOpen(false)}
        />
      )}

      {isStartModalOpen && (
        <StartingPlayerModal
          players={players}
          activeIndex={activeIndex}
          startingPlayer={startingPlayer}
          isRolling={isRolling}
          onClose={closeStartModal}
        />
      )}

      {isSaveGameModalOpen && (
        <SaveGameModal
          players={players}
          winner={winner}
          isSaving={isSavingGame}
          onSave={handleSaveGame}
          onClose={closeSaveGameModal}
        />
      )}
    </div>
  );
}