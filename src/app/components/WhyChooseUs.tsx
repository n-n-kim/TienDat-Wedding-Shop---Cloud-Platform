import { Sparkles, Clock, Grid3x3, Edit3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function WhyChooseUs() {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: Sparkles,
      titleKey: 'why.reason1.title',
      descKey: 'why.reason1.desc'
    },
    {
      icon: Clock,
      titleKey: 'why.reason2.title',
      descKey: 'why.reason2.desc'
    },
    {
      icon: Grid3x3,
      titleKey: 'why.reason3.title',
      descKey: 'why.reason3.desc'
    },
    {
      icon: Edit3,
      titleKey: 'why.reason4.title',
      descKey: 'why.reason4.desc'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('why.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: index % 2 === 0 ? '#8B0000' : '#B8860B' }}
                >
                  <Icon size={28} style={{ color: 'white' }} />
                </div>
                <h3 className="mb-3" style={{ fontSize: '1.125rem' }}>
                  {t(reason.titleKey)}
                </h3>
                <p className="opacity-70" style={{ fontSize: '0.875rem' }}>
                  {t(reason.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
