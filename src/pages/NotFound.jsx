import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome, FiRefreshCw } from "react-icons/fi";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--primary-color) px-4">

      {/* Background Blur */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-[140px]" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-orange-500/20 blur-[180px]" />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl md:p-14">

        <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-sm font-semibold text-yellow-300">
          ERROR 404
        </span>

        <h1 className="mt-6 bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-400 bg-clip-text text-8xl font-black text-transparent md:text-9xl">
          404
        </h1>

        <h2 className="mt-6 text-3xl font-bold text-white">
          Səhifə tapılmadı
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-8 text-white/60">
          Axtardığınız səhifə mövcud deyil, silinmiş və ya başqa ünvana
          köçürülmüş ola bilər.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300"
          >
            <FiHome />
            Ana səhifəyə qayıt
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            <FiArrowLeft />
            Geri qayıt
          </button>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            <FiRefreshCw />
            Yenilə
          </button>

        </div>

        <div className="mt-12 flex justify-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400 [animation-delay:200ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400 [animation-delay:400ms]" />
        </div>

      </div>
    </main>
  );
};

export default NotFound;