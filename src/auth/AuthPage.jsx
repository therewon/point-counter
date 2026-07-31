import { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { auth } from "../firebase";
import { useAuth } from "./AuthContext";
import "./auth.css";

const firebaseErrors = {
  "auth/email-already-in-use": "Bu e-poçt ünvanı artıq istifadə olunur.",
  "auth/account-exists-with-different-credential":
    "Bu e-poçt ünvanı başqa giriş üsulu ilə istifadə olunur.",
  "auth/cancelled-popup-request": "Əvvəlki giriş cəhdi ləğv edildi.",
  "auth/invalid-credential": "E-poçt və ya şifrə yanlışdır.",
  "auth/invalid-email": "Düzgün e-poçt ünvanı daxil edin.",
  "auth/missing-password": "Şifrənizi daxil edin.",
  "auth/network-request-failed":
    "İnternet bağlantısını yoxlayıb yenidən cəhd edin.",
  "auth/operation-not-allowed":
    "Bu giriş üsulu Firebase panelində aktiv edilməyib.",
  "auth/popup-blocked":
    "Giriş pəncərəsi brauzer tərəfindən bloklandı. Pop-up icazəsini aktiv edib yenidən cəhd edin.",
  "auth/popup-closed-by-user":
    "Giriş tamamlanmadan pəncərə bağlandı. Yenidən cəhd edə bilərsiniz.",
  "auth/too-many-requests":
    "Çox sayda uğursuz cəhd edildi. Bir az sonra yenidən yoxlayın.",
  "auth/unauthorized-domain":
    "Bu domen Firebase girişləri üçün təsdiqlənməyib.",
  "auth/user-disabled": "Bu hesab deaktiv edilib.",
  "auth/weak-password": "Şifrə ən azı 6 simvoldan ibarət olmalıdır.",
};

function getErrorMessage(error, isLogin) {
  return (
    firebaseErrors[error.code] ||
    (isLogin
      ? "Giriş zamanı xəta baş verdi. Yenidən cəhd edin."
      : "Qeydiyyat zamanı xəta baş verdi. Yenidən cəhd edin.")
  );
}

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { user, authLoading, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");
  const isBusy = loading || Boolean(socialLoading);

  const content = useMemo(
    () => ({
      eyebrow: isLogin ? "Yenidən xoş gəldiniz" : "Yeni hesab yaradın",
      title: isLogin
        ? "Oyuna qaldığınız yerdən davam edin."
        : "Xalları izləmək indi daha rahatdır.",
      description: isLogin
        ? "Hesabınıza daxil olun, oyunçularınızı əlavə edin və nəticələri bir yerdə idarə edin."
        : "Bir dəqiqədən az müddətdə hesab yaradın və ilk oyununuzu başladın.",
      button: isLogin ? "Hesaba daxil ol" : "Pulsuz qeydiyyatdan keç",
      loading: isLogin ? "Daxil olunur..." : "Hesab yaradılır...",
    }),
    [isLogin],
  );

  useEffect(() => {
    if (!authLoading && user) { 
        navigate("/", { replace: true }); 
    }
  }, [authLoading, navigate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isLogin && formData.name.trim().length < 2) {
      setError("Ad ən azı 2 simvoldan ibarət olmalıdır.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifrə ən azı 6 simvoldan ibarət olmalıdır.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Şifrələr bir-biri ilə uyğun gəlmir.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );
      } else {
        const credential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );

        await updateProfile(credential.user, {
          displayName: formData.name.trim(),
        });

        await refreshUser();
      }

      navigate("/", { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, isLogin));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (providerName) => {
    setError("");
    setSocialLoading(providerName);

    try {
      let provider;

      if (providerName === "google") {
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
      } else {
        provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
      }

      await signInWithPopup(auth, provider);
      navigate("/", { replace: true });
    } catch (signInError) {
      setError(getErrorMessage(signInError, isLogin));
    } finally {
      setSocialLoading("");
    }
  };

  if (authLoading || user) {
    return (
      <div className="page-loader" role="status" aria-live="polite">
        <div className="page-loader__mark">
          <span>01</span>
          <span>12</span>
          <span>08</span>
        </div>
        <p>Səhifə hazırlanır...</p>
      </div>
    );
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand" aria-label="Point Counter əsas səhifə">
        <span>Point Counter</span>
      </Link>

      <section className="auth-showcase" aria-label="Point Counter haqqında">
        <div className="auth-showcase__glow" />
        <div className="auth-showcase__content">
          <p className="auth-kicker">Hər xalın bir hekayəsi var</p>
          <h1>Rəqabəti qızışdır. Hesabı biz saxlayaq.</h1>
          <p className="auth-showcase__lead">
            Dostlarla oyun gecələrini qarışıqlıq olmadan idarə et — sadə,
            sürətli və həmişə aydın.
          </p>

          <div className="score-preview" aria-hidden="true">
            <div className="score-preview__top">
              <div>
                <span>CANLI OYUN</span>
                <strong>Stolüstü gecəsi</strong>
              </div>
              <span className="live-pill">4 oyunçu</span>
            </div>
            <div className="score-preview__rows">
              <div className="score-preview__row is-leading">
                <span className="player-avatar">R</span>
                <span className="player-name">
                  Revan <small>Lider</small>
                </span>
                <strong>128</strong>
              </div>
              <div className="score-preview__row">
                <span className="player-avatar">O</span>
                <span className="player-name">Orxan</span>
                <strong>112</strong>
              </div>
              <div className="score-preview__row">
                <span className="player-avatar">M</span>
                <span className="player-name">Murad</span>
                <strong>96</strong>
              </div>
            </div>
          </div>

          <div className="auth-benefits">
            <span>
              <FiCheck /> Sürətli hesab
            </span>
            <span>
              <FiCheck /> Canlı sıralama
            </span>
            <span>
              <FiCheck /> Oyun tarixçəsi
            </span>
          </div>
        </div>
        <p className="auth-showcase__quote">
          “Oyunu sən oyna, rəqəmləri Point Counter yadda saxlasın.”
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card__heading">
            <span className="auth-card__eyebrow">{content.eyebrow}</span>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-social">
              <button
                className="auth-social__button auth-social__button--google"
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={isBusy}
                aria-label="Google ilə davam et"
              >
                <FcGoogle aria-hidden="true" />
                <span>
                  {socialLoading === "google"
                    ? "Google açılır..."
                    : "Google ilə davam et"}
                </span>
              </button>

              <button
                className="auth-social__button auth-social__button--apple"
                type="button"
                onClick={() => handleSocialSignIn("apple")}
                disabled
                aria-label="Apple ilə davam et"
              >
                <FaApple aria-hidden="true" />
                <span>
                  {socialLoading === "apple"
                    ? "Apple açılır..."
                    : "Apple ilə davam et"}
                </span>
              </button>
            </div>

            <div className="auth-divider" aria-hidden="true">
              <span>və ya e-poçt ilə</span>
            </div>

            {!isLogin && (
              <label className="auth-field">
                <span>Ad və soyad</span>
                <span className="auth-input-wrap">
                  <FiUser aria-hidden="true" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Məsələn, Aylin Məmmədova"
                    autoComplete="name"
                    required
                  />
                </span>
              </label>
            )}

            <label className="auth-field">
              <span>E-poçt ünvanı</span>
              <span className="auth-input-wrap">
                <FiMail aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="adiniz@email.com"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <label className="auth-field">
              <span>Şifrə</span>
              <span className="auth-input-wrap">
                <FiLock aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ən azı 6 simvol"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            {!isLogin && (
              <label className="auth-field">
                <span>Şifrəni təsdiqlə</span>
                <span className="auth-input-wrap">
                  <FiLock aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Şifrəni təkrar daxil et"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </span>
              </label>
            )}

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button className="auth-submit" type="submit" disabled={isBusy}>
              <span>{loading ? content.loading : content.button}</span>
              <FiArrowRight aria-hidden="true" />
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "Hələ hesabınız yoxdur?" : "Artıq hesabınız var?"}{" "}
            <Link to={isLogin ? "/register" : "/login"}>
              {isLogin ? "Qeydiyyatdan keçin" : "Daxil olun"}
            </Link>
          </p>

          <p className="auth-terms">
            Davam etməklə istifadə qaydalarını və məxfilik şərtlərini qəbul
            etmiş olursunuz.
          </p>
        </div>
      </section>
    </main>
  );
}
