(function dkdAnyelaAuthGuardScope() {
  "use strict";

  const dkdAnyelaAuthScript = document.currentScript;
  const dkdAnyelaAuthMode = dkdAnyelaAuthScript && dkdAnyelaAuthScript.getAttribute("data-dkd-anyela-auth-mode")
    ? dkdAnyelaAuthScript.getAttribute("data-dkd-anyela-auth-mode")
    : "protected";
  const dkdAnyelaAuthHomePath = "/AnyelaBorn/Home/";
  const dkdAnyelaAuthLoginPath = "/AnyelaBorn/Login/";
  const dkdAnyelaAuthProfilePath = "/AnyelaBorn/Profile/";

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

  function dkdAnyelaAuthHasAccountAccess() {
    const dkdAnyelaAuthAccessFlag = dkdAnyelaAuthReadStorage("dkd_anyela_auth_access");
    const dkdAnyelaAuthAccountOnceFlag = dkdAnyelaAuthReadStorage("dkd_anyela_account_login_once");

    return dkdAnyelaAuthAccessFlag === "allowed" || dkdAnyelaAuthAccountOnceFlag === "true";
  }

  function dkdAnyelaAuthHasSavedAccess() {
    return dkdAnyelaAuthHasAccountAccess() || dkdAnyelaAuthHasGuestAccess();
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

  function dkdAnyelaAuthHasAccess() {
    return dkdAnyelaAuthHasSavedAccess() || dkdAnyelaAuthHasSupabaseSession();
  }

  function dkdAnyelaAuthHasRealAccountAccess() {
    return dkdAnyelaAuthHasAccountAccess() || dkdAnyelaAuthHasSupabaseSession();
  }

  function dkdAnyelaAuthRedirect(dkdAnyelaAuthTargetPath) {
    const dkdAnyelaAuthCurrentPath = window.location.pathname;
    if (dkdAnyelaAuthCurrentPath === dkdAnyelaAuthTargetPath) {
      return;
    }

    window.location.replace(dkdAnyelaAuthTargetPath);
  }

  const dkdAnyelaAuthCurrentPath = window.location.pathname;
  const dkdAnyelaAuthAccessGranted = dkdAnyelaAuthHasAccess();
  const dkdAnyelaAuthRealAccountGranted = dkdAnyelaAuthHasRealAccountAccess();

  if (dkdAnyelaAuthCurrentPath.indexOf(dkdAnyelaAuthProfilePath) === 0 && !dkdAnyelaAuthRealAccountGranted) {
    dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);
    return;
  }

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
    if (!dkdAnyelaAuthRealAccountGranted) {
      dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);
    }
    return;
  }

  if (!dkdAnyelaAuthAccessGranted) {
    dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);
  }
})();