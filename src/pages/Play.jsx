import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { memoryRecallQuestions } from "../data/questions";
import { logAnswer } from "../db";

export default function Play() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState({ type: null, count: 0 });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const currentQuestion = memoryRecallQuestions[currentIndex];

  const handleSelectOption = (option) => {
    if (selectedOption !== null) return; // Prevent multiple taps during delay

    // Immediately log answer record to IndexedDB
    logAnswer({
      domain: currentQuestion.domain,
      correct: option.isCorrect,
      timestamp: new Date().toISOString(),
    });

    setSelectedOption(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => ({
        type: "correct",
        count: prev.type === "correct" ? prev.count + 1 : 1,
      }));
    } else {
      setStreak((prev) => ({
        type: "incorrect",
        count: prev.type === "incorrect" ? prev.count + 1 : 1,
      }));
    }

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentIndex + 1 < memoryRecallQuestions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsSessionComplete(true);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak({ type: null, count: 0 });
    setSelectedOption(null);
    setIsSessionComplete(false);
  };

  if (isSessionComplete) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
        <div className="max-w-md w-full bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          <h1 className="text-4xl font-extrabold text-white">
            Session Complete
          </h1>
          <p className="text-2xl font-semibold text-slate-300">
            You scored <span className="text-amber-400 font-bold">{score}</span>{" "}
            out of {memoryRecallQuestions.length}
          </p>
          <div className="flex flex-col gap-4 pt-4">
            <button
              type="button"
              onClick={restartGame}
              className="min-h-[80px] w-full px-8 py-5 text-2xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-2xl shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-200/50"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="min-h-[72px] w-full px-8 py-4 text-xl font-bold text-white bg-slate-700 hover:bg-slate-600 active:scale-95 rounded-2xl transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Progress header */}
        <div className="w-full flex justify-between items-center mb-8 px-2">
          <span className="text-xl font-medium text-slate-400">
            Question {currentIndex + 1} of {memoryRecallQuestions.length}
          </span>
          {streak.count > 1 && (
            <span
              className={`text-lg font-bold px-3 py-1 rounded-full ${
                streak.type === "correct"
                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-600"
                  : "bg-rose-900/60 text-rose-300 border border-rose-600"
              }`}
            >
              {streak.count} in a row
            </span>
          )}
        </div>

        {/* Question prompt */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-10 leading-snug">
          {currentQuestion.prompt}
        </h2>

        {/* 2 large tappable option buttons */}
        <div className="w-full flex flex-col gap-5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const hasAnswered = selectedOption !== null;

            let buttonStyle =
              "bg-slate-800 text-white border-2 border-slate-700 hover:bg-slate-750 hover:border-slate-500";

            if (hasAnswered) {
              if (option.isCorrect) {
                buttonStyle =
                  "bg-emerald-600 text-white border-2 border-emerald-400 shadow-emerald-900/50 shadow-lg";
              } else if (isSelected && !option.isCorrect) {
                buttonStyle =
                  "bg-rose-600 text-white border-2 border-rose-400 shadow-rose-900/50 shadow-lg";
              } else {
                buttonStyle =
                  "bg-slate-800/40 text-slate-500 border-2 border-slate-800";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(option)}
                className={`min-h-[88px] w-full px-8 py-5 text-2xl sm:text-3xl font-bold rounded-2xl shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-98 focus:outline-none ${buttonStyle}`}
              >
                <span>{option.label}</span>
                {hasAnswered && option.isCorrect && (
                  <span className="text-2xl" aria-label="Correct">
                    ✓
                  </span>
                )}
                {hasAnswered && isSelected && !option.isCorrect && (
                  <span className="text-2xl" aria-label="Incorrect">
                    ✕
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subtitle feedback message */}
        <div className="h-10 mt-6 flex items-center justify-center">
          {selectedOption && (
            <p
              className={`text-2xl font-bold transition-opacity ${
                selectedOption.isCorrect ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {selectedOption.isCorrect ? "Great job!" : "Good try!"}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
