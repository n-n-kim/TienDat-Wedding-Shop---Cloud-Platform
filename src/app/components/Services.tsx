import { Heart, Briefcase, Calendar, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Heart,
      titleKey: 'services.service1.title',
      descKey: 'services.service1.desc'
    },
    {
      icon: Briefcase,
      titleKey: 'services.service2.title',
      descKey: 'services.service2.desc'
    },
    {
      icon: Calendar,
      titleKey: 'services.service3.title',
      descKey: 'services.service3.desc'
    },
    {
      icon: Printer,
      titleKey: 'services.service4.title',
      descKey: 'services.service4.desc'
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('services.title')}
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all"
                  style={{ backgroundColor: '#FFF8DC' }}
                >
                  <Icon size={24} style={{ color: '#8B0000' }} className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="mb-3" style={{ fontSize: '1.125rem' }}>
                  {t(service.titleKey)}
                </h3>
                <p className="opacity-70 mb-4" style={{ fontSize: '0.875rem' }}>
                  {t(service.descKey)}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{ color: '#B8860B', fontSize: '0.875rem' }}
                >
                  {t('services.more')} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
