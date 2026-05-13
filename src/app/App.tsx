import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CloudFeatures } from './components/CloudFeatures';
import { Services } from './components/Services';
import { WeddingAccessories } from './components/WeddingAccessories';
import { Process } from './components/Process';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WeddingCardDesigner } from './components/WeddingCardDesigner';
import { LoginPage } from './components/LoginPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

type View = 'home' | 'login' | 'designer';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewBeforeLogin, setViewBeforeLogin] = useState<Exclude<View, 'login'>>('home');

  const openDesigner = () => {
    setCurrentView('designer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogin = () => {
    if (currentView !== 'login') {
      setViewBeforeLogin(currentView);
    }
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setCurrentView(viewBeforeLogin);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'login') {
    return <LoginPage onBack={goHome} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'designer') {
    return <WeddingCardDesigner onBack={goHome} onOpenLogin={openLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenDesigner={openDesigner} onOpenLogin={openLogin} />
      <Hero />
      <CloudFeatures />
      <Services />
      <WeddingAccessories />
      <Process />
      <WhyChooseUs />
      <Contact />
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
