import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function WeddingAccessories() {
  const { t } = useLanguage();

  const accessories = [
    {
      titleKey: 'accessories.item1.title',
      descKey: 'accessories.item1.desc',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item2.title',
      descKey: 'accessories.item2.desc',
      imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item3.title',
      descKey: 'accessories.item3.desc',
      imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item4.title',
      descKey: 'accessories.item4.desc',
      imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item5.title',
      descKey: 'accessories.item5.desc',
      imageUrl: 'https://images.unsplash.com/photo-1522673607211-8c0ed6d2aeb5?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item6.title',
      descKey: 'accessories.item6.desc',
      imageUrl: 'https://images.unsplash.com/photo-1535370326412-33e1b5ad4bf7?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item7.title',
      descKey: 'accessories.item7.desc',
      imageUrl: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=400&fit=crop'
    },
    {
      titleKey: 'accessories.item8.title',
      descKey: 'accessories.item8.desc',
      imageUrl: 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section id="accessories" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('accessories.title')}
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            {t('accessories.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={t(item.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-5">
                <h4 className="mb-2" style={{ fontSize: '1.125rem' }}>
                  {t(item.titleKey)}
                </h4>
                <p className="opacity-60" style={{ fontSize: '0.875rem' }}>
                  {t(item.descKey)}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 transition-colors"
                    style={{ color: '#8B0000', fontSize: '0.875rem' }}
                  >
                    {t('accessories.inquire')} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
