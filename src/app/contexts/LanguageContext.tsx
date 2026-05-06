import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  vi: {
    // Header
    'header.tagline': 'Thiệp cưới • Danh thiếp • In ấn',
    'nav.home': 'Trang chủ',
    'nav.services': 'Dịch vụ',
    'nav.wedding': 'Thiệp cưới',
    'nav.business': 'Danh thiếp',
    'nav.accessories': 'Phụ kiện cưới',
    'nav.contact': 'Liên hệ',
    'header.cta': 'Đặt thiết kế ngay',

    // Hero
    'hero.title': 'Thiệp Cưới & Danh Thiếp Đẹp, Tinh Tế, In Nhanh',
    'hero.subtitle': 'Tiến Đạt mang đến các mẫu thiệp cưới, danh thiếp và sản phẩm in ấn được thiết kế chỉn chu, sang trọng và phù hợp với từng nhu cầu.',
    'hero.btn1': 'Xem mẫu thiết kế',
    'hero.btn2': 'Liên hệ tư vấn',
    'hero.card1': 'Thiệp Cưới',
    'hero.card1sub': 'Cao Cấp',
    'hero.card2': 'Danh Thiếp',
    'hero.card3': 'Business Card',
    'hero.card4': 'Thiệp Mời',
    'hero.card4sub': 'Sự Kiện',

    // Cloud Features
    'cloud.title': 'Dịch vụ thiết kế & quản lý đơn hàng thông minh',
    'cloud.subtitle': 'Hệ thống quản lý thiết kế và đơn hàng trên nền tảng web, giúp bạn dễ dàng theo dõi và tương tác với dịch vụ của chúng tôi',
    'cloud.feature1.title': 'Gửi yêu cầu thiết kế online',
    'cloud.feature1.desc': 'Khách hàng có thể gửi yêu cầu thiết kế trực tuyến, tiết kiệm thời gian và thuận tiện',
    'cloud.feature2.title': 'Thư viện mẫu trên cloud',
    'cloud.feature2.desc': 'Xem lại các mẫu thiệp và thiết kế mẫu đã lưu bất cứ lúc nào, mọi nơi',
    'cloud.feature3.title': 'Theo dõi đơn hàng',
    'cloud.feature3.desc': 'Theo dõi tiến độ in ấn, duyệt mẫu và giao hàng trực tuyến một cách minh bạch',

    // Services
    'services.title': 'Dịch vụ của chúng tôi',
    'services.subtitle': 'Đa dạng sản phẩm in ấn chất lượng cao phục vụ mọi nhu cầu của bạn',
    'services.service1.title': 'Thiệp cưới cao cấp',
    'services.service1.desc': 'Thiết kế độc đáo, in trên giấy cao cấp với nhiều tùy chọn hoàn thiện sang trọng',
    'services.service2.title': 'Danh thiếp cá nhân & doanh nghiệp',
    'services.service2.desc': 'Tạo ấn tượng chuyên nghiệp với danh thiếp thiết kế tinh tế, chất lượng in hoàn hảo',
    'services.service3.title': 'Thiệp mời sự kiện',
    'services.service3.desc': 'Thiệp mời sinh nhật, khai trương, hội nghị với thiết kế phù hợp từng dịp',
    'services.service4.title': 'In ấn theo yêu cầu',
    'services.service4.desc': 'Catalogue, brochure, menu, và các sản phẩm in ấn khác theo nhu cầu riêng',
    'services.more': 'Xem thêm',

    // Wedding Accessories
    'accessories.title': 'Phụ kiện cưới',
    'accessories.subtitle': 'Trang trí và phụ kiện cưới đẹp, sang trọng cho ngày trọng đại của bạn',
    'accessories.inquire': 'Liên hệ đặt hàng',
    'accessories.item1.title': 'Hoa cầm tay cô dâu',
    'accessories.item1.desc': 'Hoa cầm tay tươi thiết kế tinh tế, phù hợp phong cách đám cưới',
    'accessories.item2.title': 'Bàn ký tên',
    'accessories.item2.desc': 'Bàn ký tên trang trí sang trọng với backdrop đẹp mắt',
    'accessories.item3.title': 'Khung backdrop chụp ảnh',
    'accessories.item3.desc': 'Backdrop độc đáo làm nổi bật khoảnh khắc của bạn',
    'accessories.item4.title': 'Bảng welcome',
    'accessories.item4.desc': 'Bảng welcome khung gỗ, acrylic đẹp và chuyên nghiệp',
    'accessories.item5.title': 'Hoa trang trí tiệc cưới',
    'accessories.item5.desc': 'Hoa trang trí bàn tiệc, backdrop và lối đi tiệc cưới',
    'accessories.item6.title': 'Khung ảnh cưới',
    'accessories.item6.desc': 'Khung ảnh trang trí bàn ký tên và khu vực tiệc',
    'accessories.item7.title': 'Dây đèn trang trí',
    'accessories.item7.desc': 'Đèn led, đèn fairy light tạo không gian lãng mạn',
    'accessories.item8.title': 'Bộ trang trí bàn tiệc',
    'accessories.item8.desc': 'Khăn trải bàn, nến, hoa và phụ kiện trang trí bàn',

    // Process
    'process.title': 'Quy trình đặt hàng',
    'process.subtitle': 'Đơn giản, nhanh chóng và minh bạch',
    'process.step1.title': 'Gửi yêu cầu thiết kế',
    'process.step1.desc': 'Liên hệ và chia sẻ ý tưởng của bạn',
    'process.step2.title': 'Chọn mẫu & chỉnh sửa',
    'process.step2.desc': 'Xem mẫu và tùy chỉnh theo ý muốn',
    'process.step3.title': 'Xác nhận bản in',
    'process.step3.desc': 'Duyệt thiết kế cuối cùng',
    'process.step4.title': 'Nhận sản phẩm hoàn thiện',
    'process.step4.desc': 'Nhận hàng đúng hẹn, chất lượng cao',

    // Why Choose Us
    'why.title': 'Tại sao chọn Tiến Đạt?',
    'why.reason1.title': 'Thiết kế tinh tế',
    'why.reason1.desc': 'Mỗi thiết kế đều được chăm chút tỉ mỉ',
    'why.reason2.title': 'In nhanh, đúng hẹn',
    'why.reason2.desc': 'Cam kết giao hàng đúng thời gian',
    'why.reason3.title': 'Mẫu mã đa dạng',
    'why.reason3.desc': 'Hàng trăm mẫu phù hợp mọi phong cách',
    'why.reason4.title': 'Hỗ trợ chỉnh sửa',
    'why.reason4.desc': 'Tùy chỉnh theo yêu cầu riêng',

    // Contact
    'contact.title': 'Bạn cần thiết kế thiệp cưới hoặc danh thiếp?',
    'contact.subtitle': 'Gửi yêu cầu ngay để được tư vấn miễn phí',
    'contact.form.title': 'Gửi yêu cầu tư vấn',
    'contact.form.name': 'Họ và tên',
    'contact.form.name.placeholder': 'Nhập họ và tên của bạn',
    'contact.form.phone': 'Số điện thoại',
    'contact.form.phone.placeholder': 'Nhập số điện thoại',
    'contact.form.product': 'Loại sản phẩm cần in',
    'contact.form.product.option1': 'Thiệp cưới',
    'contact.form.product.option2': 'Danh thiếp',
    'contact.form.product.option3': 'Thiệp mời sự kiện',
    'contact.form.product.option4': 'In ấn khác',
    'contact.form.message': 'Nội dung yêu cầu',
    'contact.form.message.placeholder': 'Mô tả chi tiết yêu cầu của bạn...',
    'contact.form.submit': 'Gửi yêu cầu tư vấn',
    'contact.info.title': 'Thông tin liên hệ',
    'contact.info.hotline': 'Hotline',
    'contact.info.address': 'Địa chỉ cửa hàng',
    'contact.info.address.value': 'Cập nhật sau',
    'contact.connect': 'Kết nối với chúng tôi',
    'contact.hours.title': 'Giờ làm việc',
    'contact.hours.weekday': 'Thứ 2 - Thứ 6:',
    'contact.hours.saturday': 'Thứ 7:',
    'contact.hours.sunday': 'Chủ nhật:',

    // Footer
    'footer.description': 'Chuyên thiệp cưới, danh thiếp và in ấn theo yêu cầu. Mang đến sản phẩm chất lượng cao với thiết kế tinh tế, phù hợp cho mọi dịp đặc biệt của bạn.',
    'footer.services': 'Dịch vụ',
    'footer.about': 'Về chúng tôi',
    'footer.about.intro': 'Giới thiệu',
    'footer.about.process': 'Quy trình',
    'footer.about.policy': 'Chính sách',
    'footer.copyright': '© 2026 Thiệp Cưới – Danh Thiếp Tiến Đạt. All rights reserved.',
  },
  en: {
    // Header
    'header.tagline': 'Wedding Cards • Business Cards • Printing',
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.wedding': 'Wedding Cards',
    'nav.business': 'Business Cards',
    'nav.accessories': 'Wedding Accessories',
    'nav.contact': 'Contact',
    'header.cta': 'Order Design Now',

    // Hero
    'hero.title': 'Beautiful Wedding & Business Cards, Fast Printing',
    'hero.subtitle': 'Tien Dat brings you meticulously designed wedding cards, business cards, and premium printing products tailored to your every need.',
    'hero.btn1': 'View Designs',
    'hero.btn2': 'Contact Consultant',
    'hero.card1': 'Wedding',
    'hero.card1sub': 'Premium',
    'hero.card2': 'Business Card',
    'hero.card3': 'Business Card',
    'hero.card4': 'Invitation',
    'hero.card4sub': 'Event',

    // Cloud Features
    'cloud.title': 'Smart Design & Order Management Service',
    'cloud.subtitle': 'Web-based design and order management system, making it easy to track and interact with our services',
    'cloud.feature1.title': 'Online design requests',
    'cloud.feature1.desc': 'Customers can submit design requests online, saving time and convenient',
    'cloud.feature2.title': 'Cloud gallery',
    'cloud.feature2.desc': 'Access saved card templates and sample designs anytime, anywhere',
    'cloud.feature3.title': 'Order tracking',
    'cloud.feature3.desc': 'Track printing progress, approval, and delivery status online transparently',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Diverse high-quality printing products serving all your needs',
    'services.service1.title': 'Premium wedding cards',
    'services.service1.desc': 'Unique designs, printed on premium paper with luxury finishing options',
    'services.service2.title': 'Personal & corporate business cards',
    'services.service2.desc': 'Make professional impressions with elegantly designed cards and perfect printing quality',
    'services.service3.title': 'Event invitations',
    'services.service3.desc': 'Birthday, grand opening, conference invitations with designs suitable for every occasion',
    'services.service4.title': 'Custom printing',
    'services.service4.desc': 'Catalogues, brochures, menus, and other printing products based on specific needs',
    'services.more': 'Learn more',

    // Wedding Accessories
    'accessories.title': 'Wedding Accessories',
    'accessories.subtitle': 'Beautiful and elegant wedding decorations and accessories for your special day',
    'accessories.inquire': 'Inquire now',
    'accessories.item1.title': 'Bridal bouquet',
    'accessories.item1.desc': 'Fresh bridal bouquet designed to match your wedding style',
    'accessories.item2.title': 'Guest book table',
    'accessories.item2.desc': 'Elegant guest book table with beautiful backdrop',
    'accessories.item3.title': 'Photo backdrop',
    'accessories.item3.desc': 'Unique backdrops to highlight your special moments',
    'accessories.item4.title': 'Welcome sign',
    'accessories.item4.desc': 'Beautiful wooden or acrylic welcome signs',
    'accessories.item5.title': 'Wedding floral decor',
    'accessories.item5.desc': 'Floral decorations for tables, backdrops and aisle',
    'accessories.item6.title': 'Wedding photo frames',
    'accessories.item6.desc': 'Decorative photo frames for guest book and reception area',
    'accessories.item7.title': 'Decorative lights',
    'accessories.item7.desc': 'LED and fairy lights creating romantic ambiance',
    'accessories.item8.title': 'Table decor set',
    'accessories.item8.desc': 'Table linens, candles, flowers and decorative accessories',

    // Process
    'process.title': 'Ordering Process',
    'process.subtitle': 'Simple, fast and transparent',
    'process.step1.title': 'Submit design request',
    'process.step1.desc': 'Contact and share your ideas',
    'process.step2.title': 'Choose & customize',
    'process.step2.desc': 'View samples and customize as desired',
    'process.step3.title': 'Confirm print',
    'process.step3.desc': 'Approve final design',
    'process.step4.title': 'Receive finished product',
    'process.step4.desc': 'On-time delivery, high quality',

    // Why Choose Us
    'why.title': 'Why Choose Tien Dat?',
    'why.reason1.title': 'Elegant design',
    'why.reason1.desc': 'Every design is meticulously crafted',
    'why.reason2.title': 'Fast, on-time printing',
    'why.reason2.desc': 'Committed to on-time delivery',
    'why.reason3.title': 'Diverse designs',
    'why.reason3.desc': 'Hundreds of styles for all tastes',
    'why.reason4.title': 'Edit support',
    'why.reason4.desc': 'Customization to specific requirements',

    // Contact
    'contact.title': 'Need wedding cards or business cards?',
    'contact.subtitle': 'Submit your request now for free consultation',
    'contact.form.title': 'Request Consultation',
    'contact.form.name': 'Full name',
    'contact.form.name.placeholder': 'Enter your full name',
    'contact.form.phone': 'Phone number',
    'contact.form.phone.placeholder': 'Enter phone number',
    'contact.form.product': 'Product type',
    'contact.form.product.option1': 'Wedding cards',
    'contact.form.product.option2': 'Business cards',
    'contact.form.product.option3': 'Event invitations',
    'contact.form.product.option4': 'Other printing',
    'contact.form.message': 'Requirements',
    'contact.form.message.placeholder': 'Describe your requirements in detail...',
    'contact.form.submit': 'Submit Request',
    'contact.info.title': 'Contact Information',
    'contact.info.hotline': 'Hotline',
    'contact.info.address': 'Store address',
    'contact.info.address.value': 'To be updated',
    'contact.connect': 'Connect with us',
    'contact.hours.title': 'Business Hours',
    'contact.hours.weekday': 'Mon - Fri:',
    'contact.hours.saturday': 'Saturday:',
    'contact.hours.sunday': 'Sunday:',

    // Footer
    'footer.description': 'Specializing in wedding cards, business cards and custom printing. Delivering high-quality products with elegant designs, suitable for all your special occasions.',
    'footer.services': 'Services',
    'footer.about': 'About Us',
    'footer.about.intro': 'Introduction',
    'footer.about.process': 'Process',
    'footer.about.policy': 'Policy',
    'footer.copyright': '© 2026 Tien Dat Wedding & Business Cards. All rights reserved.',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.vi] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
