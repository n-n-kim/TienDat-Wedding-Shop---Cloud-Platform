import { useLanguage } from '../contexts/LanguageContext';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="mb-6" style={{ fontSize: '3rem', lineHeight: '1.2' }}>
              {t('hero.title')}
            </h1>
            <p className="mb-8 opacity-70" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-3 rounded-lg transition-all hover:shadow-lg"
                style={{ backgroundColor: '#8B0000', color: 'white' }}
              >
                {t('hero.btn1')}
              </button>
              <button
                className="px-8 py-3 rounded-lg transition-all hover:shadow-md"
                style={{ backgroundColor: '#B8860B', color: 'white' }}
              >
                {t('hero.btn2')}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
                  <div className="aspect-[3/4] bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div style={{ color: '#8B0000', fontSize: '1rem' }}>{t('hero.card1')}</div>
                      <div style={{ color: '#B8860B', fontSize: '0.875rem' }}>{t('hero.card1sub')}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
                  <div className="aspect-[3.5/2] bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                    <div style={{ color: '#B8860B', fontSize: '0.875rem' }}>{t('hero.card2')}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
                  <div className="aspect-[3.5/2] bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                    <div style={{ color: '#B8860B', fontSize: '0.875rem' }}>{t('hero.card3')}</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
                  <div className="aspect-[3/4] bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div style={{ color: '#8B0000', fontSize: '1rem' }}>{t('hero.card4')}</div>
                      <div style={{ color: '#B8860B', fontSize: '0.875rem' }}>{t('hero.card4sub')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
