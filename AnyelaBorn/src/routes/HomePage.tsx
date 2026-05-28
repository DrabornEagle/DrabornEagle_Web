import { dkdPackages } from '../data/dkdAnyelaData';
import { DkdPackageCard } from '../components/DkdShared';

const dkdServices = [
  ['💬', 'Yazılı Sohbet', '10 veya 30 dakikalık özel mesajlaşma deneyimi.', '/AnyelaBorn/chat/'],
  ['🎙️', 'Sesli Mesaj', 'Anyela karakter sesiyle kişiye özel cevap.', '/AnyelaBorn/voice/'],
  ['🎬', 'Özel İçerik', 'Kıyafet, tema ve fikirden görsel/video konsepti.', '/AnyelaBorn/custom/'],
  ['📣', 'Marka Reklamı', 'İşletmeler için AI reklam yüzü paketi.', '/AnyelaBorn/ads/']
];

export function DkdHomePage() {
  const dkdFeaturedPackages = dkdPackages.filter((dkdPackage) => ['private-chat', 'voice-message', 'style-try-on', 'reklam-standart'].includes(dkdPackage.dkdSlug));
  return (
    <>
      <section className="dkd-hero"><div className="dkd-container dkd-hero-grid"><div><div className="dkd-kicker">AI karakter deneyim platformu</div><h1>Anyela Born ile <span className="dkd-gradient-text">özel ve güven veren</span> dijital deneyim</h1><p className="dkd-hero-lead">Sohbet, sesli mesaj, özel görsel/video ve marka reklam içerikleri için tasarlanmış premium AI influencer karakter platformu.</p><div className="dkd-hero-actions"><a className="dkd-button dkd-button-primary" href="/AnyelaBorn/packages/">Paketleri incele</a><a className="dkd-button dkd-button-violet" href="/AnyelaBorn/chat/">Sohbeti gör</a><a className="dkd-button dkd-button-ghost" href="/AnyelaBorn/ads/">Markam için reklam</a></div><div className="dkd-proof-row">{['AI karakter', '18+ deneyim', 'Manuel ödeme onayı', 'Gizli içerik süreci'].map((dkdProof) => <span key={dkdProof} className="dkd-proof-pill"><span className="dkd-proof-dot" />{dkdProof}</span>)}</div></div><div className="dkd-phone-card"><div className="dkd-phone-screen"><div className="dkd-phone-body"><div className="dkd-media-card"><img className="dkd-avatar-portrait" src="/AnyelaBorn/assets/dkd-anyela-avatar.svg" alt="Anyela" /><div className="dkd-play-orb">▶</div><div className="dkd-media-label"><div><h3>Konuşmalı tanıtım videosu</h3><p>Kullanıcı deneyimi görür, sonra paket seçer.</p></div><span className="dkd-badge">00:45</span></div></div></div></div></div></div></section>
      <section className="dkd-section"><div className="dkd-container"><div className="dkd-section-head"><div><div className="dkd-kicker">Net hizmetler</div><h2>Kullanıcı ne alacağını ilk bakışta anlar.</h2><p>Anyela deneyimini dört ana hizmete ayırdık.</p></div></div><div className="dkd-grid-4">{dkdServices.map((dkdService) => <article key={dkdService[1]} className="dkd-card dkd-service-card"><div className="dkd-icon-box">{dkdService[0]}</div><h3>{dkdService[1]}</h3><p>{dkdService[2]}</p><a className="dkd-card-link" href={dkdService[3]}>Detayları gör →</a></article>)}</div></div></section>
      <section className="dkd-section"><div className="dkd-container"><div className="dkd-grid-4">{dkdFeaturedPackages.map((dkdPackage) => <DkdPackageCard key={dkdPackage.dkdSlug} dkdPackage={dkdPackage} />)}</div></div></section>
    </>
  );
}
