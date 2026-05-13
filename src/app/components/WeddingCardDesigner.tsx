import {
  ArrowLeft,
  Check,
  HeartHandshake,
  LoaderCircle,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  createWeddingCardDesign,
  deleteWeddingCardDesign,
  listWeddingCardDesigns,
  updateWeddingCardDesign,
} from '../services/cardsApi';
import type { CardData, WeddingCardDesign } from '../types/weddingCard';

type LoginRedirect = 'home' | 'designer';

interface WeddingCardDesignerProps {
  onBack: () => void;
  onOpenConsult: () => void;
  onOpenLogin: (redirectTo?: LoginRedirect) => void;
}

const colorSchemes = [
  {
    id: 'red-gold',
    name: 'Do vang truyen thong',
    nameEn: 'Traditional Red & Gold',
    primary: '#8B0000',
    secondary: '#D4A017',
    surface: '#FFF7F0',
  },
  {
    id: 'pink-gold',
    name: 'Hong vang ngot ngao',
    nameEn: 'Romantic Pink & Gold',
    primary: '#D97B93',
    secondary: '#C89B3C',
    surface: '#FFF5F7',
  },
  {
    id: 'white-gold',
    name: 'Trang vang thanh lich',
    nameEn: 'Elegant White & Gold',
    primary: '#F8F5EF',
    secondary: '#B8860B',
    surface: '#FFFFFF',
  },
  {
    id: 'burgundy',
    name: 'Do ruou sang trong',
    nameEn: 'Burgundy Luxury',
    primary: '#6F1D33',
    secondary: '#D6B26E',
    surface: '#FFF7F8',
  },
  {
    id: 'sage-cream',
    name: 'Xanh sage kem',
    nameEn: 'Sage & Cream',
    primary: '#7A8E7B',
    secondary: '#E7DCCB',
    surface: '#F8F7F2',
  },
  {
    id: 'navy-champagne',
    name: 'Xanh navy champagne',
    nameEn: 'Navy & Champagne',
    primary: '#1C2A48',
    secondary: '#E1C699',
    surface: '#F6F2EB',
  },
  {
    id: 'lavender-silver',
    name: 'Tim lavender bac',
    nameEn: 'Lavender & Silver',
    primary: '#A38BBF',
    secondary: '#D7DCE5',
    surface: '#FBF9FE',
  },
  {
    id: 'terracotta-pearl',
    name: 'Dat nung ngoc trai',
    nameEn: 'Terracotta & Pearl',
    primary: '#B65E4A',
    secondary: '#F2E7E1',
    surface: '#FFF8F4',
  },
];

const backgrounds = [
  { id: 'floral', name: 'Hoa van co dien', nameEn: 'Classic Floral', pattern: 'floral' },
  { id: 'gradient', name: 'Gradient mem', nameEn: 'Soft Gradient', pattern: 'gradient' },
  { id: 'minimal', name: 'Toi gian hien dai', nameEn: 'Modern Minimal', pattern: 'minimal' },
  { id: 'luxury', name: 'Hoa tiet sang trong', nameEn: 'Luxury Pattern', pattern: 'luxury' },
  { id: 'botanical', name: 'La cay vuon xanh', nameEn: 'Botanical Garden', pattern: 'botanical' },
  { id: 'watercolor', name: 'Mau nuoc nghe thuat', nameEn: 'Watercolor Wash', pattern: 'watercolor' },
  { id: 'arch', name: 'Khung vom xu huong', nameEn: 'Editorial Arch', pattern: 'arch' },
  { id: 'starlight', name: 'Sao nhe buoi toi', nameEn: 'Starlight Evening', pattern: 'starlight' },
];

const stylePresets = [
  { id: 'classic', name: 'Co dien', nameEn: 'Classic', accent: 'Serif, formal hierarchy, timeless spacing' },
  { id: 'garden', name: 'Vuon hoa', nameEn: 'Garden', accent: 'Romantic floral mood and soft spacing' },
  { id: 'modern', name: 'Hien dai', nameEn: 'Modern', accent: 'Clean structure and crisp alignments' },
  { id: 'royal', name: 'Hoang gia', nameEn: 'Royal', accent: 'Grand framing with luxurious accents' },
  { id: 'editorial', name: 'Tap chi', nameEn: 'Editorial', accent: 'Bold typography and fashion-led layout' },
  { id: 'minimalist', name: 'Toi gian', nameEn: 'Minimalist', accent: 'Quiet whitespace and refined simplicity' },
];

const cardFormats = [{ id: 'portrait', name: 'Dung 5x7', nameEn: '5x7 Portrait' }];

const contentLanguages = [
  { id: 'vi', name: 'Tieng Viet', nameEn: 'Vietnamese' },
  { id: 'en', name: 'Tieng Anh', nameEn: 'English' },
  { id: 'bilingual', name: 'Song ngu', nameEn: 'Bilingual' },
];

const eventTypes = [
  { id: 'wedding', name: 'Le thanh hon', nameEn: 'Wedding Ceremony' },
  { id: 'engagement', name: 'Le dinh hon', nameEn: 'Engagement Ceremony' },
  { id: 'reception', name: 'Tiec cuoi', nameEn: 'Wedding Reception' },
  { id: 'save-the-date', name: 'Bao ngay vui', nameEn: 'Save the Date' },
];

const embellishmentOptions = [
  { id: 'wax-seal', name: 'Wax seal', nameEn: 'Wax seal' },
  { id: 'ribbon', name: 'Day ruy bang', nameEn: 'Ribbon wrap' },
  { id: 'venue-map', name: 'So do dia diem', nameEn: 'Venue map' },
  { id: 'monogram', name: 'Monogram', nameEn: 'Monogram' },
  { id: 'photo-panel', name: 'Khung anh doi', nameEn: 'Photo panel' },
  { id: 'qr-rsvp', name: 'QR RSVP', nameEn: 'QR RSVP' },
];

const initialCardData: CardData = {
  brideName: '',
  groomName: '',
  brideParents: '',
  groomParents: '',
  venue: '',
  date: '',
  time: '',
  colorScheme: 'red-gold',
  background: 'floral',
  stylePreset: 'classic',
  cardFormat: 'portrait',
  contentLanguage: 'bilingual',
  eventType: 'wedding',
  dressCode: '',
  rsvpContact: '',
  embellishments: ['wax-seal', 'monogram'],
};

export function WeddingCardDesigner({
  onBack,
  onOpenConsult,
  onOpenLogin,
}: WeddingCardDesignerProps) {
  useLanguage();
  const { canUseCloudSave, user } = useAuth();

  const [cardData, setCardData] = useState<CardData>(initialCardData);
  const [savedDesigns, setSavedDesigns] = useState<WeddingCardDesign[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem('wedding_card_draft');

    if (savedDraft) {
      try {
        setCardData(normalizeCardData(JSON.parse(savedDraft) as Partial<CardData>));
      } catch {
        setCardData(initialCardData);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('wedding_card_draft', JSON.stringify(cardData));
    }, 400);

    return () => clearTimeout(timer);
  }, [cardData]);

  useEffect(() => {
    if (!canUseCloudSave || !user) {
      setSavedDesigns([]);
      setSelectedDesignId(null);
      return;
    }

    void loadSavedDesigns();
  }, [canUseCloudSave, user]);

  useEffect(() => {
    if (canUseCloudSave) {
      setCloudError(null);
    }
  }, [canUseCloudSave]);

  const handleChange = (field: keyof CardData, value: string | string[]) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConsult = () => {
    onOpenConsult();
  };

  const handleSaveDesign = async () => {
    if (!canUseCloudSave || !user?.idToken) {
      setCloudError(
        'Phiên đăng nhập Google không hợp lệ. Vui lòng đăng nhập lại để lưu thiết kế lên cloud.',
      );
      return;
    }

    setIsSaving(true);
    setCloudError(null);
    setCloudMessage(null);

    const title = buildDesignTitle(cardData, savedDesigns.length + 1);

    try {
      const design = selectedDesignId
        ? await updateWeddingCardDesign(selectedDesignId, {
            title,
            status: 'draft',
            cardData,
          })
        : await createWeddingCardDesign({
            title,
            status: 'draft',
            cardData,
          });

      setSelectedDesignId(design.id);
      setCloudMessage('Đã lưu thiết kế lên cloud thành công.');
      await loadSavedDesigns();
    } catch (error) {
      const message = error instanceof Error ? error.message : null;

      setCloudError(
        message ?? 'Không thể lưu thiết kế. Hãy kiểm tra API cloud.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDesign = (design: WeddingCardDesign) => {
    setCardData(normalizeCardData(design.cardData));
    setSelectedDesignId(design.id);
    setCloudMessage('Đã nạp thiết kế đã lưu.');
    setCloudError(null);
  };

  const handleDeleteDesign = async (design: WeddingCardDesign) => {
    if (!user) {
      return;
    }

    setIsDeletingId(design.id);
    setCloudError(null);
    setCloudMessage(null);

    try {
      await deleteWeddingCardDesign(design.id);
      setSavedDesigns((prev) => prev.filter((item) => item.id !== design.id));

      if (selectedDesignId === design.id) {
        setSelectedDesignId(null);
      }

      setCloudMessage(
        'Đã xóa thiết kế khỏi cloud.',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : null;

      setCloudError(message ?? 'Không thể xóa thiết kế.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleStartNew = () => {
    setCardData(initialCardData);
    setSelectedDesignId(null);
    setCloudMessage(null);
    setCloudError(null);
  };

  const toggleEmbellishment = (itemId: string) => {
    setCardData((prev) => ({
      ...prev,
      embellishments: prev.embellishments.includes(itemId)
        ? prev.embellishments.filter((item) => item !== itemId)
        : [...prev.embellishments, itemId],
    }));
  };

  const loadSavedDesigns = async () => {
    setIsLoadingDesigns(true);
    setCloudError(null);

    try {
      const designs = await listWeddingCardDesigns();
      setSavedDesigns(designs);
    } catch (error) {
      const message = error instanceof Error ? error.message : null;

      setCloudError(message ?? 'Không thể tải danh sách thiết kế đã lưu.');
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  const selectedColor = colorSchemes.find((item) => item.id === cardData.colorScheme) || colorSchemes[0];
  const selectedBg = backgrounds.find((item) => item.id === cardData.background) || backgrounds[0];
  const selectedStyle = stylePresets.find((item) => item.id === cardData.stylePreset) || stylePresets[0];
  const selectedFormat = cardFormats.find((item) => item.id === cardData.cardFormat) || cardFormats[0];
  const selectedEvent = eventTypes.find((item) => item.id === cardData.eventType) || eventTypes[0];
  const previewTone = selectedColor.id === 'white-gold' || selectedColor.id === 'sage-cream' || selectedColor.id === 'lavender-silver'
    ? '#1F2937'
    : '#FFFFFF';

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-none border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </button>

            <div className="flex items-center gap-3">
              <Sparkles size={22} style={{ color: '#8B0000' }} />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Thiết kế thiệp cưới
                </h1>
                <p className="text-xs text-gray-500">
                  Trang thiết kế hiển thị hoàn toàn bằng tiếng Việt, có nhiều bảng màu, phong cách và item trang trí.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartNew}
              className="rounded-none border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              Mẫu mới
            </button>
            <button
              onClick={handleConsult}
              className="inline-flex items-center gap-2 rounded-none px-4 py-2 text-sm text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#8B0000' }}
            >
              <HeartHandshake size={16} />
              <span>Tư vấn đặt ngay</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 rounded-none border border-amber-100 bg-white p-5 shadow-sm lg:grid-cols-[1.25fr_1fr_auto]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cloud Save</h2>
            <p className="mt-1 text-sm text-gray-500">
              Lưu toàn bộ thuộc tính thiệp, màu sắc, phong cách và item trang trí theo tài khoản Google.
            </p>
            {cloudMessage ? <p className="mt-2 text-sm text-green-700">{cloudMessage}</p> : null}
            {cloudError ? <p className="mt-2 text-sm text-red-600">{cloudError}</p> : null}
            {!canUseCloudSave ? (
              <button
                onClick={() => onOpenLogin('designer')}
                className="mt-3 rounded-none border border-amber-300 px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-50"
              >
                Đăng nhập lại để lưu cloud
              </button>
            ) : null}
          </div>

          <div className="rounded-none p-4 text-sm text-gray-600" style={{ backgroundColor: selectedColor.surface }}>
            <p className="font-medium text-gray-900">
              {selectedDesignId
                ? 'Đang sửa bản đã lưu'
                : 'Bản nháp mới'}
            </p>
            <p className="mt-1">{selectedStyle.name}</p>
            <p className="mt-1">{selectedFormat.name}</p>
            <p className="mt-1 break-all">
              {user?.email ?? 'Chưa đăng nhập Google'}
            </p>
          </div>

          <button
            onClick={handleSaveDesign}
            disabled={!canUseCloudSave || isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-none px-4 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#8B0000' }}
          >
            {isSaving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}
            <span>
              {selectedDesignId
                ? 'Cập nhật cloud'
                : 'Lưu lên cloud'}
            </span>
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_1fr_0.9fr]">
          <div className="space-y-6 rounded-none bg-white p-6 shadow-sm">
            <SectionTitle
              title="Thông tin cơ bản"
              subtitle="Nhập các thông tin chính để hiển thị lên mặt thiệp."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Tên chú rể"
                value={cardData.groomName}
                placeholder="Nguyễn Văn A"
                onChange={(value) => handleChange('groomName', value)}
              />
              <Field
                label="Tên cô dâu"
                value={cardData.brideName}
                placeholder="Trần Thị B"
                onChange={(value) => handleChange('brideName', value)}
              />
              <Field
                label="Cha mẹ nhà trai"
                value={cardData.groomParents}
                placeholder="Ông bà Nguyễn Văn C"
                onChange={(value) => handleChange('groomParents', value)}
              />
              <Field
                label="Cha mẹ nhà gái"
                value={cardData.brideParents}
                placeholder="Ông bà Trần Văn D"
                onChange={(value) => handleChange('brideParents', value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectGrid
                label="Loại thiệp"
                items={eventTypes}
                selectedId={cardData.eventType}
                onSelect={(value) => handleChange('eventType', value)}
              />
              <SelectGrid
                label="Ngôn ngữ hiển thị"
                items={contentLanguages}
                selectedId={cardData.contentLanguage}
                onSelect={(value) => handleChange('contentLanguage', value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Địa điểm tổ chức"
                value={cardData.venue}
                placeholder="Trung tâm hội nghị Riverside"
                onChange={(value) => handleChange('venue', value)}
              />
              <Field
                label="Dress code"
                value={cardData.dressCode}
                placeholder="Formal / Pastel tones"
                onChange={(value) => handleChange('dressCode', value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Ngày tổ chức"
                value={cardData.date}
                type="date"
                onChange={(value) => handleChange('date', value)}
              />
              <Field
                label="Thời gian"
                value={cardData.time}
                type="time"
                onChange={(value) => handleChange('time', value)}
              />
            </div>

            <Field
              label="Liên hệ RSVP"
              value={cardData.rsvpContact}
              placeholder="0909 123 456 - Anna"
              onChange={(value) => handleChange('rsvpContact', value)}
            />

            <SectionTitle
              title="Màu sắc, phong cách và item"
              subtitle="Chọn bảng màu, kiểu nền và các chi tiết trang trí cho thiệp."
            />

            <div>
              <label className="mb-2 block text-sm text-gray-500">Bảng màu</label>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {colorSchemes.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleChange('colorScheme', color.id)}
                    className={`rounded-none border-2 p-3 text-left transition-all ${
                      cardData.colorScheme === color.id
                        ? 'border-amber-400 shadow-md'
                        : 'border-gray-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-7 w-7 rounded-full border border-white/70" style={{ backgroundColor: color.primary }} />
                      <span className="h-7 w-7 rounded-full border border-white/70" style={{ backgroundColor: color.secondary }} />
                      <span className="h-7 w-7 rounded-full border border-gray-200" style={{ backgroundColor: color.surface }} />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectGrid
                label="Phong cách"
                items={stylePresets}
                selectedId={cardData.stylePreset}
                onSelect={(value) => handleChange('stylePreset', value)}
              />
              <SelectGrid
                label="Kiểu nền"
                items={backgrounds}
                selectedId={cardData.background}
                onSelect={(value) => handleChange('background', value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-500">Items / embellishments</label>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {embellishmentOptions.map((item) => {
                  const isSelected = cardData.embellishments.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleEmbellishment(item.id)}
                      className={`flex items-center justify-between rounded-none border px-4 py-3 text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50 shadow-sm'
                          : 'border-gray-200 hover:border-amber-200'
                      }`}
                    >
                      <span className="text-sm text-gray-800">
                        {item.name}
                      </span>
                      {isSelected ? <Check size={16} className="text-amber-700" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:sticky md:top-28 md:self-start">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Xem trước thiệp
              </h2>
              <span className="rounded-none px-3 py-1 text-xs text-gray-700" style={{ backgroundColor: selectedColor.surface }}>
                Tỷ lệ 5x7
              </span>
            </div>

            <div className="aspect-[5/7] overflow-hidden rounded-none shadow-2xl" style={getBackgroundStyle(selectedColor, selectedBg)}>
              <div className="relative h-full w-full p-4 sm:p-5">
                {cardData.embellishments.includes('photo-panel') ? (
                  <div className="absolute right-4 top-4 h-16 w-12 rounded-none border border-white/40 bg-white/20 backdrop-blur-sm" />
                ) : null}
                {cardData.embellishments.includes('wax-seal') ? (
                  <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-[10px] font-semibold backdrop-blur-sm" style={{ color: previewTone }}>
                    SD
                  </div>
                ) : null}

                <div
                  className={`flex h-full min-h-0 flex-col ${
                    cardData.stylePreset === 'editorial' ? 'justify-between' : 'justify-center'
                  } rounded-none border px-4 py-5 text-center backdrop-blur-[1px]`}
                  style={{
                    color: previewTone,
                    borderColor:
                      previewTone === '#FFFFFF' ? 'rgba(255,255,255,0.24)' : 'rgba(31,41,55,0.14)',
                    backgroundColor:
                      previewTone === '#FFFFFF' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.42)',
                  }}
                >
                  <div className="flex h-full min-h-0 flex-col justify-between gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div
                          className="mx-auto inline-flex max-w-full rounded-none px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                          style={{
                            backgroundColor:
                              previewTone === '#FFFFFF' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {selectedEvent.name}
                        </div>

                        {renderInvitationHeading(cardData.contentLanguage)}
                      </div>

                      <div className="space-y-3">
                        <div className={`${getNameTypography(cardData.stylePreset)} break-words leading-tight`}>
                          <div>{cardData.groomName || 'Chú rể'}</div>
                          <div className="my-2 text-lg opacity-80">&</div>
                          <div>{cardData.brideName || 'Cô dâu'}</div>
                        </div>

                        <div className="mx-auto h-px w-16" style={{ backgroundColor: previewTone === '#FFFFFF' ? 'rgba(255,255,255,0.35)' : 'rgba(31,41,55,0.2)' }} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div
                        className="mx-auto grid w-full max-w-[280px] gap-2 rounded-none px-3 py-3 text-xs sm:text-sm"
                        style={{
                          backgroundColor:
                            previewTone === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.62)',
                        }}
                      >
                        <InfoLine
                          label="Ngày"
                          value={cardData.date || 'Chọn ngày tổ chức'}
                        />
                        <InfoLine
                          label="Giờ"
                          value={cardData.time || 'Chọn giờ'}
                        />
                        <InfoLine
                          label="Địa điểm"
                          value={cardData.venue || 'Nhập địa điểm'}
                        />
                        {cardData.dressCode ? (
                          <InfoLine
                            label="Dress code"
                            value={cardData.dressCode}
                          />
                        ) : null}
                        {cardData.rsvpContact ? (
                          <InfoLine
                            label="RSVP"
                            value={cardData.rsvpContact}
                          />
                        ) : null}
                      </div>

                      {cardData.embellishments.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {cardData.embellishments.map((itemId) => {
                            const match = embellishmentOptions.find((item) => item.id === itemId);

                            if (!match) {
                              return null;
                            }

                            return (
                              <span
                                key={itemId}
                                className="max-w-full rounded-none px-2.5 py-1 text-[10px] break-words text-center"
                                style={{
                                  backgroundColor:
                                    previewTone === '#FFFFFF' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.65)',
                                }}
                              >
                              {match.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-none bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Ghi chú phong cách
              </h3>
              <p className="mt-3 text-sm text-gray-700">{selectedStyle.accent}</p>
            </div>
          </div>

          <aside className="rounded-none bg-white p-6 shadow-sm xl:self-start">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Mẫu đã lưu
              </h2>
              <p className="text-sm text-gray-500">
                Mỗi bản lưu giữ nguyên màu sắc, ngôn ngữ, phong cách và item.
              </p>
            </div>

            {!canUseCloudSave ? (
              <p className="rounded-none bg-[#faf7f2] p-4 text-sm text-gray-600">
                Đăng nhập bằng Google để mở tính năng lưu và tải thiết kế trên cloud.
              </p>
            ) : isLoadingDesigns ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LoaderCircle className="animate-spin" size={16} />
                <span>Đang tải dữ liệu...</span>
              </div>
            ) : savedDesigns.length === 0 ? (
              <p className="rounded-none bg-[#faf7f2] p-4 text-sm text-gray-600">
                Chưa có thiết kế nào được lưu. Hãy lưu bản nháp đầu tiên lên cloud.
              </p>
            ) : (
              <div className="space-y-3">
                {savedDesigns.map((design) => {
                  const normalized = normalizeCardData(design.cardData);
                  const savedColor = colorSchemes.find((item) => item.id === normalized.colorScheme) || colorSchemes[0];
                  const savedStyle = stylePresets.find((item) => item.id === normalized.stylePreset) || stylePresets[0];

                  return (
                    <div
                      key={design.id}
                      className={`rounded-none border p-4 transition-colors ${
                        selectedDesignId === design.id
                          ? 'border-amber-300 bg-amber-50/50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{design.title}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(design.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      <button
                        onClick={() => void handleDeleteDesign(design)}
                        disabled={isDeletingId === design.id}
                        className="rounded-none p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
                        aria-label="Xóa thiết kế"
                      >
                          {isDeletingId === design.id ? (
                            <LoaderCircle className="animate-spin" size={15} />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: savedColor.primary }} />
                        <span className="text-xs text-gray-500">
                          {savedStyle.name}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-gray-600">
                        {(normalized.groomName || 'Chú rể')}
                        {' & '}
                        {(normalized.brideName || 'Cô dâu')}
                      </p>

                      <button
                        onClick={() => handleLoadDesign(design)}
                        className="mt-3 w-full rounded-none border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Tải vào trình sửa
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-none border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
      />
    </div>
  );
}

function SelectGrid({
  items,
  label,
  onSelect,
  selectedId,
}: {
  items: Array<{ id: string; name: string; nameEn: string }>;
  label: string;
  onSelect: (value: string) => void;
  selectedId: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-500">{label}</label>
      <div className="grid gap-2">
        {items.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`rounded-none border px-3 py-2.5 text-left text-sm transition-all ${
                isSelected
                  ? 'border-amber-400 bg-amber-50 shadow-sm'
                  : 'border-gray-200 hover:border-amber-200'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[64px_1fr] items-start gap-2 text-left">
      <span className="text-[10px] uppercase tracking-[0.16em] opacity-65">{label}</span>
      <span className="break-words leading-5">{value}</span>
    </div>
  );
}

function getBackgroundStyle(
  selectedColor: { primary: string; secondary: string; surface: string },
  selectedBg: { pattern: string },
) {
  const base = { backgroundColor: selectedColor.primary };

  switch (selectedBg.pattern) {
    case 'gradient':
      return {
        background: `linear-gradient(135deg, ${selectedColor.primary} 0%, ${selectedColor.secondary} 100%)`,
      };
    case 'floral':
      return {
        ...base,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22) 0, transparent 18%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.16) 0, transparent 16%), radial-gradient(circle at 35% 78%, rgba(255,255,255,0.18) 0, transparent 14%)',
      };
    case 'luxury':
      return {
        ...base,
        backgroundImage:
          'linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.08) 75%, transparent 75%, transparent)',
        backgroundSize: '28px 28px',
      };
    case 'botanical':
      return {
        ...base,
        backgroundImage:
          'radial-gradient(circle at 10% 90%, rgba(255,255,255,0.15) 0, transparent 22%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.14) 0, transparent 22%)',
      };
    case 'watercolor':
      return {
        background: `linear-gradient(160deg, ${selectedColor.primary} 0%, ${selectedColor.secondary} 45%, ${selectedColor.surface} 100%)`,
      };
    case 'arch':
      return {
        ...base,
        backgroundImage:
          'linear-gradient(transparent 58%, rgba(255,255,255,0.08) 58%), radial-gradient(circle at 50% 24%, rgba(255,255,255,0.16) 0, transparent 24%)',
      };
    case 'starlight':
      return {
        ...base,
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.32) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      };
    default:
      return base;
  }
}

function renderInvitationHeading(contentLanguage: string) {
  if (contentLanguage === 'vi') {
    return <div className="text-xs uppercase tracking-[0.3em] opacity-90">TRÂN TRỌNG KÍNH MỜI</div>;
  }

  if (contentLanguage === 'en') {
    return <div className="text-xs uppercase tracking-[0.3em] opacity-90">CORDIALLY INVITE YOU</div>;
  }

  return (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-[0.3em] opacity-90">TRÂN TRỌNG KÍNH MỜI</div>
      <div className="text-[11px] uppercase tracking-[0.28em] opacity-75">MỘT THIỆP SONG NGỮ</div>
      <div className="text-xs uppercase tracking-[0.3em] opacity-90">CORDIALLY INVITE YOU</div>
    </div>
  );
}

function getNameTypography(stylePreset: string) {
  switch (stylePreset) {
    case 'royal':
      return 'text-[1.9rem] font-semibold tracking-[0.08em]';
    case 'editorial':
      return 'text-[1.95rem] font-light uppercase tracking-[0.1em]';
    case 'modern':
      return 'text-[1.8rem] font-semibold';
    case 'minimalist':
      return 'text-[1.7rem] font-medium';
    case 'garden':
      return 'text-[1.85rem] italic';
    default:
      return 'text-[1.85rem] font-semibold';
  }
}

function normalizeCardData(cardData?: Partial<CardData> | null): CardData {
  if (!cardData || typeof cardData !== 'object') {
    return initialCardData;
  }

  return {
    ...initialCardData,
    ...cardData,
    cardFormat: 'portrait',
    embellishments: Array.isArray(cardData.embellishments)
      ? cardData.embellishments.filter((item): item is string => typeof item === 'string')
      : initialCardData.embellishments,
  };
}

function buildDesignTitle(cardData: CardData, sequence: number) {
  const groom = cardData.groomName.trim();
  const bride = cardData.brideName.trim();
  const eventLabel =
    cardData.eventType === 'engagement'
      ? 'Đính hôn'
      : cardData.eventType === 'reception'
        ? 'Tiệc cưới'
        : cardData.eventType === 'save-the-date'
          ? 'Save the Date'
          : 'Thành hôn';

  if (groom || bride) {
    return `${eventLabel} - ${groom || 'Chú rể'} & ${
      bride || 'Cô dâu'
    }`;
  }

  return `Bản nháp thiệp #${sequence}`;
}
