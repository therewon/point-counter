import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import UserMenuButton from "./UserMenuButton";

const navigation = [
  { to: "/", label: "Ana səhifə", end: true },
  { to: "/offline", label: "Offline oyun" },
  { to: "/multiplayer", label: "Online multiplayer" },
  { to: "/about", label: "Haqqımızda" },
  { to: "/privacy-and-policy", label: "Məxfilik siyasəti" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="container flex items-center justify-between px-3 py-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Menyunu aç"
          >
            <FiMenu size={25} />
          </button>

          <Link to="/" className="text-xl font-bold sm:text-[32px]">
            Point Counter
          </Link>
        </div>

        <nav className="flex gap-2 max-lg:hidden">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-3 transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <UserMenuButton mobile={false} />
      </div>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-72 max-w-[78%] bg-(--primary-color) py-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobil menyu"
      >
        <div className="mb-8 flex items-start justify-between border-b border-white/10 px-3 pb-3">
          <strong className="text-lg">Point Counter</strong>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center rounded-lg transition hover:bg-white/20"
            aria-label="Menyunu bağla"
          >
            <FiX size={25} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full rounded-lg px-3 py-3 text-left transition ${
                  isActive ? "bg-white/10 text-white" : "hover:bg-white/10"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <UserMenuButton mobile />
        </nav>
      </aside>
    </header>
  );
};

export default Header;
