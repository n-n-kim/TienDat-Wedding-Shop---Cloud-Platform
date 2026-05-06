import { useLanguage } from '../contexts/LanguageContext';

export function Gallery() {
  const { t } = useLanguage();

  const items = [
    { titleKey: 'gallery.item1.title', subtitleKey: 'gallery.item1.subtitle', color: 'from-red-100 to-red-200' },
    { titleKey: 'gallery.item2.title', subtitleKey: 'gallery.item2.subtitle', color: 'from-amber-100 to-amber-200' },
    { titleKey: 'gallery.item3.title', subtitleKey: 'gallery.item3.subtitle', color: 'from-gray-50 to-gray-100' },
    { titleKey: 'gallery.item4.title', subtitleKey: 'gallery.item4.subtitle', color: 'from-red-50 to-red-100' },
    { titleKey: 'gallery.item5.title', subtitleKey: 'gallery.item5.subtitle', color: 'from-amber-50 to-amber-100' },
    { titleKey: 'gallery.item6.title', subtitleKey: 'gallery.item6.subtitle', color: 'from-orange-50 to-orange-100' }
  ];

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('gallery.title')}
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            {t('gallery.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${item.color} rounded-xl mb-4 flex items-center justify-center overflow-hidden relative`}
                >
                  <div className="text-center">
                    <div className="opacity-40" style={{ fontSize: '0.875rem' }}>
                      {t(item.titleKey)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>
                <div className="px-2">
                  <h4 className="mb-1" style={{ fontSize: '1rem' }}>
                    {t(item.titleKey)}
                  </h4>
                  <p className="opacity-60" style={{ fontSize: '0.875rem' }}>
                    {t(item.subtitleKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
