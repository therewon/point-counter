import { signOut } from "firebase/auth";
import { useAuth } from "../auth/AuthContext";
import { FiLogOut, FiUser } from "react-icons/fi";
import { auth } from "../firebase";

const UserMenuButton = ({mobile}) => {
    const { user } = useAuth();
    const displayName = user?.displayName || "Oyunçu";

    return (
        <div className={`user-menu ${mobile ? "lg:hidden! absolute bottom-2" : "max-lg:hidden!"}`}>
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
    )
}

export default UserMenuButton
