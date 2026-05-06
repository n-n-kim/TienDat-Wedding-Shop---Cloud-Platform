import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { User } from '../contexts/AuthContext';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess?: () => void;
}

export function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const { language } = useLanguage();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setGoogleError(
        language === 'vi'
          ? 'Chua cau hinh Google Client ID.'
          : 'Google Client ID is not configured.',
      );
      return;
    }

    let cancelled = false;

    const handleCredentialResponse = (response: google.accounts.id.CredentialResponse) => {
      try {
        const payload = decodeJwtPayload(response.credential);
        const userData: User = {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          avatar: payload.picture,
        };

        login(userData);
        onLoginSuccess?.();
      } catch {
        setGoogleError(
          language === 'vi'
            ? 'Khong the xu ly dang nhap Google.'
            : 'Could not complete Google sign-in.',
        );
      }
    };

    const initializeGoogle = () => {
      if (cancelled || !window.google?.accounts.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 320,
      });
    };

    if (window.google?.accounts.id) {
      initializeGoogle();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]',
      );

      const script =
        existingScript ??
        Object.assign(document.createElement('script'), {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true,
        });

      const handleLoad = () => initializeGoogle();
      const handleError = () =>
        setGoogleError(
          language === 'vi'
            ? 'Khong tai duoc Google Sign-In.'
            : 'Failed to load Google Sign-In.',
        );

      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);

      if (!existingScript) {
        document.head.appendChild(script);
      }

      return () => {
        cancelled = true;
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [language, login, onLoginSuccess]);

  const handleGuestLogin = () => {
    const mockUser = {
      id: 'user_' + Date.now(),
      name: language === 'vi' ? 'Nguoi dung demo' : 'Demo User',
      email: 'demo@tiendat.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=8B0000&color=fff',
    };

    login(mockUser);
    onLoginSuccess?.();
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            <span>{language === 'vi' ? 'Quay lai' : 'Back'}</span>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <div className="mb-4" style={{ fontSize: '1.5rem', color: '#B8860B' }}>
                Tien Dat
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-gray-900">
                {language === 'vi' ? 'Dang nhap' : 'Login'}
              </h1>
              <p className="text-gray-500">
                {language === 'vi'
                  ? 'Dang nhap de luu thiet ke va theo doi don hang'
                  : 'Login to save designs and track orders'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div ref={googleButtonRef} />
              </div>
              {googleError ? (
                <p className="text-center text-sm text-red-600">{googleError}</p>
              ) : null}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-400">
                    {language === 'vi' ? 'hoac' : 'or'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGuestLogin}
                className="w-full rounded-lg px-4 py-3 text-white transition-all"
                style={{ backgroundColor: '#8B0000' }}
              >
                {language === 'vi' ? 'Tiep tuc voi tu cach khach' : 'Continue as guest'}
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              {language === 'vi'
                ? 'Bang cach dang nhap, ban dong y voi Dieu khoan dich vu va Chinh sach bao mat'
                : 'By logging in, you agree to our Terms of Service and Privacy Policy'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

interface GoogleJwtPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

function decodeJwtPayload(token: string): GoogleJwtPayload {
  const [, payload] = token.split('.');

  if (!payload) {
    throw new Error('Missing JWT payload');
  }

  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = window.atob(normalized);
  const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);

  return JSON.parse(json) as GoogleJwtPayload;
}
