import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useTranslation, Trans } from "react-i18next";

const PushNotificationsGuide = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-4 text-neutral-2">
              {t('push_guide_title')}
            </h1>
          </div>

          {/* Content Card */}
          <div className="rounded-xl shadow-md p-6 md:p-8 border border-accent-1 bg-white">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_intro_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3 mb-4">
                {t('push_intro_text')}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-base font-roboto text-neutral-3">
                  <Trans i18nKey="push_important" />
                </p>
              </div>
            </section>

            {/* Step 1: Enable in CanAccesible */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_step1')}
              </h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('push_step1_li1')}</li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="push_step1_li2" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="push_step1_li3" /></li>
                <li className="text-base font-roboto text-neutral-3">{t('push_step1_li4')}</li>
              </ol>
            </section>

            {/* Step 2: Enable in Browser */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_step2')}
              </h2>
              
              {/* Chrome */}
              <div className="mb-6">
                <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                  {t('push_chrome')}
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li className="text-base font-roboto text-neutral-3">{t('push_chrome_li1')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_chrome_li2')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_chrome_li3')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_chrome_li4')}</li>
                </ol>
              </div>

              {/* Firefox */}
              <div className="mb-6">
                <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                  {t('push_firefox')}
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li className="text-base font-roboto text-neutral-3">{t('push_firefox_li1')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_firefox_li2')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_firefox_li3')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_firefox_li4')}</li>
                </ol>
              </div>

              {/* Edge */}
              <div className="mb-6">
                <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                  {t('push_edge')}
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li className="text-base font-roboto text-neutral-3">{t('push_edge_li1')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_edge_li2')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_edge_li3')}</li>
                </ol>
              </div>
            </section>

            {/* Step 3: Enable in Windows */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_step3')}
              </h2>
              <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                {t('push_windows')}
              </h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="push_windows_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="push_windows_li2" /></li>
                <li className="text-base font-roboto text-neutral-3">{t('push_windows_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('push_windows_li4')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('push_windows_li5')}</li>
              </ol>
            </section>

            {/* Step 4: Enable in macOS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_step4')}
              </h2>
              <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                {t('push_macos')}
              </h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="push_macos_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="push_macos_li2" /></li>
                <li className="text-base font-roboto text-neutral-3">{t('push_macos_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('push_macos_li4')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('push_macos_li5')}</li>
              </ol>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_troubleshooting')}
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                  {t('push_not_receiving')}
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-roboto text-neutral-3">{t('push_not_receiving_li1')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_not_receiving_li2')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_not_receiving_li3')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_not_receiving_li4')}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-poppins font-semibold mb-3 text-neutral-2">
                  {t('push_no_sound')}
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-roboto text-neutral-3">{t('push_no_sound_li1')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_no_sound_li2')}</li>
                  <li className="text-base font-roboto text-neutral-3">{t('push_no_sound_li3')}</li>
                </ul>
              </div>
            </section>

            {/* Success */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('push_success')}
              </h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-base font-roboto text-neutral-3">
                  {t('push_success_text')}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PushNotificationsGuide;
