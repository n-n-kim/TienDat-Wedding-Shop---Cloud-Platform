import { ArrowLeft, LoaderCircle, Save, Sparkles, Trash2 } from 'lucide-react';
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

interface WeddingCardDesignerProps {
  onBack: () => void;
}

const colorSchemes = [
  { id: 'red-gold', name: 'Do vang truyen thong', nameEn: 'Traditional Red & Gold', primary: '#8B0000', secondary: '#B8860B' },
  { id: 'pink-gold', name: 'Hong vang nhe nhang', nameEn: 'Soft Pink & Gold', primary: '#FFB6C1', secondary: '#B8860B' },
  { id: 'white-gold', name: 'Trang vang thanh lich', nameEn: 'Elegant White & Gold', primary: '#FFFFFF', secondary: '#B8860B' },
  { id: 'burgundy', name: 'Do burgundy sang trong', nameEn: 'Luxury Burgundy', primary: '#800020', secondary: '#B8860B' },
];

const backgrounds = [
  { id: 'floral', name: 'Hoa van co dien', nameEn: 'Classic Floral', pattern: 'floral' },
  { id: 'gradient', name: 'Gradient muot ma', nameEn: 'Smooth Gradient', pattern: 'gradient' },
  { id: 'minimal', name: 'Toi gian hien dai', nameEn: 'Modern Minimal', pattern: 'minimal' },
  { id: 'luxury', name: 'Hoa van sang trong', nameEn: 'Luxury Pattern', pattern: 'luxury' },
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
};

export function WeddingCardDesigner({ onBack }: WeddingCardDesignerProps) {
  const { language } = useLanguage();
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
      setCardData(JSON.parse(savedDraft));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('wedding_card_draft', JSON.stringify(cardData));
    }, 500);
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

  const handleChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConsult = () => {
    alert(
      language === 'vi'
        ? 'Thiet ke cua ban da duoc luu! Chung toi se lien he tu van som.'
        : 'Your design has been saved! We will contact you soon.',
    );
  };

  const handleSaveDesign = async () => {
    if (!user) {
      setCloudError(
        language === 'vi'
          ? 'Vui long dang nhap de luu thiet ke len cloud.'
          : 'Please sign in to save designs to the cloud.',
      );
      return;
    }

    setIsSaving(true);
    setCloudError(null);
    setCloudMessage(null);

    const title = buildDesignTitle(cardData, savedDesigns.length + 1, language);

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
      setCloudMessage(
        language === 'vi'
          ? 'Da luu thiet ke len cloud thanh cong.'
          : 'Design saved to the cloud successfully.',
      );
      await loadSavedDesigns();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : null;

      setCloudError(
        message ??
          (language === 'vi'
            ? 'Khong the luu thiet ke. Hay kiem tra API cloud.'
            : 'Could not save design. Check the cloud API configuration.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDesign = (design: WeddingCardDesign) => {
    setCardData(design.cardData);
    setSelectedDesignId(design.id);
    setCloudMessage(
      language === 'vi'
        ? 'Da nap thiet ke da luu.'
        : 'Saved design loaded.',
    );
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
        language === 'vi'
          ? 'Da xoa thiet ke khoi cloud.'
          : 'Design deleted from the cloud.',
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : null;

      setCloudError(
        message ??
          (language === 'vi'
            ? 'Khong the xoa thiet ke.'
            : 'Could not delete the design.'),
      );
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

  const loadSavedDesigns = async () => {
    setIsLoadingDesigns(true);
    setCloudError(null);

    try {
      const designs = await listWeddingCardDesigns();
      setSavedDesigns(designs);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : null;

      setCloudError(
        message ??
          (language === 'vi'
            ? 'Khong the tai danh sach thiet ke da luu.'
            : 'Could not load saved designs.'),
      );
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  const selectedColor = colorSchemes.find((c) => c.id === cardData.colorScheme);
  const selectedBg = backgrounds.find((b) => b.id === cardData.background);

  const getBackgroundStyle = () => {
    const base = { backgroundColor: selectedColor?.primary };

    switch (selectedBg?.pattern) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${selectedColor?.primary} 0%, ${selectedColor?.secondary} 100%)`,
        };
      case 'floral':
        return {
          ...base,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        };
      case 'luxury':
        return {
          ...base,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        };
      default:
        return base;
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              <span>{language === 'vi' ? 'Quay lai' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-3">
              <Sparkles size={22} style={{ color: '#8B0000' }} />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {language === 'vi' ? 'Thiet ke thiep cuoi' : 'Design Wedding Card'}
                </h1>
                {canUseCloudSave ? (
                  <p className="text-xs text-green-700">
                    {language === 'vi'
                      ? 'Ban nhap dang duoc luu local va co the dong bo len cloud'
                      : 'Your draft is auto-saved locally and can be synced to the cloud'}
                  </p>
                ) : (
                  <p className="text-xs text-amber-700">
                    {language === 'vi'
                      ? 'Dang nhap de luu thiet ke len cloud'
                      : 'Sign in to save your design to the cloud'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartNew}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {language === 'vi' ? 'Mau moi' : 'New Draft'}
            </button>
            <button
              onClick={handleConsult}
              className="rounded-lg px-4 py-2 text-sm text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#8B0000' }}
            >
              {language === 'vi' ? 'Tu van dat ngay' : 'Consult & Order'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm lg:grid-cols-[1.2fr_1fr_auto]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'vi' ? 'Cloud Save' : 'Cloud Save'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {language === 'vi'
                ? 'Luu mau thiep theo tai khoan Google de mo lai tren bat ky trinh duyet nao.'
                : 'Save your wedding card under your Google account and reopen it from any browser.'}
            </p>
            {cloudMessage ? <p className="mt-2 text-sm text-green-700">{cloudMessage}</p> : null}
            {cloudError ? <p className="mt-2 text-sm text-red-600">{cloudError}</p> : null}
          </div>

          <div className="rounded-xl bg-[#faf7f2] p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900">
              {selectedDesignId
                ? language === 'vi'
                  ? 'Dang sua ban da luu'
                  : 'Editing saved design'
                : language === 'vi'
                  ? 'Ban nhap moi'
                  : 'New draft'}
            </p>
            <p className="mt-1 break-all">
              {user?.email ??
                (language === 'vi' ? 'Chua dang nhap Google' : 'Google sign-in not available')}
            </p>
          </div>

            <button
              onClick={handleSaveDesign}
            disabled={!canUseCloudSave || isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#8B0000' }}
          >
            {isSaving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}
            <span>
              {selectedDesignId
                ? language === 'vi'
                  ? 'Cap nhat cloud'
                  : 'Update Cloud Save'
                : language === 'vi'
                  ? 'Luu len cloud'
                  : 'Save to Cloud'}
            </span>
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr_0.9fr]">
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {language === 'vi' ? 'Thong tin thiep cuoi' : 'Wedding Card Information'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-gray-500">
                      {language === 'vi' ? 'Ten chu re' : 'Groom Name'}
                    </label>
                    <input
                      type="text"
                      value={cardData.groomName}
                      onChange={(e) => handleChange('groomName', e.target.value)}
                      placeholder={language === 'vi' ? 'Nguyen Van A' : 'John Doe'}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-500">
                      {language === 'vi' ? 'Ten co dau' : 'Bride Name'}
                    </label>
                    <input
                      type="text"
                      value={cardData.brideName}
                      onChange={(e) => handleChange('brideName', e.target.value)}
                      placeholder={language === 'vi' ? 'Tran Thi B' : 'Jane Smith'}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-500">
                    {language === 'vi' ? 'Cha me nha trai' : "Groom's Parents"}
                  </label>
                  <input
                    type="text"
                    value={cardData.groomParents}
                    onChange={(e) => handleChange('groomParents', e.target.value)}
                    placeholder={language === 'vi' ? 'Ong Nguyen Van C & Ba Nguyen Thi D' : 'Mr. & Mrs. Doe'}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-500">
                    {language === 'vi' ? 'Cha me nha gai' : "Bride's Parents"}
                  </label>
                  <input
                    type="text"
                    value={cardData.brideParents}
                    onChange={(e) => handleChange('brideParents', e.target.value)}
                    placeholder={language === 'vi' ? 'Ong Tran Van E & Ba Tran Thi F' : 'Mr. & Mrs. Smith'}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-500">
                    {language === 'vi' ? 'Dia diem to chuc' : 'Venue'}
                  </label>
                  <input
                    type="text"
                    value={cardData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    placeholder={language === 'vi' ? 'Trung tam tiec cuoi...' : 'Wedding venue...'}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-gray-500">
                      {language === 'vi' ? 'Ngay to chuc' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={cardData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-500">
                      {language === 'vi' ? 'Thoi gian' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={cardData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-colors focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {language === 'vi' ? 'Mau sac va phong cach' : 'Color & Style'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-500">
                    {language === 'vi' ? 'Bang mau' : 'Color Scheme'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {colorSchemes.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleChange('colorScheme', color.id)}
                        className={`rounded-lg border-2 p-3 transition-all ${
                          cardData.colorScheme === color.id ? 'border-amber-400 shadow-md' : 'border-gray-200'
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color.primary }} />
                          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color.secondary }} />
                        </div>
                        <div className="text-xs">
                          {language === 'vi' ? color.name : color.nameEn}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-500">
                    {language === 'vi' ? 'Kieu nen' : 'Background Style'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => handleChange('background', bg.id)}
                        className={`rounded-lg border-2 p-3 text-left transition-all ${
                          cardData.background === bg.id ? 'border-amber-400 shadow-md' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-sm">
                          {language === 'vi' ? bg.name : bg.nameEn}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:sticky md:top-28 md:self-start">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'vi' ? 'Xem truoc thiep' : 'Preview'}
            </h2>

            <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl" style={getBackgroundStyle()}>
              <div
                className="flex h-full flex-col items-center justify-center p-8 text-center"
                style={{ color: selectedColor?.id.includes('white') ? '#000' : '#fff' }}
              >
                <div className="space-y-6">
                  <div style={{ fontSize: '0.875rem', letterSpacing: '0.2em', opacity: 0.9 }}>
                    {language === 'vi' ? 'TRAN TRONG KINH MOI' : 'CORDIALLY INVITE YOU'}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                      {cardData.groomParents || (language === 'vi' ? 'Cha me nha trai' : "Groom's Parents")}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '1rem' }}>
                      {cardData.brideParents || (language === 'vi' ? 'Cha me nha gai' : "Bride's Parents")}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.9 }}>
                    {language === 'vi' ? 'Tran trong kinh moi den du tiec cuoi cua' : 'To the wedding celebration of'}
                  </div>

                  <div style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
                    {cardData.groomName || (language === 'vi' ? 'Chu re' : 'Groom')}
                    <div style={{ fontSize: '1.5rem', margin: '0.5rem 0', opacity: 0.9 }}>&</div>
                    {cardData.brideName || (language === 'vi' ? 'Co dau' : 'Bride')}
                  </div>

                  <div
                    className="pt-4"
                    style={{
                      borderTop: `1px solid ${
                        selectedColor?.id.includes('white') ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
                      }`,
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {cardData.venue || (language === 'vi' ? 'Dia diem to chuc' : 'Venue')}
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {cardData.date || (language === 'vi' ? 'Ngay' : 'Date')} {cardData.time ? `- ${cardData.time}` : ''}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', opacity: 0.8, fontStyle: 'italic' }}>
                    {language === 'vi'
                      ? 'Su hien dien cua quy khach la niem vinh hanh cua gia dinh chung toi'
                      : 'Your presence is the greatest gift'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-6 shadow-sm xl:self-start">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {language === 'vi' ? 'Mau da luu' : 'Saved Designs'}
                </h2>
                <p className="text-sm text-gray-500">
                  {language === 'vi'
                    ? 'Du lieu duoc luu theo tai khoan va dong bo qua cloud API.'
                    : 'Saved under the signed-in account and synced through the cloud API.'}
                </p>
              </div>
            </div>

            {!canUseCloudSave ? (
              <p className="rounded-xl bg-[#faf7f2] p-4 text-sm text-gray-600">
                {language === 'vi'
                  ? 'Dang nhap bang Google de mo tinh nang luu va tai thiet ke tren cloud.'
                  : 'Sign in with Google to enable cloud save and design restore.'}
              </p>
            ) : isLoadingDesigns ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LoaderCircle className="animate-spin" size={16} />
                <span>{language === 'vi' ? 'Dang tai du lieu...' : 'Loading designs...'}</span>
              </div>
            ) : savedDesigns.length === 0 ? (
              <p className="rounded-xl bg-[#faf7f2] p-4 text-sm text-gray-600">
                {language === 'vi'
                  ? 'Chua co thiet ke nao duoc luu. Hay luu ban nhap dau tien len cloud.'
                  : 'No saved designs yet. Save your first draft to the cloud.'}
              </p>
            ) : (
              <div className="space-y-3">
                {savedDesigns.map((design) => (
                  <div
                    key={design.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      selectedDesignId === design.id ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200'
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
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
                        aria-label={language === 'vi' ? 'Xoa thiet ke' : 'Delete design'}
                      >
                        {isDeletingId === design.id ? (
                          <LoaderCircle className="animate-spin" size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      {(design.cardData.groomName || (language === 'vi' ? 'Chu re' : 'Groom'))}
                      {' & '}
                      {(design.cardData.brideName || (language === 'vi' ? 'Co dau' : 'Bride'))}
                    </p>

                    <button
                      onClick={() => handleLoadDesign(design)}
                      className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {language === 'vi' ? 'Tai vao trinh sua' : 'Load into Editor'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function buildDesignTitle(cardData: CardData, sequence: number, language: string) {
  const groom = cardData.groomName.trim();
  const bride = cardData.brideName.trim();

  if (groom || bride) {
    return `${groom || (language === 'vi' ? 'Chu re' : 'Groom')} & ${
      bride || (language === 'vi' ? 'Co dau' : 'Bride')
    }`;
  }

  return language === 'vi' ? `Ban nhap thiep #${sequence}` : `Wedding Card Draft #${sequence}`;
}
