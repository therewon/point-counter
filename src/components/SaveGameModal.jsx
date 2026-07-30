import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const SaveGameModal = ({
  players,
  winner,
  onClose,
  onSave,
  isSaving,
}) => {
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmedGameName = gameName.trim();

    if (!trimmedGameName) {
      setError("Oyunun adını daxil edin");
      return;
    }

    setError("");

    await onSave(trimmedGameName);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={!isSaving ? onClose : undefined}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8!">
        <div className="mb-6 flex items-center justify-between">
          <div className="mb-4!">
            <h2 className="text-xl font-bold text-gray-900">
              Oyunu yadda saxla
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Daha sonra tapa bilməyiniz üçün oyuna ad verin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2! text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="mb-5!">
          <label
            htmlFor="gameName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Oyunun adı
          </label>

          <input
            id="gameName"
            type="text"
            value={gameName}
            disabled={isSaving}
            placeholder="Məsələn: Dostlarla axşam oyunu"
            maxLength={50}
            onChange={(event) => {
              setGameName(event.target.value);

              if (error) {
                setError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !isSaving) {
                handleSave();
              }
            }}
            className="w-full rounded-xl border text-black/70 border-gray-300 px-4! py-3! outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
            autoFocus
          />

          <div className="mt-1 flex justify-between">
            <p className="text-sm text-red-500">{error}</p>

            <span className="text-xs text-gray-400">
              {gameName.length}/50
            </span>
          </div>
        </div>

        <div className="mb-6! rounded-xl bg-gray-100 p-4!">
          <p className="mb-3! text-sm font-semibold text-gray-700">
            Oyun nəticələri
          </p>

          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={player.id ?? index}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  {player.name || `Oyunçu ${index + 1}`}
                </span>

                <span className="font-semibold text-gray-900">
                  {player.score ?? player.points ?? 0} xal
                </span>
              </div>
            ))}
          </div>

          {winner && (
            <div className="mt-4! border-t border-gray-200 pt-3!">
              <p className="text-sm text-gray-500">Qalib</p>

              <p className="font-bold text-gray-900">
                {winner.name} — {winner.score ?? winner.points ?? 0} xal
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-xl border border-gray-300 px-4! py-3! font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ləğv et
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-xl bg-blue-600 px-4! py-3! font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saxlanılır..." : "Oyunu saxla"}
          </button>
        </div>
      </div>
    </>
  );
};

export default SaveGameModal;