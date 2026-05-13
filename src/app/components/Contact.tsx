import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Facebook, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  createChatConversation,
  listChatConversations,
  listConversationMessages,
  sendChatMessage,
} from '../services/chatApi';
import type { ChatConversation, ChatMessage } from '../types/chat';

interface ContactProps {
  onOpenLogin: () => void;
}

const ADMIN_PROFILE = {
  viName: 'Admin Tiến Đạt',
  enName: 'Tien Dat Admin',
  avatarFallback: 'TD',
};

export function Contact({ onOpenLogin }: ContactProps) {
  const { t, language } = useLanguage();
  const { canUseCloudSave, isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contactPhone, setContactPhone] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = pickConversation(conversations, activeConversationId);
  const displayMessages = useMemo(
    () =>
      messages.length > 0
        ? messages
        : [
            {
              id: 'welcome-message',
              conversationId: activeConversation?.id ?? 'preview',
              senderId: 'admin',
              senderName: language === 'vi' ? ADMIN_PROFILE.viName : ADMIN_PROFILE.enName,
              senderRole: 'admin' as const,
              content:
                language === 'vi'
                  ? 'Chào bạn, mình là admin Tiến Đạt. Bạn cần tư vấn thiệp cưới, danh thiếp hay in ấn gì cứ nhắn trực tiếp ở đây nhé.'
                  : 'Hi there, I am the Tien Dat admin. Feel free to message me here about wedding cards, business cards, or printing.',
              createdAt: new Date().toISOString(),
            },
          ],
    [activeConversation?.id, language, messages],
  );

  useEffect(() => {
    if (!canUseCloudSave) {
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
      setContactPhone('');
      setError(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadChatState = async () => {
      try {
        const nextConversations = await listChatConversations();

        if (!mounted) {
          return;
        }

        const nextConversation = pickConversation(nextConversations, activeConversationId);
        setConversations(nextConversations);
        setActiveConversationId(nextConversation?.id ?? null);
        setContactPhone((currentPhone) => nextConversation?.contactPhone || currentPhone);

        if (!nextConversation) {
          setMessages([]);
          setError(null);
          return;
        }

        const nextMessages = await listConversationMessages(nextConversation.id);

        if (!mounted) {
          return;
        }

        setMessages(nextMessages);
        setError(null);
      } catch (loadError) {
        if (mounted) {
          setError(readErrorMessage(loadError));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void loadChatState();

    const intervalId = window.setInterval(() => {
      void loadChatState();
    }, 5000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [activeConversationId, canUseCloudSave]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!isAuthenticated || !canUseCloudSave) {
      onOpenLogin();
      return;
    }

    if (!activeConversation && !contactPhone.trim()) {
      setError(
        language === 'vi'
          ? 'Vui lòng nhập số điện thoại trước khi bắt đầu chat.'
          : 'Please enter a phone number before starting the chat.',
      );
      return;
    }

    setSending(true);
    setError(null);

    try {
      let conversationId = activeConversation?.id ?? null;

      if (!conversationId) {
        const createdConversation = await createChatConversation({
          contactPhone: contactPhone.trim(),
          initialMessage: trimmedMessage,
        });

        conversationId = createdConversation.id;
        setActiveConversationId(createdConversation.id);
      } else {
        await sendChatMessage(conversationId, {
          content: trimmedMessage,
        });
      }

      const [nextConversations, nextMessages] = await Promise.all([
        listChatConversations(),
        listConversationMessages(conversationId),
      ]);

      setConversations(nextConversations);
      setMessages(nextMessages);
      setDraftMessage('');
    } catch (sendError) {
      setError(readErrorMessage(sendError));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_45%,#ffffff_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            {t('contact.title')}
          </h2>
          <p className="mx-auto max-w-2xl opacity-70" style={{ fontSize: '1.125rem' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-[340px,1fr]">
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-none border border-red-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="bg-[linear-gradient(135deg,#8B0000_0%,#B8860B_100%)] px-6 py-7 text-white">
                {/* <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs">
                  Messenger-style chat
                </div> */}
                <h3 className="text-2xl font-semibold">
                  {language === 'vi' ? 'Chat trực tiếp với admin' : 'Chat directly with admin'}
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {language === 'vi'
                    ? 'Khi bạn gửi tin nhắn, admin sẽ thấy ngay trong trang quản trị.'
                    : 'When you send a message, the admin can immediately see it in the dashboard.'}
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center gap-4 rounded-none bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
                    {ADMIN_PROFILE.avatarFallback}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {language === 'vi' ? ADMIN_PROFILE.viName : ADMIN_PROFILE.enName}
                    </div>
                    <div className="text-sm text-emerald-600">
                      {language === 'vi' ? 'Đang hoạt động' : 'Active now'}
                    </div>
                  </div>
                </div>

                {!activeConversation ? (
                  <div>
                    <label className="mb-2 block text-sm text-gray-600">
                      {language === 'vi' ? 'Số điện thoại của bạn' : 'Your phone number'}
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(event) => setContactPhone(event.target.value)}
                      placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter phone number'}
                      className="w-full rounded-none border border-gray-200 px-4 py-3 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                ) : null}

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-none"
                      style={{ backgroundColor: '#FFF8DC' }}
                    >
                      <Phone size={18} style={{ color: '#8B0000' }} />
                    </div>
                    <div>
                      <div className="opacity-60">{t('contact.info.hotline')}</div>
                      <div className="text-base text-gray-900">0900 000 000</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-none"
                      style={{ backgroundColor: '#FFF8DC' }}
                    >
                      <MapPin size={18} style={{ color: '#B8860B' }} />
                    </div>
                    <div>
                      <div className="opacity-60">{t('contact.info.address')}</div>
                      <div className="text-base text-gray-900">{t('contact.info.address.value')}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-none border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-gray-700">
                  {language === 'vi'
                    ? 'Tài khoản admin mặc định là kim1801x5@gmail.com. Sau khi đăng nhập bằng Gmail này, admin sẽ thấy tất cả tin nhắn từ user.'
                    : 'The default admin account is kim1801x5@gmail.com. Once signed in with this Gmail, the admin can see all user messages.'}
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-none border-2 py-3 transition-all hover:shadow-md"
                    style={{ borderColor: '#1877F2', color: '#1877F2' }}
                  >
                    <Facebook size={18} />
                    <span>Facebook</span>
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-none border-2 py-3 transition-all hover:shadow-md"
                    style={{ borderColor: '#00A884', color: '#00A884' }}
                  >
                    <MessageCircle size={18} />
                    <span>Zalo</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="overflow-hidden rounded-none border border-gray-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
                    {ADMIN_PROFILE.avatarFallback}
                  </div>
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {language === 'vi' ? ADMIN_PROFILE.viName : ADMIN_PROFILE.enName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activeConversation
                      ? activeConversation.status === 'open'
                        ? language === 'vi'
                          ? 'Đang phản hồi'
                          : 'Replying'
                        : language === 'vi'
                          ? 'Đã đóng hội thoại'
                          : 'Conversation closed'
                      : language === 'vi'
                        ? 'Sẵn sàng hỗ trợ'
                        : 'Ready to help'}
                  </div>
                </div>
              </div>

              {activeConversation ? (
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    {language === 'vi' ? 'Cloud chat' : 'Cloud chat'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDateTime(activeConversation.updatedAt, language)}
                  </div>
                </div>
              ) : null}
            </div>

            {!canUseCloudSave ? (
              <div className="p-6 sm:p-8">
                <div className="rounded-none border border-dashed border-gray-200 bg-slate-50 p-8 text-center">
                  <MessageCircle className="mx-auto mb-4 text-amber-600" size={42} />
                  <h4 className="mb-3 text-2xl font-semibold text-gray-900">
                    {language === 'vi' ? 'Đăng nhập để bắt đầu chat' : 'Sign in to start chatting'}
                  </h4>
                  <p className="mx-auto mb-6 max-w-2xl text-gray-600">
                    {isAuthenticated
                      ? language === 'vi'
                        ? 'Tài khoản guest không có token cloud. Hãy đăng nhập bằng Google để lưu lịch sử chat và để admin thấy tin nhắn của bạn.'
                        : 'Guest mode does not include the cloud token. Sign in with Google so your chat history can be stored and seen by the admin.'
                      : language === 'vi'
                        ? 'Chat này lưu trên cloud, nên bạn cần đăng nhập Google trước khi bắt đầu.'
                        : 'This chat is stored in the cloud, so please sign in with Google before you start.'}
                  </p>
                  <button
                    onClick={onOpenLogin}
                    className="rounded-none px-6 py-3 text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#8B0000' }}
                  >
                    {language === 'vi' ? 'Đăng nhập bằng Google' : 'Sign in with Google'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-[540px] overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-6 sm:px-6">
                  {error ? (
                    <div className="mb-4 rounded-none border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {loading ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      {language === 'vi' ? 'Đang tải lịch sử chat...' : 'Loading chat history...'}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {displayMessages.map((message) => {
                        const isUserMessage = message.senderRole === 'user';
                        const senderLabel = isUserMessage
                          ? language === 'vi'
                            ? 'Bạn'
                            : 'You'
                          : language === 'vi'
                            ? ADMIN_PROFILE.viName
                            : ADMIN_PROFILE.enName;

                        return (
                          <div
                            key={message.id}
                            className={`flex items-end gap-3 ${
                              isUserMessage ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {!isUserMessage ? (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-semibold text-white">
                                {ADMIN_PROFILE.avatarFallback}
                              </div>
                            ) : null}

                            <div className={`max-w-[82%] ${isUserMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className="mb-1 px-2 text-xs text-gray-500">{senderLabel}</div>
                              <div
                                className={`rounded-none px-4 py-3 text-sm leading-6 shadow-sm ${
                                  isUserMessage
                                    ? 'bg-[#0084ff] text-white'
                                    : 'bg-white text-gray-800 border border-gray-100'
                                }`}
                              >
                                <div className="whitespace-pre-wrap">{message.content}</div>
                              </div>
                              <div className="mt-1 px-2 text-[11px] text-gray-400">
                                {formatDateTime(message.createdAt, language)}
                              </div>
                            </div>

                            {isUserMessage ? (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                                {getInitials(user?.name)}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
                  <form onSubmit={handleSendMessage} className="space-y-3">
                    <div className="flex items-end gap-3 rounded-none border border-gray-200 bg-slate-50 px-3 py-3 shadow-inner">
                      <textarea
                        rows={1}
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        placeholder={
                          language === 'vi'
                            ? 'Nhắn tin cho admin...'
                            : 'Message the admin...'
                        }
                        className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={sending || !draftMessage.trim()}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ backgroundColor: '#0084ff' }}
                      >
                        <Send size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                      <span>
                        {language === 'vi'
                          ? 'Tin nhắn được lưu lên cloud và admin thấy trong dashboard.'
                          : 'Messages are stored in the cloud and visible to the admin dashboard.'}
                      </span>
                      {activeConversation ? (
                        <span>
                          {language === 'vi' ? 'Số điện thoại:' : 'Phone:'} {activeConversation.contactPhone || '--'}
                        </span>
                      ) : null}
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function pickConversation(
  conversations: ChatConversation[],
  preferredConversationId: string | null,
) {
  if (preferredConversationId) {
    const preferredConversation = conversations.find(
      (conversation) => conversation.id === preferredConversationId,
    );

    if (preferredConversation) {
      return preferredConversation;
    }
  }

  return (
    conversations.find((conversation) => conversation.status === 'open') ||
    conversations[0] ||
    null
  );
}

function formatDateTime(value: string, language: 'vi' | 'en') {
  return new Date(value).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getInitials(name?: string | null) {
  if (!name) {
    return 'U';
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error.';
}
