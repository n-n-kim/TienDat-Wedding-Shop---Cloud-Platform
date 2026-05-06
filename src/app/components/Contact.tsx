import { Phone, MapPin, Facebook, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('contact.title')}
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gradient-to-br from-amber-50 to-red-50 p-8 rounded-2xl">
              <h3 className="mb-6" style={{ fontSize: '1.5rem' }}>
                {t('contact.form.title')}
              </h3>
              <form className="space-y-5">
                <div>
                  <label className="block mb-2 opacity-80" style={{ fontSize: '0.875rem' }}>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('contact.form.name.placeholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 opacity-80" style={{ fontSize: '0.875rem' }}>
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    placeholder={t('contact.form.phone.placeholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 opacity-80" style={{ fontSize: '0.875rem' }}>
                    {t('contact.form.product')}
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none transition-colors">
                    <option>{t('contact.form.product.option1')}</option>
                    <option>{t('contact.form.product.option2')}</option>
                    <option>{t('contact.form.product.option3')}</option>
                    <option>{t('contact.form.product.option4')}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 opacity-80" style={{ fontSize: '0.875rem' }}>
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('contact.form.message.placeholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#8B0000', color: 'white' }}
                >
                  {t('contact.form.submit')}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="space-y-6">
              <div>
                <h3 className="mb-6" style={{ fontSize: '1.5rem' }}>
                  {t('contact.info.title')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FFF8DC' }}
                    >
                      <Phone size={20} style={{ color: '#8B0000' }} />
                    </div>
                    <div>
                      <div className="opacity-60 mb-1" style={{ fontSize: '0.875rem' }}>{t('contact.info.hotline')}</div>
                      <div style={{ fontSize: '1.125rem' }}>0900 000 000</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FFF8DC' }}
                    >
                      <MapPin size={20} style={{ color: '#B8860B' }} />
                    </div>
                    <div>
                      <div className="opacity-60 mb-1" style={{ fontSize: '0.875rem' }}>{t('contact.info.address')}</div>
                      <div style={{ fontSize: '1.125rem' }}>{t('contact.info.address.value')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h4 className="mb-4" style={{ fontSize: '1.125rem' }}>
                  {t('contact.connect')}
                </h4>
                <div className="flex gap-4">
                  <button
                    className="flex-1 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all hover:shadow-md"
                    style={{ borderColor: '#1877F2', color: '#1877F2' }}
                  >
                    <Facebook size={20} />
                    <span>Facebook</span>
                  </button>
                  <button
                    className="flex-1 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all hover:shadow-md"
                    style={{ borderColor: '#00A884', color: '#00A884' }}
                  >
                    <MessageCircle size={20} />
                    <span>Zalo</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl mt-8">
                <h4 className="mb-3" style={{ fontSize: '1.125rem' }}>
                  {t('contact.hours.title')}
                </h4>
                <div className="space-y-2 opacity-70">
                  <div className="flex justify-between">
                    <span>{t('contact.hours.weekday')}</span>
                    <span>8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.hours.saturday')}</span>
                    <span>8:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.hours.sunday')}</span>
                    <span>9:00 - 16:00</span>
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
