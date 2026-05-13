import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onOpenSamples: () => void;
}

export function Hero({ onOpenSamples }: HeroProps) {
  const { t } = useLanguage();
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

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
                onClick={onOpenSamples}
                className="px-8 py-3 rounded-lg transition-all hover:shadow-lg"
                style={{ backgroundColor: '#8B0000', color: 'white' }}
              >
                {t('hero.btn1')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
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
                  <img
                    src="/images/pic1.jpg"
                    alt={t('hero.card1')}
                    className="aspect-[3/4] w-full rounded-lg object-cover"
                  />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
                  <img
                    src="/images/pic3.jpg"
                    alt={t('hero.card2')}
                    className="aspect-[3.5/2] w-full rounded-lg object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
                  <img
                    src="/images/pic4.jpg"
                    alt={t('hero.card3')}
                    className="aspect-[3.5/2] w-full rounded-lg object-cover"
                  />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
                  <img
                    src="/images/pic2.jpg"
                    alt={t('hero.card4')}
                    className="aspect-[3/4] w-full rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
