import { Menu, X, Globe, Plus, User, LogOut, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

type LoginRedirect = 'home' | 'designer' | 'adminChat';

interface HeaderProps {
  onOpenAdminChat: () => void;
  onOpenDesigner: () => void;
  onOpenSamples: () => void;
  onOpenLogin: (redirectTo?: LoginRedirect) => void;
}

export function Header({ onOpenAdminChat, onOpenDesigner, onOpenSamples, onOpenLogin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold" style={{ fontSize: '1.5rem', color: '#B8860B' }}>
                Tien Dat
              </div>
              <div className="opacity-60" style={{ fontSize: '0.75rem' }}>
                {t('header.tagline')}
              </div>
            </div>
          </div>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 text-sm lg:gap-5 lg:text-[0.95rem] xl:gap-7 md:flex">
            <a href="#home" className="whitespace-nowrap transition-opacity hover:opacity-60">{t('nav.home')}</a>
            <button onClick={onOpenSamples} className="whitespace-nowrap transition-opacity hover:opacity-60">{t('hero.btn1')}</button>
            <a href="#process" className="whitespace-nowrap transition-opacity hover:opacity-60">{t('footer.about.process')}</a>
            <a href="#contact" className="whitespace-nowrap transition-opacity hover:opacity-60">{t('nav.contact')}</a>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="flex items-center gap-1.5 rounded-none px-2.5 py-1.5 transition-all hover:bg-gray-100"
              title={language === 'vi' ? 'Switch to English' : 'Chuyen sang tieng Viet'}
            >
              <Globe size={16} />
              <span className="uppercase" style={{ fontSize: '0.75rem' }}>{language}</span>
            </button>

            {isAdmin ? (
              <button
                onClick={onOpenAdminChat}
                className="flex items-center gap-1.5 rounded-none px-4 py-1.5 transition-all hover:shadow-md"
                style={{ backgroundColor: '#B8860B', color: 'white', fontSize: '0.875rem' }}
              >
                <MessageCircle size={16} />
                <span>{language === 'vi' ? 'Chat admin' : 'Admin chat'}</span>
              </button>
            ) : null}

            <button
              onClick={() => {
                if (isAuthenticated) {
                  onOpenDesigner();
                  return;
                }

                onOpenLogin('designer');
              }}
              className="flex items-center gap-1.5 rounded-none px-4 py-1.5 transition-all hover:shadow-md"
              style={{ backgroundColor: '#8B0000', color: 'white', fontSize: '0.875rem' }}
            >
              <Plus size={16} />
              <span>{language === 'vi' ? 'Thiết kế' : 'Design'}</span>
            </button>

            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-none px-2.5 py-1.5 transition-all hover:bg-gray-100">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-7 w-7 rounded-full"
                  />
                  <span style={{ fontSize: '0.8rem' }}>{user?.name}</span>
                </button>
                <div className="invisible absolute right-0 top-full mt-2 min-w-[200px] rounded-none border border-gray-100 bg-white py-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    <span>{language === 'vi' ? 'Dang xuat' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 rounded-none px-3 py-1.5 transition-all hover:shadow-md"
                style={{ backgroundColor: '#B8860B', color: 'white', fontSize: '0.875rem' }}
              >
                <User size={16} />
                <span>{language === 'vi' ? 'Dang nhap' : 'Login'}</span>
              </button>
            )}
          </div>

          <button
            className="p-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <a href="#home" className="transition-opacity hover:opacity-60">{t('nav.home')}</a>
              <button
                onClick={() => {
                  onOpenSamples();
                  setMobileMenuOpen(false);
                }}
                className="text-left transition-opacity hover:opacity-60"
              >
                {t('hero.btn1')}
              </button>
              <a href="#process" className="transition-opacity hover:opacity-60">{t('footer.about.process')}</a>
              <a href="#contact" className="transition-opacity hover:opacity-60">{t('nav.contact')}</a>
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-2 rounded-none px-3 py-2 transition-all hover:bg-gray-100"
              >
                <Globe size={18} />
                <span className="uppercase">{language === 'vi' ? 'English' : 'Tieng Viet'}</span>
              </button>
              {isAdmin ? (
                <button
                  onClick={() => {
                    onOpenAdminChat();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full justify-center gap-2 rounded-none px-4 py-2 transition-all hover:shadow-md"
                  style={{ backgroundColor: '#B8860B', color: 'white' }}
                >
                  <MessageCircle size={18} />
                  <span>{language === 'vi' ? 'Chat admin' : 'Admin chat'}</span>
                </button>
              ) : null}
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    onOpenDesigner();
                  } else {
                    onOpenLogin();
                  }
                  setMobileMenuOpen(false);
                }}
                className="flex w-full justify-center gap-2 rounded-none px-6 py-2.5 transition-all"
                style={{ backgroundColor: '#8B0000', color: 'white' }}
              >
                <Plus size={18} />
                <span>{language === 'vi' ? 'Tao thiet ke' : 'Create Design'}</span>
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full justify-center gap-2 rounded-none px-4 py-2 transition-all hover:shadow-md"
                  style={{ backgroundColor: '#B8860B', color: 'white' }}
                >
                  <User size={18} />
                  <span>{language === 'vi' ? 'Dang nhap' : 'Login'}</span>
                </button>
              )}
              {isAuthenticated && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="mb-2 flex items-center gap-2 px-3 py-2">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span style={{ fontSize: '0.875rem' }}>{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-none px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    <span>{language === 'vi' ? 'Dang xuat' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
