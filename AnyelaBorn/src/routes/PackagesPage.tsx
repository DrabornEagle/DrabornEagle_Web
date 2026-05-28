import { dkdPackages } from '../data/dkdAnyelaData';
import { DkdPackageCard, DkdPageHero } from '../components/DkdShared';

export function DkdPackagesPage() {
  const dkdGroups = [{ dkdKey: 'fan', dkdTitle: 'Fan & Sohbet Paketleri' }, { dkdKey: 'custom', dkdTitle: 'Özel İçerik Paketleri' }, { dkdKey: 'business', dkdTitle: 'İşletme Reklam Paketleri' }];
  return <>{<DkdPageHero dkdKicker="Paketler" dkdTitle="Kategori kategori net paketler." dkdText="Sohbet, sesli mesaj, özel içerik ve reklam seçenekleri ayrı gruplara ayrıldı." />}{dkdGroups.map((dkdGroup) => <section key={dkdGroup.dkdKey} className="dkd-section"><div className="dkd-container"><div className="dkd-section-head"><div><h2>{dkdGroup.dkdTitle}</h2></div></div><div className="dkd-grid-4">{dkdPackages.filter((dkdPackage) => dkdPackage.dkdGroup === dkdGroup.dkdKey).map((dkdPackage) => <DkdPackageCard key={dkdPackage.dkdSlug} dkdPackage={dkdPackage} />)}</div></div></section>)}</>;
}
