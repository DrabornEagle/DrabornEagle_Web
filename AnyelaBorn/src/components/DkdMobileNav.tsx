import type { DkdRouteKey } from '../App';

const dkdMobileRoutes = [
  { dkdKey: 'home', dkdLabel: 'Ana', dkdIcon: '✦', dkdPath: '/AnyelaBorn/' },
  { dkdKey: 'chat', dkdLabel: 'Sohbet', dkdIcon: '💬', dkdPath: '/AnyelaBorn/chat/' },
  { dkdKey: 'packages', dkdLabel: 'Paket', dkdIcon: '◈', dkdPath: '/AnyelaBorn/packages/' },
  { dkdKey: 'ads', dkdLabel: 'Reklam', dkdIcon: '📣', dkdPath: '/AnyelaBorn/ads/' },
  { dkdKey: 'payment', dkdLabel: 'Başla', dkdIcon: '✓', dkdPath: '/AnyelaBorn/payment/' }
] as const;

export function DkdMobileNav({ dkdCurrentRoute }: { dkdCurrentRoute: DkdRouteKey }) {
  return (
    <nav className="dkd-mobile-nav" aria-label="Mobil menü">
      {dkdMobileRoutes.map((dkdRoute) => (
        <a key={dkdRoute.dkdKey} href={dkdRoute.dkdPath} className={dkdCurrentRoute === dkdRoute.dkdKey ? 'dkd-active' : ''}>
          <span>{dkdRoute.dkdIcon}</span>{dkdRoute.dkdLabel}
        </a>
      ))}
    </nav>
  );
}
