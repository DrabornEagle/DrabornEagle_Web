import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  Camera,
  ChevronRight,
  Crown,
  FileImage,
  LockKeyhole,
  MessageCircle,
  Mic,
  PlayCircle,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Video,
  Volume2
} from "lucide-react";
import "./style.css";

const dkd_anyela_packages = [
  {
    slug: "intro",
    label: "Intro",
    title: "Anyela Intro",
    description: "10 dakikalık yazılı başlangıç deneyimi.",
    accent: "pink"
  },
  {
    slug: "private-chat",
    label: "Private",
    title: "Private Chat",
    description: "30 dakikalık özel yazılı sohbet alanı.",
    accent: "violet"
  },
  {
    slug: "voice-message",
    label: "Voice",
    title: "Voice Message",
    description: "Kişiye özel hazırlanmış sesli cevap.",
    accent: "blue"
  },
  {
    slug: "voice-chat",
    label: "Voice+",
    title: "Voice Chat Private",
    description: "Sesli mesaj mantığında özel sohbet deneyimi.",
    accent: "gold"
  },
  {
    slug: "style-try-on",
    label: "Style",
    title: "Style Try-On",
    description: "Kıyafet ve konsept referansına göre özel stil hazırlığı.",
    accent: "green"
  },
  {
    slug: "photo-set",
    label: "Photo",
    title: "Photo Set",
    description: "Özel konseptli Anyela görsel seti.",
    accent: "pink"
  },
  {
    slug: "talking-video",
    label: "Video",
    title: "Talking Video",
    description: "Kişiye özel konuşmalı video deneyimi.",
    accent: "violet"
  },
  {
    slug: "vip-fan-pack",
    label: "VIP",
    title: "VIP Fan Pack",
    description: "Sohbet, ses ve özel görsel paketi.",
    accent: "gold"
  }
];

const dkd_anyela_brand_packages = [
  {
    title: "Reklam Mini",
    description: "Tek konsept görsel veya kısa tanıtım fikri.",
    icon: Camera
  },
  {
    title: "Reklam Standart",
    description: "Görsel set, açıklama metni ve ürün odağı.",
    icon: FileImage
  },
  {
    title: "Reklam Pro",
    description: "Video konsept, görsel set ve paylaşım metni.",
    icon: Video
  },
  {
    title: "Marka Yüzü",
    description: "Anyela ile özel marka yüzü kampanyası.",
    icon: Crown
  }
];

const dkd_anyela_nav_items = [
  { key: "club", label: "Club", icon: Sparkles },
  { key: "packages", label: "Paket", icon: Crown },
  { key: "chat", label: "Chat", icon: MessageCircle },
  { key: "orders", label: "Sipariş", icon: ReceiptText },
  { key: "ads", label: "Reklam", icon: Building2 }
];

function DkdAnyelaApp() {
  const [dkd_active_screen, dkd_set_active_screen] = useState("club");
  const [dkd_selected_package, dkd_set_selected_package] = useState(null);
  const [dkd_chat_messages, dkd_set_chat_messages] = useState([
    {
      owner: "anyela",
      text: "Hey, Anyela Born Club’a hoş geldin. Paket seçebilir, mesaj yazabilir veya ses/görsel/video gönderebilirsin."
    },
    {
      owner: "anyela",
      text: "İlk sürümde cevaplar özel olarak hazırlanır ve bu chat ekranına düşer."
    }
  ]);
  const [dkd_chat_input, dkd_set_chat_input] = useState("");

  const dkd_selected_package_text = useMemo(() => {
    if (!dkd_selected_package) {
      return "Paket seçilmedi";
    }

    return dkd_selected_package.title;
  }, [dkd_selected_package]);

  function dkd_go_to_screen(dkd_screen_key) {
    dkd_set_active_screen(dkd_screen_key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function dkd_select_package(dkd_package_item) {
    dkd_set_selected_package(dkd_package_item);
    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return [
        ...dkd_previous_messages,
        {
          owner: "user",
          text: "Paket seçildi: " + dkd_package_item.title
        },
        {
          owner: "anyela",
          text: "Seçimin alındı. Şimdi ödeme/dekont adımına geçebilir veya özel isteğini yazabilirsin."
        }
      ];
    });
    dkd_go_to_screen("chat");
  }

  function dkd_submit_chat_message(dkd_form_event) {
    dkd_form_event.preventDefault();

    const dkd_message_text = dkd_chat_input.trim();

    if (!dkd_message_text) {
      return;
    }

    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return [
        ...dkd_previous_messages,
        {
          owner: "user",
          text: dkd_message_text
        },
        {
          owner: "anyela",
          text: "Mesajın alındı. Bu mockup aşamasında cevap demo olarak gösteriliyor; gerçek sistemde cevaplar admin panelinden eklenecek."
        }
      ];
    });

    dkd_set_chat_input("");
  }

  function dkd_handle_upload(dkd_upload_event, dkd_upload_type) {
    const dkd_uploaded_file = dkd_upload_event.target.files?.[0];

    if (!dkd_uploaded_file) {
      return;
    }

    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return [
        ...dkd_previous_messages,
        {
          owner: "user",
          text: dkd_upload_type + " yüklendi: " + dkd_uploaded_file.name
        },
        {
          owner: "anyela",
          text: "Dosyan alındı. Gerçek sistemde bu dosya sipariş detayına eklenecek."
        }
      ];
    });

    dkd_go_to_screen("chat");
  }

  return (
    <main className="dkd_anyela_app_shell">
      <div className="dkd_anyela_background_orb dkd_anyela_background_orb_one" />
      <div className="dkd_anyela_background_orb dkd_anyela_background_orb_two" />

      <AnimatePresence mode="wait">
        {dkd_active_screen === "club" && (
          <DkdAnyelaScreen screenKey="club">
            <DkdAnyelaClubScreen goToScreen={dkd_go_to_screen} />
          </DkdAnyelaScreen>
        )}

        {dkd_active_screen === "packages" && (
          <DkdAnyelaScreen screenKey="packages">
            <DkdAnyelaPackagesScreen selectPackage={dkd_select_package} />
          </DkdAnyelaScreen>
        )}

        {dkd_active_screen === "chat" && (
          <DkdAnyelaScreen screenKey="chat">
            <DkdAnyelaChatScreen
              selectedPackageText={dkd_selected_package_text}
              chatMessages={dkd_chat_messages}
              chatInput={dkd_chat_input}
              setChatInput={dkd_set_chat_input}
              submitChatMessage={dkd_submit_chat_message}
              handleUpload={dkd_handle_upload}
            />
          </DkdAnyelaScreen>
        )}

        {dkd_active_screen === "orders" && (
          <DkdAnyelaScreen screenKey="orders">
            <DkdAnyelaOrdersScreen selectedPackageText={dkd_selected_package_text} />
          </DkdAnyelaScreen>
        )}

        {dkd_active_screen === "ads" && (
          <DkdAnyelaScreen screenKey="ads">
            <DkdAnyelaAdsScreen />
          </DkdAnyelaScreen>
        )}
      </AnimatePresence>

      <DkdAnyelaBottomNav activeScreen={dkd_active_screen} goToScreen={dkd_go_to_screen} />
    </main>
  );
}

function DkdAnyelaScreen({ screenKey, children }) {
  return (
    <motion.section
      key={screenKey}
      className="dkd_anyela_screen"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.985 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

function DkdAnyelaClubScreen({ goToScreen }) {
  return (
    <>
      <section className="dkd_anyela_hero">
        <div className="dkd_anyela_topbar">
          <div className="dkd_anyela_brand_mark">AB</div>
          <button className="dkd_anyela_ghost_button" onClick={() => goToScreen("chat")}>
            Private Room
          </button>
        </div>

        <div className="dkd_anyela_hero_grid">
          <div className="dkd_anyela_hero_content">
            <p className="dkd_anyela_kicker">Anyela Born Club</p>
            <h1>Premium fan experience.</h1>
            <p className="dkd_anyela_hero_text">
              Yazılı sohbet, sesli cevap, özel görsel/video isteği ve işletmeler için reklam yüzü deneyimi tek sayfada.
            </p>

            <div className="dkd_anyela_hero_actions">
              <button className="dkd_anyela_primary_button" onClick={() => goToScreen("chat")}>
                Sohbete Başla
                <ChevronRight size={18} />
              </button>
              <button className="dkd_anyela_secondary_button" onClick={() => goToScreen("packages")}>
                Paketleri Gör
              </button>
            </div>
          </div>

          <div className="dkd_anyela_phone_mockup">
            <div className="dkd_anyela_phone_header">
              <span>Anyela</span>
              <em>Online</em>
            </div>
            <div className="dkd_anyela_story_card">
              <div className="dkd_anyela_story_glow" />
              <p>Tonight’s private room</p>
              <strong>Voice reply ready</strong>
            </div>
            <div className="dkd_anyela_mini_chat">
              <p className="dkd_anyela_bubble_anyela">Hey, bugün nasıl bir içerik hazırlayalım?</p>
              <p className="dkd_anyela_bubble_user">Kişiye özel sesli cevap istiyorum.</p>
              <p className="dkd_anyela_bubble_anyela">Paketini seç, sonra mesajını gönder.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dkd_anyela_signal_grid">
        <DkdAnyelaSignalCard icon={MessageCircle} title="Private Chat" text="Site içi yazışma deneyimi." />
        <DkdAnyelaSignalCard icon={Volume2} title="Voice Reply" text="Sesli cevap dinleme akışı." />
        <DkdAnyelaSignalCard icon={UploadCloud} title="Media Upload" text="Ses, görsel, video ve dekont alanı." />
        <DkdAnyelaSignalCard icon={ShieldCheck} title="Controlled Club" text="18+ kurallar ve manuel onay." />
      </section>

      <section className="dkd_anyela_panel">
        <div className="dkd_anyela_section_header">
          <p className="dkd_anyela_kicker">First release plan</p>
          <h2>Önce görünüm, sonra gerçek sistem.</h2>
        </div>

        <div className="dkd_anyela_step_list">
          <DkdAnyelaStep numberText="01" text="Mobil premium ana sayfa ve club hissi." />
          <DkdAnyelaStep numberText="02" text="Site içi chat ve dosya gönderme arayüzü." />
          <DkdAnyelaStep numberText="03" text="Paket, ödeme ve sipariş durumu akışı." />
          <DkdAnyelaStep numberText="04" text="Son aşamada gerçek backend ve admin panel." />
        </div>
      </section>
    </>
  );
}

function DkdAnyelaSignalCard({ icon: Icon, title, text }) {
  return (
    <article className="dkd_anyela_signal_card">
      <Icon size={22} />
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function DkdAnyelaStep({ numberText, text }) {
  return (
    <div className="dkd_anyela_step">
      <b>{numberText}</b>
      <span>{text}</span>
    </div>
  );
}

function DkdAnyelaPackagesScreen({ selectPackage }) {
  return (
    <>
      <DkdAnyelaPageHeader
        kicker="Club Packages"
        title="Paketler"
        text="Paket seçimi chat akışını başlatır. Fiyatlar ve ödeme bilgileri sonraki aşamada eklenecek."
      />

      <div className="dkd_anyela_package_grid">
        {dkd_anyela_packages.map(function dkd_render_package(dkd_package_item) {
          return (
            <button
              key={dkd_package_item.slug}
              className={"dkd_anyela_package_card dkd_anyela_accent_" + dkd_package_item.accent}
              onClick={() => selectPackage(dkd_package_item)}
            >
              <span>{dkd_package_item.label}</span>
              <strong>{dkd_package_item.title}</strong>
              <p>{dkd_package_item.description}</p>
              <small>Paketi seç</small>
            </button>
          );
        })}
      </div>
    </>
  );
}

function DkdAnyelaChatScreen({
  selectedPackageText,
  chatMessages,
  chatInput,
  setChatInput,
  submitChatMessage,
  handleUpload
}) {
  return (
    <>
      <header className="dkd_anyela_chat_header">
        <div className="dkd_anyela_brand_mark">AB</div>
        <div>
          <p className="dkd_anyela_kicker">Private Room</p>
          <h1>Anyela Chat</h1>
        </div>
        <span>Online</span>
      </header>

      <div className="dkd_anyela_selected_strip">
        <LockKeyhole size={16} />
        <p>Seçili paket: <strong>{selectedPackageText}</strong></p>
      </div>

      <div className="dkd_anyela_chat_window">
        {chatMessages.map(function dkd_render_message(dkd_message_item, dkd_message_index) {
          return (
            <div
              key={"dkd_message_" + dkd_message_index}
              className={
                dkd_message_item.owner === "user"
                  ? "dkd_anyela_message dkd_anyela_message_user"
                  : "dkd_anyela_message dkd_anyela_message_anyela"
              }
            >
              {dkd_message_item.text}
            </div>
          );
        })}
      </div>

      <div className="dkd_anyela_upload_grid">
        <DkdAnyelaUploadButton label="Ses" icon={Mic} accept="audio/*" uploadType="Ses dosyası" handleUpload={handleUpload} />
        <DkdAnyelaUploadButton label="Görsel" icon={FileImage} accept="image/*" uploadType="Görsel" handleUpload={handleUpload} />
        <DkdAnyelaUploadButton label="Video" icon={Video} accept="video/*" uploadType="Video" handleUpload={handleUpload} />
        <DkdAnyelaUploadButton label="Dekont" icon={ReceiptText} accept="image/*,.pdf" uploadType="Dekont" handleUpload={handleUpload} />
      </div>

      <form className="dkd_anyela_chat_form" onSubmit={submitChatMessage}>
        <input
          value={chatInput}
          onChange={(dkd_input_event) => setChatInput(dkd_input_event.target.value)}
          placeholder="Anyela’ya mesaj yaz..."
        />
        <button type="submit">
          <Send size={18} />
        </button>
      </form>
    </>
  );
}

function DkdAnyelaUploadButton({ label, icon: Icon, accept, uploadType, handleUpload }) {
  return (
    <label className="dkd_anyela_upload_button">
      <input type="file" accept={accept} onChange={(dkd_upload_event) => handleUpload(dkd_upload_event, uploadType)} />
      <Icon size={18} />
      <span>{label}</span>
    </label>
  );
}

function DkdAnyelaOrdersScreen({ selectedPackageText }) {
  return (
    <>
      <DkdAnyelaPageHeader
        kicker="Order Center"
        title="Siparişlerim"
        text="Ödeme, onay, hazırlık ve teslim aşamaları burada takip edilecek."
      />

      <section className="dkd_anyela_order_panel">
        <div className="dkd_anyela_order_head">
          <div>
            <span>Aktif Sipariş</span>
            <strong>{selectedPackageText}</strong>
          </div>
          <em>Mockup</em>
        </div>

        <div className="dkd_anyela_progress_list">
          <DkdAnyelaProgress active text="Paket seçildi" />
          <DkdAnyelaProgress text="Dekont yüklendi" />
          <DkdAnyelaProgress text="Onaylandı" />
          <DkdAnyelaProgress text="Hazırlanıyor" />
          <DkdAnyelaProgress text="Teslim edildi" />
        </div>
      </section>

      <section className="dkd_anyela_panel">
        <h2>Ödeme akışı</h2>
        <p>
          İlk canlı sürümde IBAN bilgisi bu ekranda gösterilecek. Kullanıcı dekontu chat içinden yükleyecek, sen onayladıktan sonra sipariş aktif olacak.
        </p>
      </section>
    </>
  );
}

function DkdAnyelaProgress({ active, text }) {
  return <div className={active ? "dkd_anyela_progress dkd_anyela_progress_active" : "dkd_anyela_progress"}>{text}</div>;
}

function DkdAnyelaAdsScreen() {
  return (
    <>
      <DkdAnyelaPageHeader
        kicker="Brand Collaboration"
        title="Anyela reklam yüzünüz olsun"
        text="İşletmeler için premium tanıtım, görsel set, video konsept ve sponsorlu içerik paketi."
      />

      <div className="dkd_anyela_brand_grid">
        {dkd_anyela_brand_packages.map(function dkd_render_brand(dkd_brand_item) {
          const DkdBrandIcon = dkd_brand_item.icon;

          return (
            <article className="dkd_anyela_brand_card" key={dkd_brand_item.title}>
              <DkdBrandIcon size={22} />
              <strong>{dkd_brand_item.title}</strong>
              <p>{dkd_brand_item.description}</p>
            </article>
          );
        })}
      </div>

      <section className="dkd_anyela_panel">
        <div className="dkd_anyela_policy_row">
          <BadgeCheck size={21} />
          <p>Anyela hesabında paylaşım yapılırsa “Reklam / İş birliği / Sponsorlu” etiketi kullanılmalıdır.</p>
        </div>
      </section>
    </>
  );
}

function DkdAnyelaPageHeader({ kicker, title, text }) {
  return (
    <header className="dkd_anyela_page_header">
      <p className="dkd_anyela_kicker">{kicker}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}

function DkdAnyelaBottomNav({ activeScreen, goToScreen }) {
  return (
    <nav className="dkd_anyela_bottom_nav">
      {dkd_anyela_nav_items.map(function dkd_render_nav(dkd_nav_item) {
        const DkdNavIcon = dkd_nav_item.icon;

        return (
          <button
            key={dkd_nav_item.key}
            className={activeScreen === dkd_nav_item.key ? "dkd_anyela_nav_button dkd_anyela_nav_button_active" : "dkd_anyela_nav_button"}
            onClick={() => goToScreen(dkd_nav_item.key)}
          >
            <DkdNavIcon size={18} />
            <span>{dkd_nav_item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

createRoot(document.getElementById("dkd_anyela_root")).render(<DkdAnyelaApp />);
