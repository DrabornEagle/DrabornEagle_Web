import type { ElementType } from 'react';
import {
  BadgeCheck,
  Building2,
  Camera,
  ChevronRight,
  Crown,
  Headphones,
  ImagePlus,
  LockKeyhole,
  MessageCircleHeart,
  Mic2,
  PlayCircle,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  Waves,
  Zap
} from "lucide-react";

type DkdPackageCard = {
  dkdTitle: string;
  dkdPrice: string;
  dkdDescription: string;
  dkdBadge: string;
  dkdIcon: ElementType;
  dkdHighlight?: boolean;
};

type DkdStepCard = {
  dkdTitle: string;
  dkdDescription: string;
  dkdIcon: ElementType;
};

type DkdFeatureCard = {
  dkdTitle: string;
  dkdDescription: string;
  dkdIcon: ElementType;
};

const dkdFanPackages: DkdPackageCard[] = [
  {
    dkdTitle: 'Anyela Intro',
    dkdPrice: '149 TL',
    dkdDescription: 'Kısa tanışma sohbeti, özel oda ve ilk Anyela deneyimi.',
    dkdBadge: 'Giriş Paketi',
    dkdIcon: MessageCircleHeart,
  },
  {
    dkdTitle: 'Private Chat',
    dkdPrice: '499 TL',
    dkdDescription: 'Daha uzun yazılı sohbet, konsept konuşma ve özel yönlendirme.',
    dkdBadge: 'En Popüler',
    dkdIcon: Crown,
    dkdHighlight: true,
  },
  {
    dkdTitle: 'Voice Intro',
    dkdPrice: '249 TL',
    dkdDescription: 'Anyela’dan kişiye özel kısa sesli cevap deneyimi.',
    dkdBadge: 'Sesli Deneyim',
    dkdIcon: Mic2,
  },
];

const dkdCreatorPackages: DkdPackageCard[] = [
  {
    dkdTitle: 'Style Concept',
    dkdPrice: '499 TL',
    dkdDescription: 'Kıyafet, poz veya mekan referansından 2 özel Anyela konsepti.',
    dkdBadge: 'Görsel Sipariş',
    dkdIcon: ImagePlus,
  },
  {
    dkdTitle: 'Photo Set',
    dkdPrice: '1.499 TL',
    dkdDescription: 'Seçtiğin tema için 5 özel Anyela görsel seti.',
    dkdBadge: 'Premium Set',
    dkdIcon: Camera,
    dkdHighlight: true,
  },
  {
    dkdTitle: 'Talking Video',
    dkdPrice: '2.499 TL+',
    dkdDescription: 'Doğum günü, özel selam veya marka konsepti için kısa video.',
    dkdBadge: 'Video',
    dkdIcon: PlayCircle,
  },
];

const dkdBusinessPackages: DkdPackageCard[] = [
  {
    dkdTitle: 'Reklam Mini',
    dkdPrice: '1.500 TL',
    dkdDescription: '1 kısa reklam videosu, 1 kapak görseli ve paylaşım metni.',
    dkdBadge: 'İşletme Girişi',
    dkdIcon: Building2,
  },
  {
    dkdTitle: 'Reklam Standart',
    dkdPrice: '4.500 TL',
    dkdDescription: '3 kısa video, 3 görsel ve sosyal medya açıklamaları.',
    dkdBadge: 'Marka Paketi',
    dkdIcon: Zap,
    dkdHighlight: true,
  },
  {
    dkdTitle: 'Marka Yüzü',
    dkdPrice: '12.000 TL+',
    dkdDescription: 'Anyela ile haftalık özel marka konsepti ve reklam içerikleri.',
    dkdBadge: 'Pro Seviye',
    dkdIcon: BadgeCheck,
  },
];

const dkdSteps: DkdStepCard[] = [
  {
    dkdTitle: 'Paketini seç',
    dkdDescription: 'Sohbet, sesli cevap, özel görsel/video veya reklam paketini seç.',
    dkdIcon: Star,
  },
  {
    dkdTitle: 'IBAN ile ödeme yap',
    dkdDescription: 'Açıklamaya kullanıcı adını ve paket adını ekle.',
    dkdIcon: ReceiptText,
  },
  {
    dkdTitle: 'Dekontunu yükle',
    dkdDescription: 'Admin onayından sonra özel Anyela odan açılır.',
    dkdIcon: UploadCloud,
  },
  {
    dkdTitle: 'Özel odana gir',
    dkdDescription: 'Mesaj, ses, görsel veya video referansını site içinden gönder.',
    dkdIcon: LockKeyhole,
  },
];

const dkdFeatures: DkdFeatureCard[] = [
  {
    dkdTitle: 'Site içi özel chat',
    dkdDescription: 'DM karmaşası yok. Her şey AnyelaBorn özel odasında tutulur.',
    dkdIcon: MessageCircleHeart,
  },
  {
    dkdTitle: 'Sesli cevap deneyimi',
    dkdDescription: 'Anyela’dan kişiye özel sesli cevaplar için premium alan.',
    dkdIcon: Headphones,
  },
  {
    dkdTitle: 'Görsel ve video teslimi',
    dkdDescription: 'Özel setler ve konuşmalı videolar aynı odadan teslim edilir.',
    dkdIcon: Camera,
  },
  {
    dkdTitle: 'Güvenli kullanım kuralları',
    dkdDescription: '18+ özel deneyim, içerik sınırları ve veri silme talebi alanı.',
    dkdIcon: ShieldCheck,
  },
];

function DkdPackageGrid({
  dkdTitle,
  dkdSubtitle,
  dkdPackages,
}: {
  dkdTitle: string;
  dkdSubtitle: string;
  dkdPackages: DkdPackageCard[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 lg:px-8" id={dkdTitle.toLowerCase().replaceAll(' ', '-')}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-200/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
            Miami Club
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-4xl">{dkdTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">{dkdSubtitle}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dkdPackages.map((dkdPackage) => {
          const DkdIcon = dkdPackage.dkdIcon;

          return (
            <article
              className={`dkd-glass-card relative overflow-hidden rounded-[2rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/50 ${
                dkdPackage.dkdHighlight ? 'ring-2 ring-cyan-300/45' : ''
              }`}
              key={dkdPackage.dkdTitle}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-cyan-100 ring-1 ring-white/15">
                  <DkdIcon size={24} strokeWidth={2.3} />
                </div>
                <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold text-white/80 ring-1 ring-white/15">
                  {dkdPackage.dkdBadge}
                </span>
              </div>
              <h3 className="relative mt-5 text-xl font-black text-white">{dkdPackage.dkdTitle}</h3>
              <p className="relative mt-2 text-sm leading-6 text-white/65">{dkdPackage.dkdDescription}</p>
              <div className="relative mt-6 flex items-center justify-between gap-4">
                <strong className="text-2xl font-black text-white">{dkdPackage.dkdPrice}</strong>
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:scale-[1.03]"
                  href="#odeme"
                >
                  Seç <ChevronRight size={16} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function DkdAnyelaBornPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden pb-28 text-white">
      <div className="dkd-miami-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-300/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-32 -z-10 h-80 w-80 rounded-full bg-rose-400/24 blur-3xl" />

      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#top">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
            <Waves className="text-cyan-200" size={24} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white">Anyela</p>
            <p className="text-xs font-semibold text-white/55">Born Club Miami</p>
          </div>
        </a>
        <a
          className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-slate-950 sm:inline-flex"
          href="#paketler"
        >
          Paketleri Gör
        </a>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-7 pt-3 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-12" id="top">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white/75 backdrop-blur">
            <Sparkles className="text-yellow-200" size={16} />
            Miami neon havasında özel AI karakter deneyimi
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
            Anyela ile <span className="dkd-miami-text">Miami ışığında</span> özel kulübe katıl.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Yazılı sohbet, sesli cevap, özel görsel/video siparişi ve işletmeler için Anyela reklam yüzü paketleri tek bir premium web deneyiminde.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(0,245,212,0.28)] transition hover:scale-[1.02]"
              href="#paketler"
            >
              Paket Seç <ChevronRight size={18} />
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-slate-950"
              href="#nasil-calisir"
            >
              Nasıl Çalışır?
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
            <div className="rounded-3xl bg-white/8 p-3">
              <p className="text-2xl font-black text-white">149₺</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Başlangıç</p>
            </div>
            <div className="rounded-3xl bg-white/8 p-3">
              <p className="text-2xl font-black text-white">24/7</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Site içi oda</p>
            </div>
            <div className="rounded-3xl bg-white/8 p-3">
              <p className="text-2xl font-black text-white">B2B</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Reklam yüzü</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[28rem] lg:ml-auto">
          <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-cyan-300/20 via-fuchsia-400/18 to-orange-300/20 blur-2xl" />
          <div className="dkd-glass-card relative overflow-hidden rounded-[2.7rem] p-4">
            <div className="relative min-h-[36rem] overflow-hidden rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_16%,rgba(0,245,212,.34),transparent_18rem),linear-gradient(160deg,#10142d,#071827_52%,#24102b)] p-5">
              <div className="absolute inset-x-6 top-6 flex items-center justify-between rounded-full border border-white/15 bg-black/20 px-4 py-3 backdrop-blur">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/75">
                  <Waves size={16} className="text-cyan-200" /> Miami Live
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,245,212,1)]" />
              </div>

              <div className="absolute left-1/2 top-28 h-72 w-52 -translate-x-1/2 rounded-[6rem_6rem_3rem_3rem] bg-gradient-to-b from-yellow-200/90 via-orange-300/90 to-rose-400/90 opacity-95 shadow-[0_28px_100px_rgba(255,107,107,0.35)]" />
              <div className="absolute left-1/2 top-36 h-56 w-40 -translate-x-1/2 rounded-[5rem_5rem_2.5rem_2.5rem] bg-gradient-to-b from-[#2af7da] via-[#12baf6] to-[#9b5de5] opacity-90 mix-blend-screen" />
              <div className="absolute bottom-36 left-1/2 h-56 w-64 -translate-x-1/2 rounded-[3rem] bg-black/35 backdrop-blur-md ring-1 ring-white/15" />
              <div className="absolute bottom-44 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-gradient-to-br from-white via-cyan-100 to-orange-100 shadow-[0_18px_50px_rgba(255,255,255,0.18)]" />
              <div className="absolute bottom-[10.4rem] left-1/2 h-20 w-40 -translate-x-1/2 rounded-[3rem_3rem_1.6rem_1.6rem] bg-gradient-to-br from-cyan-200 via-white to-rose-200" />
              <div className="absolute bottom-20 left-6 right-6 rounded-[1.7rem] border border-white/15 bg-black/28 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/80">Özel oda</p>
                    <p className="mt-1 text-2xl font-black text-white">Anyela Born</p>
                  </div>
                  <button className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950">Aç</button>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/68">Sesli cevap, özel görsel seti ve Miami tarzı içerik teslimi burada.</p>
              </div>
              <div className="dkd-float-card absolute right-6 top-28 rounded-3xl border border-white/15 bg-white/12 p-3 backdrop-blur-xl">
                <Mic2 size={22} className="text-cyan-100" />
              </div>
              <div className="dkd-float-card absolute bottom-64 left-5 rounded-3xl border border-white/15 bg-white/12 p-3 backdrop-blur-xl [animation-delay:1.5s]">
                <Camera size={22} className="text-yellow-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" id="nasil-calisir">
        <div className="grid gap-4 md:grid-cols-4">
          {dkdSteps.map((dkdStep, dkdStepIndex) => {
            const DkdIcon = dkdStep.dkdIcon;

            return (
              <article className="dkd-glass-card rounded-[2rem] p-5" key={dkdStep.dkdTitle}>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/14 text-cyan-100 ring-1 ring-cyan-200/20">
                    <DkdIcon size={23} />
                  </div>
                  <span className="text-3xl font-black text-white/12">0{dkdStepIndex + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{dkdStep.dkdTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{dkdStep.dkdDescription}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div id="paketler" />
      <DkdPackageGrid
        dkdTitle="Fan Paketleri"
        dkdSubtitle="Anyela ile özel sohbet, tanışma ve sesli cevap deneyimleri için mobil öncelikli premium paketler."
        dkdPackages={dkdFanPackages}
      />
      <DkdPackageGrid
        dkdTitle="Özel İçerik Paketleri"
        dkdSubtitle="Kıyafet, konsept, mekan, doğum günü, özel selam veya sosyal medya formatında görsel/video teslimleri."
        dkdPackages={dkdCreatorPackages}
      />
      <DkdPackageGrid
        dkdTitle="İşletme Reklam Paketleri"
        dkdSubtitle="Kafe, butik, güzellik salonu, restoran, turizm ve dijital ürünler için Anyela reklam yüzü konseptleri."
        dkdPackages={dkdBusinessPackages}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {dkdFeatures.map((dkdFeature) => {
            const DkdIcon = dkdFeature.dkdIcon;

            return (
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur" key={dkdFeature.dkdTitle}>
                <DkdIcon className="text-cyan-100" size={25} />
                <h3 className="mt-4 text-base font-black text-white">{dkdFeature.dkdTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{dkdFeature.dkdDescription}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" id="odeme">
        <div className="dkd-glass-card overflow-hidden rounded-[2.4rem] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-yellow-200/14 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-yellow-100 ring-1 ring-yellow-200/20">
                IBAN / Dekont Sistemi
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Paketini seç, dekontunu yükle, özel odanı açalım.</h2>
              <p className="mt-4 text-base leading-8 text-white/68">
                İlk sürümde ödeme manuel onaylanır. Açıklama alanına <strong>ANYELA - Kullanıcı Adı - Paket Adı</strong> yazman yeterli.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/12 bg-black/22 p-5">
              <div className="flex items-center gap-3 rounded-3xl bg-white/8 p-4">
                <ReceiptText className="text-cyan-100" size={28} />
                <div>
                  <p className="text-sm font-black text-white">Ödeme açıklaması örneği</p>
                  <p className="mt-1 text-sm text-white/58">ANYELA - drabornfan23 - PRIVATECHAT</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button className="rounded-3xl bg-white px-5 py-4 text-sm font-black text-slate-950">Dekont Yükle</button>
                <button className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-black text-white">Admin Onayı Bekle</button>
              </div>
              <p className="mt-4 text-xs leading-6 text-white/50">
                Anyela Born dijital karakter deneyimidir. İçerikler eğlence, sosyal etkileşim ve yaratıcı konsept üretimi amaçlıdır.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-center text-xs leading-6 text-white/45 sm:px-6 lg:px-8">
        <p>© 2026 DrabornEagle — Anyela Born Club. 18+ özel deneyim kuralları, gizlilik, veri silme ve iade koşulları ayrıca yayınlanır.</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#050711]/82 px-4 py-3 backdrop-blur-2xl sm:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          <a className="flex flex-1 items-center justify-center rounded-full bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950" href="#paketler">
            Paket Seç
          </a>
          <a className="flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-4 text-sm font-black text-white" href="#odeme">
            Ödeme
          </a>
        </div>
      </div>
    </main>
  );
}
