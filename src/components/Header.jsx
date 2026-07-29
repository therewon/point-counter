import { signOut } from "firebase/auth";
import { FiLogOut, FiUser } from "react-icons/fi";
import { auth } from "../firebase";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
    const { user } = useAuth();
    const displayName = user?.displayName || "Oyunçu";
    
    return (
        <header className="main-header">
            <div className="container main-header__inner">
                <div className="main-brand">
                    <span>Point Counter</span>
                </div>

                <div className="user-menu">
                    <span className="user-menu__avatar" aria-hidden="true">
                        <FiUser />
                    </span>
                    <span className="user-menu__details">
                        <small>Xoş gəldiniz</small>
                        <strong>{displayName}</strong>
                    </span>
                    <button
                        type="button"
                        className="logout-button"
                        onClick={() => signOut(auth)}
                        aria-label="Hesabdan çıx"
                        title="Hesabdan çıx"
                    >
                        <FiLogOut />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
