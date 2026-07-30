import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiTarget,
  FiUsers,
  FiAward,
  FiHeart,
} from "react-icons/fi";

const About = () => {
  return (
    <main className="min-h-screen bg-(--primary-color) px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
        >
          <FiArrowLeft />
          Ana səhifəyə qayıt
        </Link>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="border-b border-white/10 px-6 py-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              <FiHeart />
            </div>

            <h1 className="text-4xl font-bold">Haqqımızda</h1>

            <p className="mt-4 max-w-2xl leading-7 text-white/70">
              Point Counter dostlar, ailə üzvləri və komandalar üçün hesab
              aparmağı daha rahat və sürətli etmək məqsədilə hazırlanmış sadə və
              istifadəsi rahat tətbiqdir.
            </p>
          </div>

          <div className="space-y-10 px-6 py-8">
            <Section icon={<FiTarget />} title="Missiyamız">
              Məqsədimiz hesab aparmaq prosesini maksimum sadələşdirmək, oyun
              zamanı diqqətinizi yalnız oyuna yönəltməkdir. İstifadəçilər bir
              neçə saniyə ərzində oyun yarada, xalları izləyə və qalibi müəyyən
              edə bilirlər.
            </Section>

            <Section icon={<FiUsers />} title="Kimlər üçündür?">
              Point Counter aşağıdakı istifadəçilər üçün nəzərdə tutulub:

              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Stolüstü oyun sevənlər</li>
                <li>Kart oyunları oynayanlar</li>
                <li>Domino və nərd oyunçuları</li>
                <li>Ailə və dost toplantıları</li>
                <li>Komanda yarışları</li>
                <li>İstənilən xal hesablanan oyun</li>
              </ul>
            </Section>

            <Section icon={<FiAward />} title="Əsas xüsusiyyətlər">
              <ul className="list-disc space-y-3 pl-5">
                <li>⚡ Sürətli oyun yaratmaq</li>
                <li>🎯 Limitsiz oyunçu əlavə etmək</li>
                <li>🏆 Qalibi avtomatik müəyyən etmək</li>
                <li>💾 Oyun tarixçəsini saxlamaq</li>
                <li>📊 Əvvəlki oyunlara baxmaq</li>
                <li>🔐 Firebase Authentication ilə təhlükəsiz giriş</li>
              </ul>
            </Section>

            <Section icon={<FiHeart />} title="Nəyə görə Point Counter?">
              Biz inanırıq ki, hesab aparmaq üçün kağız və qələm artıq keçmişdə
              qalıb.

              <br />
              <br />

              Point Counter minimal dizaynı, rahat interfeysi və sürətli
              işləməsi sayəsində diqqətinizi hesabdan deyil, oyundan zövq almağa
              yönəldir.
            </Section>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <h3 className="text-2xl font-bold">
                Təşəkkür edirik ❤️
              </h3>

              <p className="mt-3 text-white/70">
                Point Counter istifadə etdiyiniz üçün təşəkkür edirik.
                Rəyləriniz və təklifləriniz tətbiqin inkişafı üçün bizim üçün
                çox önəmlidir.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const Section = ({ icon, title, children }) => {
  return (
    <section>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
          {icon}
        </div>

        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      <div className="pl-16 leading-7 text-white/70">
        {children}
      </div>
    </section>
  );
};

export default About;