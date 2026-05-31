(function dkdAnyelaAuthGuardScope() {
  "use strict";

  const dkdAnyelaAuthScript = document.currentScript;
  const dkdAnyelaAuthMode = dkdAnyelaAuthScript && dkdAnyelaAuthScript.getAttribute("data-dkd-anyela-auth-mode")
    ? dkdAnyelaAuthScript.getAttribute("data-dkd-anyela-auth-mode")
    : "protected";
  const dkdAnyelaAuthHomePath = "/AnyelaBorn/Home/";
  const dkdAnyelaAuthLoginPath = "/AnyelaBorn/Login/";

  function dkdAnyelaAuthReadStorage(dkdAnyelaAuthKey) {
    try {
      return window.localStorage.getItem(dkdAnyelaAuthKey);
    } catch (dkdAnyelaAuthStorageError) {
      return null;
    }
  }

  function dkdAnyelaAuthHasGuestAccess() {
    return dkdAnyelaAuthReadStorage("dkd_anyela_guest_login_active") === "true";
  }

  function dkdAnyelaAuthHasSavedAccountAccess() {
    const dkdAnyelaAuthAccessFlag = dkdAnyelaAuthReadStorage("dkd_anyela_auth_access");
    const dkdAnyelaAuthAccountOnceFlag = dkdAnyelaAuthReadStorage("dkd_anyela_account_login_once");

    return dkdAnyelaAuthAccessFlag === "allowed" || dkdAnyelaAuthAccountOnceFlag === "true";
  }

  function dkdAnyelaAuthHasSupabaseSession() {
    const dkdAnyelaAuthSessionValue = dkdAnyelaAuthReadStorage("dkd_anyela_auth_session");
    if (!dkdAnyelaAuthSessionValue) {
      return false;
    }

    if (dkdAnyelaAuthSessionValue.indexOf("access_token") !== -1) {
      return true;
    }

    try {
      const dkdAnyelaAuthParsedSession = JSON.parse(dkdAnyelaAuthSessionValue);
      const dkdAnyelaAuthSessionBody = dkdAnyelaAuthParsedSession && dkdAnyelaAuthParsedSession.session
        ? dkdAnyelaAuthParsedSession.session
        : dkdAnyelaAuthParsedSession;

      return Boolean(dkdAnyelaAuthSessionBody && dkdAnyelaAuthSessionBody.access_token);
    } catch (dkdAnyelaAuthParseError) {
      return false;
    }
  }

  function dkdAnyelaAuthHasAccountAccess() {
    return dkdAnyelaAuthHasSavedAccountAccess() || dkdAnyelaAuthHasSupabaseSession();
  }

  function dkdAnyelaAuthHasAccess() {
    return dkdAnyelaAuthHasAccountAccess() || dkdAnyelaAuthHasGuestAccess();
  }

  function dkdAnyelaAuthRedirect(dkdAnyelaAuthTargetPath) {
    const dkdAnyelaAuthCurrentPath = window.location.pathname;
    if (dkdAnyelaAuthCurrentPath === dkdAnyelaAuthTargetPath) {
      return;
    }

    window.location.replace(dkdAnyelaAuthTargetPath);
  }

  const dkdAnyelaAuthAccountGranted = dkdAnyelaAuthHasAccountAccess();
  const dkdAnyelaAuthAccessGranted = dkdAnyelaAuthHasAccess();

  if (dkdAnyelaAuthMode === "login") {
    if (dkdAnyelaAuthAccessGranted) {
      dkdAnyelaAuthRedirect(dkdAnyelaAuthHomePath);
    }
    return;
  }

  if (dkdAnyelaAuthMode === "entry") {
    dkdAnyelaAuthRedirect(dkdAnyelaAuthAccessGranted ? dkdAnyelaAuthHomePath : dkdAnyelaAuthLoginPath);
    return;
  }

  if (dkdAnyelaAuthMode === "account") {
    if (!dkdAnyelaAuthAccountGranted) {
      dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);
    }
    return;
  }

  if (!dkdAnyelaAuthAccessGranted) {
    dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);
  }
})();