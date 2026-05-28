import { dkdRoutes } from '../data/dkdAnyelaData';
import type { DkdRouteKey } from '../App';

export function DkdHeader({ dkdCurrentRoute }: { dkdCurrentRoute: DkdRouteKey }) {
  return (
    <header className="dkd-header">
      <div className="dkd-container dkd-header-inner">
        <a className="dkd-brand" href="/AnyelaBorn/">
          <div className="dkd-brand-mark">AB</div>
          <div className="dkd-brand-title">Anyela Born<span>Club Platform</span></div>
        </a>
        <nav className="dkd-nav" aria-label="Ana menü">
          {dkdRoutes.map((dkdRoute) => (
            <a key={dkdRoute.dkdKey} href={dkdRoute.dkdPath} className={dkdCurrentRoute === dkdRoute.dkdKey ? 'dkd-active' : ''}>{dkdRoute.dkdLabel}</a>
          ))}
        </nav>
        <div className="dkd-header-actions">
          <a className="dkd-button dkd-button-soft" href="/AnyelaBorn/payment/">Ödeme</a>
          <a className="dkd-button dkd-button-primary" href="/AnyelaBorn/packages/">Başla</a>
        </div>
      </div>
    </header>
  );
}
