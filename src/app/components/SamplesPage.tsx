import { ArrowLeft, Eye, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SamplesPageProps {
  onBack: () => void;
  onOpenContact: () => void;
}

const SAMPLE_PRODUCTS = [
  {
    imageUrl: '/images/pic1.jpg',
    viTitle: 'Thiệp cưới hoa đỏ sang trọng',
    enTitle: 'Elegant red floral wedding card',
    viSubtitle: 'Phong cách cổ điển, giấy mỹ thuật dập nổi',
    enSubtitle: 'Classic style with embossed fine-art paper',
  },
  {
    imageUrl: '/images/pic2.jpg',
    viTitle: 'Thiệp cưới tối giản hiện đại',
    enTitle: 'Modern minimalist wedding invitation',
    viSubtitle: 'Tông trắng kem, chữ nhũ vàng',
    enSubtitle: 'Cream white tone with gold foil typography',
  },
  {
    imageUrl: '/images/pic3.jpg',
    viTitle: 'Mẫu danh thiếp cao cấp',
    enTitle: 'Premium business card set',
    viSubtitle: 'In sắc nét, phù hợp cá nhân và doanh nghiệp',
    enSubtitle: 'Sharp printing for personal and corporate use',
  },
  {
    imageUrl: '/images/pic4.jpg',
    viTitle: 'Thiệp mời sự kiện thanh lịch',
    enTitle: 'Refined event invitation card',
    viSubtitle: 'Thiết kế tinh gọn, nhấn màu vàng champagne',
    enSubtitle: 'Clean design with champagne gold accents',
  },
  {
    imageUrl: '/images/pic1.jpg',
    viTitle: 'Thiệp cưới tone pastel',
    enTitle: 'Pastel wedding invitation',
    viSubtitle: 'Mềm mại, trẻ trung, dễ tùy biến',
    enSubtitle: 'Soft, youthful, and easy to customize',
  },
  {
    imageUrl: '/images/pic2.jpg',
    viTitle: 'Thiệp cưới premium hộp cứng',
    enTitle: 'Premium boxed invitation set',
    viSubtitle: 'Phù hợp lễ cưới cao cấp và quà tặng',
    enSubtitle: 'Great for premium weddings and gift presentation',
  },
];

export function SamplesPage({ onBack, onOpenContact }: SamplesPageProps) {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_35%,#fffaf4_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-none border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
          </button>

          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 rounded-none px-5 py-2.5 text-sm text-white transition-all hover:shadow-lg"
            style={{ backgroundColor: '#8B0000' }}
          >
            <MessageCircle size={16} />
            <span>{language === 'vi' ? 'Tư vấn ngay' : 'Chat now'}</span>
          </button>
        </div>

        <section className="mb-10 rounded-none border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(139,0,0,0.08)] backdrop-blur sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-none bg-red-50 px-4 py-1.5 text-sm text-red-700">
                {language === 'vi' ? 'Bộ sưu tập thiệp mẫu' : 'Sample invitation collection'}
              </div>
              <h1 className="mb-4 text-4xl font-semibold text-gray-900 sm:text-5xl">
                {language === 'vi'
                  ? 'Một trang riêng để xem mẫu thiệp trước khi tư vấn'
                  : 'A dedicated page to browse invitation samples before chatting'}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-gray-600">
                {language === 'vi'
                  ? 'Khách hàng có thể xem nhanh các mẫu thiệp cưới, danh thiếp và thiệp mời nổi bật. Khi thấy mẫu phù hợp, chỉ cần bấm tư vấn để chat trực tiếp với admin.'
                  : 'Customers can quickly browse featured wedding cards, business cards, and event invitations. Once they find a style they like, they can jump straight into chat with the admin.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SAMPLE_PRODUCTS.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-none border border-white bg-white shadow-lg ${
                    index % 2 === 0 ? 'translate-y-0' : 'translate-y-6'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={language === 'vi' ? item.viTitle : item.enTitle}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SAMPLE_PRODUCTS.map((item, index) => (
            <article
              key={index}
              className="group overflow-hidden rounded-none border border-amber-100 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(139,0,0,0.12)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={language === 'vi' ? item.viTitle : item.enTitle}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-none bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  <Eye size={14} />
                  <span>{language === 'vi' ? 'Mẫu nổi bật' : 'Featured sample'}</span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {language === 'vi' ? item.viTitle : item.enTitle}
                </h2>
                <p className="mb-5 text-sm leading-6 text-gray-600">
                  {language === 'vi' ? item.viSubtitle : item.enSubtitle}
                </p>
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-2 rounded-none bg-amber-50 px-4 py-2 text-sm text-amber-800 transition-colors hover:bg-amber-100"
                >
                  <MessageCircle size={15} />
                  <span>{language === 'vi' ? 'Hỏi mẫu này' : 'Ask about this sample'}</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
