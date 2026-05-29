'use client';

import { FormEvent, useMemo, useState } from 'react';
import styles from './DkdAnyelaBornLogin.module.css';

type DkdAuthMode = 'login' | 'register';

function DkdUserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dkdSvgIcon}>
      <path d="M12 12.6c2.68 0 4.85-2.17 4.85-4.85S14.68 2.9 12 2.9 7.15 5.07 7.15 7.75 9.32 12.6 12 12.6Zm0 2.3c-4.16 0-7.6 2.12-7.6 4.75v.5c0 .52.42.95.95.95h13.3c.53 0 .95-.43.95-.95v-.5c0-2.63-3.44-4.75-7.6-4.75Z" />
    </svg>
  );
}

function DkdUserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dkdSvgIcon}>
      <path d="M10.25 11.85a4.45 4.45 0 1 0 0-8.9 4.45 4.45 0 0 0 0 8.9Zm0 2.18c-3.82 0-7.05 1.95-7.05 4.42v.5c0 .52.42.95.95.95h8.92a7.28 7.28 0 0 1-.22-1.8c0-1.46.43-2.82 1.18-3.95a11.25 11.25 0 0 0-3.78-.12Zm7.45-1.38c.52 0 .95.43.95.95v2.05h2.05c.52 0 .95.43.95.95s-.43.95-.95.95h-2.05v2.05c0 .52-.43.95-.95.95s-.95-.43-.95-.95v-2.05H14.7a.95.95 0 0 1 0-1.9h2.05V13.6c0-.52.43-.95.95-.95Z" />
    </svg>
  );
}

function DkdLockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dkdSvgIcon}>
      <path d="M17.2 9.15h-.85V7.1a4.35 4.35 0 0 0-8.7 0v2.05H6.8a2 2 0 0 0-2 2v8.15a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2v-8.15a2 2 0 0 0-2-2Zm-7.3-2.05a2.1 2.1 0 0 1 4.2 0v2.05H9.9V7.1Zm2.1 10.55a1.34 1.34 0 0 1-1.35-1.35c0-.5.27-.94.67-1.17V13.7c0-.38.3-.68.68-.68.37 0 .67.3.67.68v1.43c.4.23.68.67.68 1.17 0 .75-.6 1.35-1.35 1.35Z" />
    </svg>
  );
}

function DkdEyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dkdEyeIcon}>
      <path d="M12 5.45c5.42 0 8.85 5.15 9 5.37.22.34.22.78 0 1.12-.15.22-3.58 5.37-9 5.37s-8.85-5.15-9-5.37a1.02 1.02 0 0 1 0-1.12c.15-.22 3.58-5.37 9-5.37Zm0 9.7a3.78 3.78 0 1 0 0-7.55 3.78 3.78 0 0 0 0 7.55Zm0-1.88a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Z" />
    </svg>
  );
}

function DkdShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dkdShieldIcon}>
      <path d="M12 2.25 20 5.5v5.95c0 5.08-3.42 9.82-8 10.95-4.58-1.13-8-5.87-8-10.95V5.5l8-3.25Zm3.75 7.32-4.72 4.72-2.1-2.1-1.38 1.38 3.48 3.48 6.1-6.1-1.38-1.38Z" />
    </svg>
  );
}

function DkdDiamondIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dkdDiamondIcon}>
      <path d="M6.24 3.8h11.52L22 9.56 12 21.2 2 9.56 6.24 3.8Zm1.08 1.88L5.1 8.7h4.28L8.5 5.68H7.32Zm5.9 0h-2.44L9.9 8.7h4.2l-.88-3.02Zm3.46 0H15.5l-.88 3.02h4.28l-2.22-3.02Zm1.95 4.9h-4.16l-1.1 5.9 5.26-5.9Zm-6.63 6.98 1.3-6.98h-2.6L12 17.56Zm-1.37-1.08-1.1-5.9H5.37l5.26 5.9Z" />
    </svg>
  );
}

export default function DkdAnyelaBornLoginClient() {
  const [dkdAuthMode, dkdSetAuthMode] = useState<DkdAuthMode>('login');
  const [dkdPasswordVisible, dkdSetPasswordVisible] = useState(false);
  const [dkdRememberEnabled, dkdSetRememberEnabled] = useState(true);

  const dkdPrimaryLabel = useMemo(() => {
    return dkdAuthMode === 'login' ? 'GİRİŞ YAP' : 'ÜYE OL';
  }, [dkdAuthMode]);

  function dkdHandleSubmit(dkdFormEvent: FormEvent<HTMLFormElement>) {
    dkdFormEvent.preventDefault();
  }

  return (
    <main className={styles.dkdPageShell}>
      <div className={styles.dkdBackgroundGlow} aria-hidden="true" />
      <section className={styles.dkdExperienceShell}>
        <div className={styles.dkdHeroPanel}>
          <div className={styles.dkdSkylineLayer} aria-hidden="true">
            <span className={styles.dkdTowerOne} />
            <span className={styles.dkdTowerTwo} />
            <span className={styles.dkdTowerThree} />
            <span className={styles.dkdTowerFour} />
            <span className={styles.dkdPalmOne} />
            <span className={styles.dkdPalmTwo} />
          </div>

          <div className={styles.dkdHeroContent}>
            <p className={styles.dkdLogoScript}>Anyela♡</p>
            <p className={styles.dkdLogoSub}>BORN CLUB</p>

            <div className={styles.dkdHeroCopy}>
              <h1>
                Anyela Born Club’a
                <span>Hoş Geldin♡</span>
              </h1>
              <p>Özel içerikler, premium sohbet ve benzersiz anlar seni bekliyor.</p>
            </div>

            <div className={styles.dkdPremiumCard}>
              <DkdDiamondIcon />
              <div>
                <strong>PREMIUM ÜYELİK</strong>
                <span>Sadece üyeler için özel ayrıcalıklar</span>
              </div>
            </div>
          </div>

          <div className={styles.dkdHeroImageFrame}>
            <img
              src="/anyela-born/dkd_anyela_hero_reference.png"
              alt="Anyela Born Club Miami temalı giriş görseli"
              className={styles.dkdHeroImage}
            />
          </div>
        </div>

        <div className={styles.dkdAuthPanel}>
          <div className={styles.dkdAuthTabs} role="tablist" aria-label="Anyela Born Club giriş seçenekleri">
            <button
              type="button"
              className={`${styles.dkdAuthTab} ${dkdAuthMode === 'login' ? styles.dkdAuthTabActive : ''}`}
              onClick={() => dkdSetAuthMode('login')}
              aria-selected={dkdAuthMode === 'login'}
            >
              <DkdUserIcon />
              <span>GİRİŞ YAP</span>
            </button>
            <button
              type="button"
              className={`${styles.dkdAuthTab} ${dkdAuthMode === 'register' ? styles.dkdAuthTabActive : ''}`}
              onClick={() => dkdSetAuthMode('register')}
              aria-selected={dkdAuthMode === 'register'}
            >
              <DkdUserPlusIcon />
              <span>ÜYE OL</span>
            </button>
          </div>

          <form className={styles.dkdLoginForm} onSubmit={dkdHandleSubmit}>
            <label className={styles.dkdInputWrap}>
              <span className={styles.dkdInputIcon}><DkdUserIcon /></span>
              <input
                type="text"
                name="dkd_anyela_identity"
                placeholder="E-posta veya kullanıcı adı"
                autoComplete="username"
              />
            </label>

            {dkdAuthMode === 'register' && (
              <label className={styles.dkdInputWrap}>
                <span className={styles.dkdInputIcon}><DkdUserIcon /></span>
                <input
                  type="email"
                  name="dkd_anyela_email"
                  placeholder="E-posta adresi"
                  autoComplete="email"
                />
              </label>
            )}

            <label className={styles.dkdInputWrap}>
              <span className={styles.dkdInputIcon}><DkdLockIcon /></span>
              <input
                type={dkdPasswordVisible ? 'text' : 'password'}
                name="dkd_anyela_password"
                placeholder="Şifre"
                autoComplete={dkdAuthMode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className={styles.dkdPasswordToggle}
                aria-label="Şifre görünürlüğünü değiştir"
                onClick={() => dkdSetPasswordVisible(!dkdPasswordVisible)}
              >
                <DkdEyeIcon />
              </button>
            </label>

            <div className={styles.dkdFormMetaRow}>
              <label className={styles.dkdRememberWrap}>
                <input
                  type="checkbox"
                  checked={dkdRememberEnabled}
                  onChange={() => dkdSetRememberEnabled(!dkdRememberEnabled)}
                />
                <span className={styles.dkdCheckboxVisual}>✓</span>
                <span>Beni Hatırla</span>
              </label>
              <button type="button" className={styles.dkdForgotButton}>Şifremi Unuttum?</button>
            </div>

            <button type="submit" className={styles.dkdPrimaryButton}>
              <span>{dkdPrimaryLabel}</span>
              <strong>›</strong>
            </button>
          </form>

          <div className={styles.dkdDividerRow}>
            <span />
            <p>Veya şununla devam et</p>
            <span />
          </div>

          <div className={styles.dkdSocialGrid}>
            <button type="button" className={styles.dkdSocialButton}>
              <span className={styles.dkdGoogleMark}>G</span>
              <strong>Google</strong>
            </button>
            <button type="button" className={styles.dkdSocialButton}>
              <span className={styles.dkdAppleMark}></span>
              <strong>Apple</strong>
            </button>
            <button type="button" className={styles.dkdSocialButton}>
              <span className={styles.dkdInstagramMark}>◎</span>
              <strong>Instagram</strong>
            </button>
          </div>

          <button type="button" className={styles.dkdRegisterButton} onClick={() => dkdSetAuthMode('register')}>
            <span>ÜYE OL</span>
            <DkdUserPlusIcon />
          </button>

          <div className={styles.dkdTrustCard}>
            <DkdShieldIcon />
            <div>
              <strong>%100 Güvenli & Özel</strong>
              <span>Tüm bilgileriniz gizli tutulur. Sadece üyeler için özel bir dünya.</span>
            </div>
            <div className={styles.dkdMiniMiamiIcon} aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
