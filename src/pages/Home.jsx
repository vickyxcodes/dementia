import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-6">
      <button
        type="button"
        onClick={() => navigate("/play")}
        className="min-h-[88px] min-w-[280px] px-12 py-6 text-4xl font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-3xl shadow-2xl transition-all cursor-pointer focus:outline-none focus:ring-8 focus:ring-amber-200/50"
        aria-label="Play game"
      >
        Play
      </button>
    </main>
  );
}
