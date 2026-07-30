import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 bg-(--primary-color)">
      <div className="container px-3! py-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <h2 className="text-2xl font-bold text-white">
              Point Counter
            </h2>

            <p className="mt-3 leading-7 text-white/60">
              Sadə, sürətli və rahat hesab aparmaq üçün hazırlanmış tətbiq.
              Dostlarınızla oynadığınız oyunlarda xalları izləmək artıq daha
              asandır.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Naviqasiya
            </h3>

            <div className="flex flex-col gap-3 text-white/60">
              <Link
                to="/"
                className="transition hover:text-white duration-1200"
                onClick={()=> scrollTo(0,0)}
              >
                Ana səhifə
              </Link>

              <Link
                to="/about"
                className="transition hover:text-white"
                onClick={()=> scrollTo(0,0)}
              >
                Haqqımızda
              </Link>

              <Link
                to="/privacy-and-policy"
                className="transition hover:text-white"
                onClick={()=> scrollTo(0,0)}
              >
                Məxfilik siyasəti
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Əlaqə
            </h3>

            <a
              href="mailto:info@therewon.online"
              className="block text-white/60 transition hover:text-white"
            >
              info@therewon.online
            </a>

            <div className="mt-5 flex items-center gap-4 text-2xl">
              <a
                href="https://github.com/therewon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition hover:text-white"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/ravan-mammadli-0b24a8251/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition hover:text-white"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://therewon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition hover:text-white"
              >
                <FaGlobe />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row">
          <p>© {year} Point Counter. Bütün hüquqlar qorunur.</p>

          <p>
            Developed by{" "}
            <a
              href="https://therewon.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white transition hover:text-white/70"
            >
              The Rewon
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;