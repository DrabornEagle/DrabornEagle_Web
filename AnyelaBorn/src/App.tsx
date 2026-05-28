import { DkdHomePage } from './routes/HomePage';
import { DkdPackagesPage } from './routes/PackagesPage';
import { DkdChatPage } from './routes/ChatPage';
import { DkdVoicePage } from './routes/VoicePage';
import { DkdCustomContentPage } from './routes/CustomContentPage';
import { DkdAdsPage } from './routes/AdsPage';
import { DkdPaymentPage } from './routes/PaymentPage';
import { DkdFaqPage } from './routes/FaqPage';
import { DkdHeader } from './components/DkdHeader';
import { DkdFooter } from './components/DkdFooter';
import { DkdMobileNav } from './components/DkdMobileNav';

export type DkdRouteKey = 'home' | 'packages' | 'chat' | 'voice' | 'custom' | 'ads' | 'payment' | 'faq';

function dkdGetCurrentRoute(): DkdRouteKey {
  const dkdPathname = window.location.pathname.toLowerCase();
  if (dkdPathname.includes('/packages')) return 'packages';
  if (dkdPathname.includes('/chat')) return 'chat';
  if (dkdPathname.includes('/voice')) return 'voice';
  if (dkdPathname.includes('/custom')) return 'custom';
  if (dkdPathname.includes('/ads')) return 'ads';
  if (dkdPathname.includes('/payment')) return 'payment';
  if (dkdPathname.includes('/faq')) return 'faq';
  return 'home';
}

export function DkdAnyelaApp() {
  const dkdCurrentRoute = dkdGetCurrentRoute();
  const dkdPages: Record<DkdRouteKey, JSX.Element> = {
    home: <DkdHomePage />,
    packages: <DkdPackagesPage />,
    chat: <DkdChatPage />,
    voice: <DkdVoicePage />,
    custom: <DkdCustomContentPage />,
    ads: <DkdAdsPage />,
    payment: <DkdPaymentPage />,
    faq: <DkdFaqPage />
  };

  return (
    <div className="dkd-app">
      <DkdHeader dkdCurrentRoute={dkdCurrentRoute} />
      <main className="dkd-page">{dkdPages[dkdCurrentRoute]}</main>
      <DkdFooter />
      <DkdMobileNav dkdCurrentRoute={dkdCurrentRoute} />
    </div>
  );
}
