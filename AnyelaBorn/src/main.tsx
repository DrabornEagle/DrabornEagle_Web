import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/dkdPixelHome.css";

const dkd_services = [
  { dkd_title: "Yazılı Sohbet", dkd_text: "Anyela Born ile sınırsız yazış.", dkd_href: "/AnyelaBorn/chat/" },
  { dkd_title: "Sesli Mesaj", dkd_text: "Kişiye özel sesli yanıtlar al.", dkd_href: "/AnyelaBorn/voice/" },
  { dkd_title: "Özel Görsel / Video", dkd_text: "Sana özel görsel ve videolar iste.", dkd_href: "/AnyelaBorn/custom/" },
  { dkd_title: "Anyela Reklam Yüzünüz Olsun", dkd_text: "Markan için Anyela Born ile iş birliği yap.", dkd_href: "/AnyelaBorn/ads/" },
];

function DkdPixelMobileHome() {
  return (
    <main className="dkd-home-main">
      <section className="dkd-hero-section">
        <div className="dkd-hero-copy">
          <span className="dkd-sparkle">✦</span>
          <h1>Anyela Born ile<br /><span>özel AI karakter</span><br />deneyimi</h1>
          <p>Anyela Born ile yazış, sesli yanıtlar al, özel görsel / video iste, markan için iş birlikleri planla.</p>
          <div className="dkd-hero-actions">
            <a className="dkd-primary-cta" href="#dkd-start">✦ Deneyimi Başlat</a>
            <a className="dkd-secondary-cta" href="#dkd-services">□ Paketleri İncele</a>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("dkd-root")!).render(<DkdPixelMobileHome />);
