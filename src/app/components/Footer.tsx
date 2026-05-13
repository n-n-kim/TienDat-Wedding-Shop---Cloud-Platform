import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4" style={{ fontSize: '1.5rem', color: '#B8860B' }}>
              Tiến Đạt
            </div>
            <p className="opacity-70 mb-6" style={{ fontSize: '0.875rem' }}>
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="mb-4" style={{ fontSize: '1.125rem' }}>
              {t('footer.services')}
            </h4>
            <ul className="space-y-3 opacity-70" style={{ fontSize: '0.875rem' }}>
              <li><a href="#home" className="hover:opacity-100 transition-opacity">{t('nav.home')}</a></li>
              <li><a href="#process" className="hover:opacity-100 transition-opacity">{t('footer.about.process')}</a></li>
              <li><a href="#contact" className="hover:opacity-100 transition-opacity">{t('nav.contact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4" style={{ fontSize: '1.125rem' }}>
              {t('footer.about')}
            </h4>
            <ul className="space-y-3 opacity-70" style={{ fontSize: '0.875rem' }}>
              <li><a href="#home" className="hover:opacity-100 transition-opacity">{t('footer.about.intro')}</a></li>
              <li><a href="#process" className="hover:opacity-100 transition-opacity">{t('footer.about.process')}</a></li>
              <li><a href="#contact" className="hover:opacity-100 transition-opacity">{t('nav.contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center opacity-60" style={{ fontSize: '0.875rem' }}>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
