import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WeddingCardDesigner } from './components/WeddingCardDesigner';
import { LoginPage } from './components/LoginPage';
import { AdminChatPage } from './components/AdminChatPage';
import { SamplesPage } from './components/SamplesPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

type View = 'home' | 'login' | 'designer' | 'adminChat' | 'samples';

type LoginRedirect = Exclude<View, 'login'>;

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<LoginRedirect>('home');
  const [previousViewBeforeLogin, setPreviousViewBeforeLogin] = useState<LoginRedirect>('home');

  const openDesigner = () => {
    setCurrentView('designer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminChat = () => {
    setCurrentView('adminChat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSamples = () => {
    setCurrentView('samples');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogin = (redirectTo: LoginRedirect = 'home') => {
    if (currentView !== 'login') {
      setPreviousViewBeforeLogin(currentView as LoginRedirect);
    }
    setRedirectAfterLogin(redirectTo);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setCurrentView(previousViewBeforeLogin);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setCurrentView(redirectAfterLogin);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'login') {
    return <LoginPage onBack={goBack} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'designer') {
    return <WeddingCardDesigner onBack={goHome} onOpenLogin={() => openLogin('designer')} />;
  }

  if (currentView === 'adminChat') {
    return <AdminChatPage onBack={goHome} onOpenLogin={() => openLogin('adminChat')} />;
  }

  if (currentView === 'samples') {
    return <SamplesPage onBack={goHome} onOpenContact={goHome} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onOpenAdminChat={openAdminChat}
        onOpenDesigner={openDesigner}
        onOpenSamples={openSamples}
        onOpenLogin={(redirectTo) => openLogin(redirectTo)}
      />
      <Hero onOpenSamples={openSamples} />
      <Process />
      <Contact onOpenLogin={() => openLogin('home')} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
