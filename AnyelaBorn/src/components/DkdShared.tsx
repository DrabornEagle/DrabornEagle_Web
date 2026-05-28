import { dkdPackages } from '../data/dkdAnyelaData';

export function DkdPageHero({ dkdKicker, dkdTitle, dkdText }: { dkdKicker: string; dkdTitle: string; dkdText: string }) {
  return (
    <section className="dkd-page-hero"><div className="dkd-container"><div><div className="dkd-kicker">{dkdKicker}</div><h1>{dkdTitle}</h1><p>{dkdText}</p></div><aside className="dkd-card dkd-page-note"><h3>V1.4 Clean Platform</h3><p>Sayfalar ayrılmış, mobilde anlaşılır ve güven veren yapı.</p></aside></div></section>
  );
}

export function DkdPackageCard({ dkdPackage }: { dkdPackage: typeof dkdPackages[number] }) {
  return (
    <article className="dkd-card dkd-package-card">
      <div className="dkd-package-top"><div><span className="dkd-badge">{dkdPackage.dkdTag}</span><h3>{dkdPackage.dkdTitle}</h3><p>{dkdPackage.dkdDesc}</p></div><div className="dkd-price">{dkdPackage.dkdPrice}</div></div>
      <ul className="dkd-feature-list">{dkdPackage.dkdFeatures.map((dkdFeature) => <li key={dkdFeature}>{dkdFeature}</li>)}</ul>
      <a className="dkd-button dkd-button-primary dkd-button-block" href={`/AnyelaBorn/payment/?package=${encodeURIComponent(dkdPackage.dkdSlug)}`}>Paketi seç</a>
    </article>
  );
}
