import { FiArrowLeft, FiLock, FiShield, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          <div className="border-b border-white/10 px-5 py-8 sm:px-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              <FiShield />
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Məxfilik Siyasəti
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Bu məxfilik siyasəti Point Counter tətbiqindən istifadə edərkən
              məlumatlarınızın necə toplandığını, saxlanıldığını və istifadə
              olunduğunu izah edir.
            </p>

            <p className="mt-4 text-sm text-white/50">
              Son yenilənmə: 30 iyul 2026
            </p>
          </div>

          <div className="space-y-10 px-5 py-8 sm:px-8">
            <PolicySection
              number="01"
              title="Topladığımız məlumatlar"
              icon={<FiUser />}
            >
              <p>
                Tətbiqdə qeydiyyatdan keçərkən adınız, e-poçt ünvanınız və
                hesabınızı idarə etmək üçün lazım olan digər əsas məlumatlar
                toplana bilər.
              </p>

              <p>
                Tətbiq daxilində yaratdığınız oyunlar, oyunçu adları, xallar,
                qaliblər və saxladığınız oyun tarixçəsi də hesabınızla
                əlaqələndirilə bilər.
              </p>
            </PolicySection>

            <PolicySection
              number="02"
              title="Məlumatlardan necə istifadə edirik?"
              icon={<FiLock />}
            >
              <p>
                Toplanan məlumatlar aşağıdakı məqsədlər üçün istifadə olunur:
              </p>

              <ul className="mt-4 space-y-3">
                <ListItem>
                  İstifadəçi hesabının yaradılması və idarəsi
                </ListItem>

                <ListItem>
                  Oyun nəticələrinin və tarixçəsinin saxlanılması
                </ListItem>

                <ListItem>
                  Tətbiqin təhlükəsizliyinin təmin edilməsi
                </ListItem>

                <ListItem>
                  İstifadəçi təcrübəsinin yaxşılaşdırılması
                </ListItem>

                <ListItem>
                  Texniki problemlərin aşkarlanması və aradan qaldırılması
                </ListItem>
              </ul>
            </PolicySection>

            <PolicySection
              number="03"
              title="Firebase xidmətləri"
              icon={<FiShield />}
            >
              <p>
                Point Counter istifadəçi qeydiyyatı, giriş əməliyyatları və
                məlumatların saxlanılması üçün Firebase Authentication və Cloud
                Firestore xidmətlərindən istifadə edə bilər.
              </p>

              <p>
                Bu səbəbdən bəzi məlumatlar Google Firebase infrastrukturunda
                emal və saxlanıla bilər.
              </p>
            </PolicySection>

            <PolicySection
              number="04"
              title="Məlumatların paylaşılması"
            >
              <p>
                Şəxsi məlumatlarınız satılmır və kommersiya məqsədilə üçüncü
                tərəflərlə paylaşılmır.
              </p>

              <p>
                Məlumatlar yalnız tətbiqin işləməsi üçün istifadə olunan xidmət
                təminatçıları ilə və ya qanuni tələb yarandığı hallarda
                paylaşıla bilər.
              </p>
            </PolicySection>

            <PolicySection
              number="05"
              title="Məlumatların təhlükəsizliyi"
            >
              <p>
                İstifadəçi məlumatlarının qorunması üçün uyğun texniki və
                təşkilati təhlükəsizlik tədbirləri tətbiq edilir.
              </p>

              <p>
                Buna baxmayaraq, internet üzərindən məlumat ötürülməsinin
                tamamilə risksiz olduğunu təmin etmək mümkün deyil.
              </p>
            </PolicySection>

            <PolicySection
              number="06"
              title="İstifadəçi hüquqları"
            >
              <p>
                İstifadəçilər şəxsi məlumatlarına giriş, məlumatların
                yenilənməsi və hesablarının silinməsi ilə bağlı müraciət edə
                bilərlər.
              </p>

              <p>
                Hesab silindikdə tətbiqdə saxlanılan əlaqəli məlumatların
                müəyyən hissəsi də silinə bilər.
              </p>
            </PolicySection>

            <PolicySection
              number="07"
              title="Cookie və lokal yaddaş"
            >
              <p>
                Tətbiq istifadəçi sessiyasını qorumaq, autentifikasiya
                vəziyyətini idarə etmək və istifadəçi təcrübəsini yaxşılaşdırmaq
                üçün cookie və ya brauzerin lokal yaddaşından istifadə edə
                bilər.
              </p>
            </PolicySection>

            <PolicySection
              number="08"
              title="Siyasətdə dəyişikliklər"
            >
              <p>
                Bu məxfilik siyasəti gələcəkdə yenilənə bilər. Əhəmiyyətli
                dəyişikliklər olduqda yenilənmə tarixi bu səhifədə
                göstəriləcək.
              </p>
            </PolicySection>

            <PolicySection number="09" title="Əlaqə">
              <p>
                Məxfilik siyasəti və şəxsi məlumatlarla bağlı suallarınız üçün
                bizimlə əlaqə saxlaya bilərsiniz.
              </p>

              <a
                href="mailto:ravan.mammadli@outlook.com"
                className="mt-4 inline-flex rounded-lg bg-white/10 px-4 py-2 font-medium transition hover:bg-white/20"
              >
                info@therewon.online
              </a>
            </PolicySection>
          </div>
        </section>
      </div>
    </main>
  );
};

const PolicySection = ({ number, title, icon, children }) => {
  return (
    <section>
      <div className="mb-4 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl font-bold text-white/70">
          {icon || number}
        </span>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Bölmə {number}
          </span>

          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="space-y-4 pl-0 text-sm leading-7 text-white/70 sm:pl-16 sm:text-base">
        {children}
      </div>
    </section>
  );
};

const ListItem = ({ children }) => {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />

      <span>{children}</span>
    </li>
  );
};

export default PrivacyPolicy;