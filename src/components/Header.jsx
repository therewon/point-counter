import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import UserMenuButton from "./UserMenuButton";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="main-header">
            <div className="container flex items-center justify-between px-3 py-5">
                <div className="flex gap-2 items-center">
                    <button className="lg:hidden" onClick={() => setIsOpen(true)}>
                        <FiMenu size={25} />
                    </button>
                    <a href="/" className="sm:text-[32px] text-xl font-bold ">
                        <span>Point Counter</span>
                    </a>
                </div>
                <div className="flex gap-6 max-lg:hidden *:whitespace-nowrap">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `rounded-lg px-3 py-3 transition ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        Ana səhifə
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `rounded-lg px-3 py-3 transition ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        Haqqımızda
                    </NavLink>

                    <NavLink
                        to="/privacy-and-policy"
                        className={({ isActive }) =>
                            `rounded-lg px-3 py-3 transition ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        Məxfilik siyasəti
                    </NavLink>
                </div>
                <UserMenuButton mobile={false}/>
            </div>
            {/* Overlay */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 min-[561px]:hidden ${isOpen
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                    }`}
            />

            {/* Soldan açılan mobile menu */}
            <aside
                className={`fixed left-0 top-0 z-50 h-dvh w-70 max-w-[65%] bg-(--primary-color) py-6 shadow-2xl transition-transform duration-300 ease-in-out min-lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="mb-8 flex items-start justify-between border-b pb-3 px-3">
                    <strong className="text-lg">Point Counter</strong>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center rounded-lg  transition hover:bg-white/20"
                        aria-label="Menyunu bağla"
                    >
                        <FiX size={25} />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 px-3">
                    <button
                        type="button"
                        className="w-full rounded-lg py-3 text-left transition hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                    >
                        Ana səhifə
                    </button>

                    <Link to="/about">
                        <button
                            type="button"
                            className="w-full rounded-lg py-3 text-left transition hover:bg-white/10"
                            onClick={() => setIsOpen(false)}
                        >
                            Haqqımızda
                        </button>
                    </Link>

                    <Link to="/privacy-and-policy">
                        <button
                            type="button"
                            className="w-full rounded-lg py-3 text-left transition hover:bg-white/10"
                            onClick={() => setIsOpen(false)}
                        >
                            Privacy and Policy
                        </button>
                    </Link>

                    <UserMenuButton mobile={true}/>
                    {/* <div className="absolute bottom-2">
                    </div> */}
                </nav>
            </aside>
        </header>
    );
};

export default Header;
