import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useTranslation, Trans } from "react-i18next";

const TermsConditions = () => {
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
              {t('terms_title')}
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
                {t('terms_intro_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('terms_intro_text')}
              </p>
            </section>

            {/* 1. Use License */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_license_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('terms_license_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('terms_license_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_license_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_license_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_license_li4')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_license_li5')}</li>
              </ul>
            </section>

            {/* 2. User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_accounts_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('terms_accounts_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('terms_accounts_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_accounts_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_accounts_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_accounts_li4')}</li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                {t('terms_accounts_note')}
              </p>
            </section>

            {/* 3. Reporting Incidents */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_reporting_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('terms_reporting_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('terms_reporting_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_reporting_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_reporting_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_reporting_li4')}</li>
              </ul>
            </section>

            {/* 4. Content Ownership */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_ownership_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('terms_ownership_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="terms_ownership_li1" /></li>
                <li className="text-base font-roboto text-neutral-3"><Trans i18nKey="terms_ownership_li2" /></li>
              </ul>
            </section>

            {/* 5. User Conduct */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_conduct_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('terms_conduct_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('terms_conduct_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_conduct_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_conduct_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_conduct_li4')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_conduct_li5')}</li>
              </ul>
            </section>

            {/* 6. Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_liability_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('terms_liability_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('terms_liability_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_liability_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_liability_li3')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_liability_li4')}</li>
              </ul>
            </section>

            {/* 7. Indemnification */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_indemnification_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('terms_indemnification_text')}
              </p>
            </section>

            {/* 8. Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_termination_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('terms_termination_text')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">{t('terms_termination_li1')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_termination_li2')}</li>
                <li className="text-base font-roboto text-neutral-3">{t('terms_termination_li3')}</li>
              </ul>
            </section>

            {/* 9. Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_changes_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('terms_changes_text')}
              </p>
            </section>

            {/* 10. Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_law_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                {t('terms_law_text')}
              </p>
            </section>

            {/* 11. Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                {t('terms_contact_title')}
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                {t('terms_contact_text')}
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

export default TermsConditions;
