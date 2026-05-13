import { type FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  listChatConversations,
  listConversationMessages,
  sendChatMessage,
  updateConversationStatus,
} from '../services/chatApi';
import type { ChatConversation, ChatMessage } from '../types/chat';

interface AdminChatPageProps {
  onBack: () => void;
  onOpenLogin: () => void;
}

export function AdminChatPage({ onBack, onOpenLogin }: AdminChatPageProps) {
  const { language } = useLanguage();
  const { isAuthenticated, canUseCloudSave, isAdmin, user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyDraft, setReplyDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedConversation = pickConversation(conversations, selectedConversationId);

  useEffect(() => {
    if (!canUseCloudSave || !isAdmin) {
      setConversations([]);
      setMessages([]);
      setSelectedConversationId(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadData = async () => {
      try {
        const nextConversations = await listChatConversations();

        if (!mounted) {
          return;
        }

        const nextConversation = pickConversation(nextConversations, selectedConversationId);
        setConversations(nextConversations);
        setSelectedConversationId(nextConversation?.id ?? null);

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
    void loadData();

    const intervalId = window.setInterval(() => {
      void loadData();
    }, 5000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [canUseCloudSave, isAdmin, selectedConversationId]);

  const handleSendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReply = replyDraft.trim();

    if (!selectedConversation || !trimmedReply) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      await sendChatMessage(selectedConversation.id, { content: trimmedReply });
      setReplyDraft('');

      const [nextConversations, nextMessages] = await Promise.all([
        listChatConversations(),
        listConversationMessages(selectedConversation.id),
      ]);

      setConversations(nextConversations);
      setMessages(nextMessages);
    } catch (sendError) {
      setError(readErrorMessage(sendError));
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedConversation) {
      return;
    }

    setStatusUpdating(true);
    setError(null);

    try {
      await updateConversationStatus(
        selectedConversation.id,
        selectedConversation.status === 'open' ? 'closed' : 'open',
      );

      const nextConversations = await listChatConversations();
      setConversations(nextConversations);
    } catch (updateError) {
      setError(readErrorMessage(updateError));
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <GuardState
        language={language}
        onBack={onBack}
        title={language === 'vi' ? 'Đăng nhập để vào chat admin' : 'Sign in to access admin chat'}
        description={
          language === 'vi'
            ? 'Trang này chỉ dành cho admin đăng nhập bằng Gmail kim1801x5@gmail.com.'
            : 'This page is only for the admin signed in with kim1801x5@gmail.com.'
        }
        primaryActionLabel={language === 'vi' ? 'Đăng nhập bằng Google' : 'Sign in with Google'}
        onPrimaryAction={onOpenLogin}
      />
    );
  }

  if (!canUseCloudSave) {
    return (
      <GuardState
        language={language}
        onBack={onBack}
        title={
          language === 'vi'
            ? 'Cần tài khoản Google để dùng cloud chat'
            : 'Google sign-in is required for cloud chat'
        }
        description={
          language === 'vi'
            ? 'Tài khoản guest không có token cloud. Hãy đăng nhập đúng Gmail admin rồi quay lại.'
            : 'Guest mode does not include a cloud token. Sign in with the admin Gmail and then come back.'
        }
        primaryActionLabel={language === 'vi' ? 'Đăng nhập lại' : 'Sign in again'}
        onPrimaryAction={onOpenLogin}
      />
    );
  }

  if (!isAdmin) {
    return (
      <GuardState
        language={language}
        onBack={onBack}
        title={language === 'vi' ? 'Tài khoản này không có quyền admin' : 'This account is not an admin'}
        description={
          language === 'vi'
            ? 'Hiện chỉ Gmail kim1801x5@gmail.com được mở dashboard chat admin.'
            : 'Right now only kim1801x5@gmail.com is allowed to open the admin chat dashboard.'
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#fff7ed_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
          </button>

          <div className="rounded-full bg-white px-5 py-2.5 text-sm text-gray-600 shadow-sm">
            {language === 'vi' ? 'Admin đang đăng nhập:' : 'Logged in admin:'} {user?.email}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">
            {language === 'vi' ? 'Hộp thư chat admin' : 'Admin chat inbox'}
          </h1>
          <p className="mt-2 text-gray-500">
            {language === 'vi'
              ? 'Giao diện theo kiểu Messenger. Khi user nhắn ở phần liên hệ, hội thoại sẽ xuất hiện ở đây.'
              : 'Messenger-style layout. When a user messages from the contact section, the thread appears here.'}
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="grid min-h-[720px] lg:grid-cols-[360px,1fr]">
            <aside className="border-r border-gray-100 bg-slate-50/80">
              <div className="border-b border-gray-100 px-5 py-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084ff] text-sm font-semibold text-white">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-sm text-emerald-600">
                      {language === 'vi' ? 'Đang hoạt động' : 'Active now'}
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
                  {conversations.length}{' '}
                  {language === 'vi' ? 'hội thoại từ user' : 'user conversations'}
                </div>
              </div>

              <div className="space-y-2 p-3">
                {loading ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    {language === 'vi' ? 'Đang tải hội thoại...' : 'Loading conversations...'}
                  </div>
                ) : null}

                {!loading && conversations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    {language === 'vi'
                      ? 'Chưa có user nào nhắn tin.'
                      : 'No users have sent messages yet.'}
                  </div>
                ) : null}

                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full rounded-[1.5rem] px-4 py-4 text-left transition-all ${
                      conversation.id === selectedConversation?.id
                        ? 'bg-white shadow-md ring-1 ring-amber-200'
                        : 'hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
                          {getInitials(conversation.userName)}
                        </div>
                        {conversation.unreadForAdmin > 0 ? (
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff3040] px-1 text-[10px] text-white">
                            {conversation.unreadForAdmin}
                          </span>
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <div className="truncate font-semibold text-gray-900">
                            {conversation.userName}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {formatTimeOnly(conversation.updatedAt, language)}
                          </div>
                        </div>

                        <div className="mb-1 truncate text-sm text-gray-500">
                          {conversation.userEmail}
                        </div>
                        <div className="line-clamp-1 text-sm text-gray-600">
                          {conversation.lastSenderRole === 'admin'
                            ? `${language === 'vi' ? 'Bạn:' : 'You:'} ${conversation.lastMessage}`
                            : conversation.lastMessage}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="flex min-h-[720px] flex-col">
              {!selectedConversation ? (
                <div className="flex flex-1 flex-col items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 text-center">
                  <MessageCircle className="mb-4 text-[#0084ff]" size={44} />
                  <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                    {language === 'vi'
                      ? 'Chọn một user để xem hội thoại'
                      : 'Select a user to open the conversation'}
                  </h2>
                  <p className="max-w-lg text-gray-500">
                    {language === 'vi'
                      ? 'Khi có khách hàng gửi tin nhắn từ phần chat liên hệ, bạn sẽ thấy họ ở cột bên trái.'
                      : 'When a customer sends a message from the contact chat, they will appear in the left column.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
                          {getInitials(selectedConversation.userName)}
                        </div>
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div>
                        <div className="font-semibold text-gray-900">{selectedConversation.userName}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Mail size={14} />
                            {selectedConversation.userEmail}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Phone size={14} />
                            {selectedConversation.contactPhone || '--'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          selectedConversation.status === 'open'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {formatStatusLabel(selectedConversation.status, language)}
                      </span>
                      <button
                        onClick={handleToggleStatus}
                        disabled={statusUpdating}
                        className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {statusUpdating
                          ? language === 'vi'
                            ? 'Đang cập nhật...'
                            : 'Updating...'
                          : selectedConversation.status === 'open'
                            ? language === 'vi'
                              ? 'Đóng chat'
                              : 'Close chat'
                            : language === 'vi'
                              ? 'Mở lại chat'
                              : 'Reopen chat'}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-6 sm:px-6">
                    <div className="space-y-5">
                      {messages.map((message) => {
                        const isAdminMessage = message.senderRole === 'admin';

                        return (
                          <div
                            key={message.id}
                            className={`flex items-end gap-3 ${
                              isAdminMessage ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {!isAdminMessage ? (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-semibold text-white">
                                {getInitials(selectedConversation.userName)}
                              </div>
                            ) : null}

                            <div className={`max-w-[78%] ${isAdminMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className="mb-1 px-2 text-xs text-gray-500">
                                {isAdminMessage
                                  ? language === 'vi'
                                    ? 'Bạn'
                                    : 'You'
                                  : selectedConversation.userName}
                              </div>
                              <div
                                className={`rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                                  isAdminMessage
                                    ? 'rounded-br-md bg-[#0084ff] text-white'
                                    : 'rounded-bl-md border border-gray-100 bg-white text-gray-800'
                                }`}
                              >
                                <div className="whitespace-pre-wrap">{message.content}</div>
                              </div>
                              <div className="mt-1 px-2 text-[11px] text-gray-400">
                                {formatDateTime(message.createdAt, language)}
                              </div>
                            </div>

                            {isAdminMessage ? (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0084ff] text-xs font-semibold text-white">
                                {getInitials(user?.name)}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
                    <form onSubmit={handleSendReply} className="space-y-3">
                      <div className="flex items-end gap-3 rounded-[1.75rem] border border-gray-200 bg-slate-50 px-3 py-3 shadow-inner">
                        <textarea
                          rows={1}
                          value={replyDraft}
                          onChange={(event) => setReplyDraft(event.target.value)}
                          placeholder={
                            language === 'vi'
                              ? 'Nhập phản hồi cho khách hàng...'
                              : 'Type your reply to the customer...'
                          }
                          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={sending || !replyDraft.trim()}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                          style={{ backgroundColor: '#0084ff' }}
                        >
                          <Send size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                        <div>
                          {language === 'vi'
                            ? 'Admin Gmail: kim1801x5@gmail.com'
                            : 'Admin Gmail: kim1801x5@gmail.com'}
                        </div>
                        <div>
                          {language === 'vi'
                            ? 'Tin nhắn lưu cloud tự động'
                            : 'Messages auto-save to the cloud'}
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function GuardState({
  description,
  language,
  onBack,
  onPrimaryAction,
  primaryActionLabel,
  title,
}: {
  description: string;
  language: 'vi' | 'en';
  onBack: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
          </button>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-xl">
          <h1 className="mb-4 text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="mx-auto mb-8 max-w-xl text-gray-500">{description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {onPrimaryAction && primaryActionLabel ? (
              <button
                onClick={onPrimaryAction}
                className="rounded-full px-5 py-3 text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#8B0000' }}
              >
                {primaryActionLabel}
              </button>
            ) : null}
            <button
              onClick={onBack}
              className="rounded-full border border-gray-200 px-5 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            >
              {language === 'vi' ? 'Quay lại trang chủ' : 'Back to home'}
            </button>
          </div>
        </div>
      </div>
    </main>
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

  return conversations[0] ?? null;
}

function formatStatusLabel(status: 'open' | 'closed', language: 'vi' | 'en') {
  return status === 'open'
    ? language === 'vi'
      ? 'Đang mở'
      : 'Open'
    : language === 'vi'
      ? 'Đã đóng'
      : 'Closed';
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

function formatTimeOnly(value: string, language: 'vi' | 'en') {
  return new Date(value).toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name?: string | null) {
  if (!name) {
    return 'A';
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
