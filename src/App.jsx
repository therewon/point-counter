import "./App.css";
import { ToastContainer } from "react-toastify";
import AddPlayerForm from "./components/AddPlayerForm";
import AppHeader from "./components/AppHeader";
import History from "./components/History";
import ScoreBoard from "./components/ScoreBoard";
import StartingPlayerModal from "./components/StartingPlayerModal";
import { usePointCounter } from "./hooks/usePointCounter";
import Header from "./components/Header";

export default function App() {
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

  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Header />

      <div className="container px-3!">
        <AppHeader
          onChooseStarter={chooseStartingPlayer}
          onReset={resetGame}
        />

        <div className="grid">
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
      </div>

      {isStartModalOpen && (
        <StartingPlayerModal
          players={players}
          activeIndex={activeIndex}
          startingPlayer={startingPlayer}
          isRolling={isRolling}
          onClose={closeStartModal}
        />
      )}
    </div>
  );
}
