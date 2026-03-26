(function () {
  const TOKEN_KEY = 'quizarena_token';
  const USER_KEY = 'quizarena_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (_error) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  function saveSession(payload) {
    localStorage.setItem(TOKEN_KEY, payload.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function isAuthenticated() {
    return Boolean(getToken());
  }

  function getRedirectTarget(defaultTarget = 'profile.html') {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || defaultTarget;
  }

  function redirectToLogin() {
    const currentPage = `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.search}`;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
  }

  function handlePostAuthRedirect(defaultTarget = 'profile.html') {
    window.location.href = getRedirectTarget(defaultTarget);
  }

  async function fetchCurrentUser() {
    if (!getToken()) return null;

    try {
      const profile = await window.apiClient.get('/users/me', { auth: true });
      const avatarUrl = profile.avatar_url || profile.avatarUrl || profile.avatar || null;
      setUser({
        id: profile.id,
        username: profile.username,
        email: profile.email,
        created_at: profile.created_at,
        is_admin: profile.is_admin,
        avatar_url: avatarUrl
      });
      return profile;
    } catch (error) {
      if (error.status === 401) {
        clearSession();
      }
      return null;
    }
  }

  async function requireAuth({ redirect = true } = {}) {
    if (!getToken()) {
      if (redirect) redirectToLogin();
      return null;
    }

    const profile = await fetchCurrentUser();
    if (!profile && redirect) {
      redirectToLogin();
    }
    return profile;
  }

  async function requireAdmin({ redirect = true } = {}) {
    const profile = await requireAuth({ redirect });
    if (!profile) return null;
    if (!profile.is_admin) {
      if (redirect) {
        window.location.href = 'index.html';
      }
      return null;
    }
    return profile;
  }

  function logout() {
    clearSession();
    window.location.href = 'index.html';
  }

  function createLink(label, href, className = 'nav-user-link') {
    return `<a href="${href}" class="${className}">${label}</a>`;
  }

  function renderUserActions(elementId, { compact = false } = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const user = getStoredUser();
    if (!user) {
      element.innerHTML = [
        createLink(t('navLogin'), `login.html?redirect=${encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html')}`),
        createLink(t('navRegister'), 'register.html')
      ].join('');
      return;
    }

    const links = [
      createLink(user.username, 'profile.html', compact ? 'nav-user-pill' : 'nav-user-link'),
      user.is_admin ? createLink(t('navAdmin'), 'admin.html') : '',
      `<button type="button" class="nav-user-link nav-user-button" id="${elementId}Logout">${t('navLogout')}</button>`
    ].join('');

    element.innerHTML = links;
    const logoutButton = document.getElementById(`${elementId}Logout`);
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
  }

  window.authClient = {
    getToken,
    getStoredUser,
    saveSession,
    setUser,
    clearSession,
    isAuthenticated,
    fetchCurrentUser,
    requireAuth,
    requireAdmin,
    redirectToLogin,
    handlePostAuthRedirect,
    renderUserActions,
    logout
  };
})();
