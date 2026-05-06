import { Send, Palette, CheckCircle, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Process() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Send,
      titleKey: 'process.step1.title',
      descKey: 'process.step1.desc'
    },
    {
      icon: Palette,
      titleKey: 'process.step2.title',
      descKey: 'process.step2.desc'
    },
    {
      icon: CheckCircle,
      titleKey: 'process.step3.title',
      descKey: 'process.step3.desc'
    },
    {
      icon: Package,
      titleKey: 'process.step4.title',
      descKey: 'process.step4.desc'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('process.title')}
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            {t('process.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10"
                      style={{ backgroundColor: index % 2 === 0 ? '#FFF8DC' : '#FFE4E1' }}
                    >
                      <Icon
                        size={32}
                        style={{ color: index % 2 === 0 ? '#B8860B' : '#8B0000' }}
                      />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#8B0000', color: 'white', fontSize: '0.875rem' }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="mb-3" style={{ fontSize: '1.125rem' }}>
                    {t(step.titleKey)}
                  </h3>
                  <p className="opacity-70" style={{ fontSize: '0.875rem' }}>
                    {t(step.descKey)}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-200 to-red-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
