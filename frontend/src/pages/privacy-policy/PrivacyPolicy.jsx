import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useTranslation, Trans } from "react-i18next";

const PrivacyPolicy = () => {
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
              {t('privacy_title')}
            </h1>
            <p className="text-base font-roboto text-neutral-3">
              {t('last_update', { date: '21/11/2025' })}
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-xl shadow-md p-6 md:p-8 border border-accent-1 bg-white">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_intro_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('privacy_intro_text')}
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_collect_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_collect_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_collect_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_collect_li2" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_collect_li3" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_collect_li4" /></li>
              </ul>
            </section>

            {/* Use of Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_use_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_use_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('privacy_use_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('privacy_use_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('privacy_use_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('privacy_use_li4')}</li>
              </ul>
            </section>

            {/* GDPR Legal Basis */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_gdpr_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_gdpr_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_gdpr_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_gdpr_li2" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_gdpr_li3" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_gdpr_li4" /></li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_cookies_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_cookies_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_cookies_li1" /></li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                <Trans i18nKey="privacy_cookies_manage" />
              </p>
            </section>

            {/* Data Recipients */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_recipients_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_recipients_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_recipients_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_recipients_li2" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_recipients_li3" /></li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                {t('privacy_recipients_note')}
              </p>
            </section>

            {/* International Data Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_transfers_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_transfers_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_transfers_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_transfers_li2" /></li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                {t('privacy_transfers_note')}
              </p>
            </section>

            {/* Data Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_protection_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('privacy_protection_text')}
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_retention_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('privacy_retention_text')}
              </p>
            </section>

            {/* Your GDPR Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_rights_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_rights_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li2" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li3" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li4" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li5" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li6" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li7" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="privacy_rights_li8" /></li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                {t('privacy_rights_note')}
              </p>
            </section>

            {/* Updates to this Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_updates_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_updates_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('privacy_updates_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('privacy_updates_li2')}</li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                {t('privacy_updates_note')}
              </p>
            </section>

            {/* Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('privacy_contact_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('privacy_contact_text')}
              </p>
              <div>
                <p className="font-poppins font-semibold mb-2 text-neutral-2">
                  Email:
                </p>
                <p className="text-base font-roboto text-neutral-3">
                  canaccesible@gmail.com
                </p>
              </div>
              <div className="mt-4">
                <p className="font-poppins font-semibold mb-2 text-neutral-2">
                  {t('contact_phone')}:
                </p>
                <p className="text-base font-roboto text-neutral-3">
                  928 30 43 67
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

export default PrivacyPolicy;
