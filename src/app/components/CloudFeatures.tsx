import { Cloud, Image, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function CloudFeatures() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cloud,
      titleKey: 'cloud.feature1.title',
      descKey: 'cloud.feature1.desc'
    },
    {
      icon: Image,
      titleKey: 'cloud.feature2.title',
      descKey: 'cloud.feature2.desc'
    },
    {
      icon: Package,
      titleKey: 'cloud.feature3.title',
      descKey: 'cloud.feature3.desc'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('cloud.title')}
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            {t('cloud.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#FFF8DC' }}
                >
                  <Icon size={28} style={{ color: '#B8860B' }} />
                </div>
                <h3 className="mb-3" style={{ fontSize: '1.25rem' }}>
                  {t(feature.titleKey)}
                </h3>
                <p className="opacity-70">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
