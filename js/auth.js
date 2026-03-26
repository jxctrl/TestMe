(function () {
  const TOKEN_KEY = 'quizarena_token';
  const USER_KEY = 'quizarena_user';
  let menuListenersAttached = false;

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

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getAvatarUrl(user) {
    return user?.avatar_url || user?.avatarUrl || user?.avatar || null;
  }

  function getUserInitial(user) {
    return (user?.username || 'U').trim().charAt(0).toUpperCase() || 'U';
  }

  function closeAllUserMenus(exceptMenu = null) {
    document.querySelectorAll('.user-menu').forEach((menu) => {
      if (menu === exceptMenu) return;
      menu.classList.remove('open');
      const trigger = menu.querySelector('.user-menu-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function ensureMenuListeners() {
    if (menuListenersAttached) return;
    menuListenersAttached = true;

    document.addEventListener('click', (event) => {
      const activeMenu = event.target.closest('.user-menu');
      if (!activeMenu) {
        closeAllUserMenus();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAllUserMenus();
      }
    });
  }

  function createUserMenuMarkup(elementId, user) {
    const avatarUrl = getAvatarUrl(user);
    const initial = getUserInitial(user);
    const menuId = `${elementId}Menu`;
    const triggerId = `${elementId}Trigger`;
    const logoutId = `${elementId}Logout`;
    const practiceLabel = t('profileStartQuiz');
    const competitionLabel = t('modeCompetition');
    const safeUsername = escapeHtml(user.username);
    const safeEmail = escapeHtml(user.email || '');

    return `
      <div class="user-menu" id="${menuId}">
        <button
          type="button"
          class="user-menu-trigger"
          id="${triggerId}"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="${t('navProfile')}"
        >
          <span class="user-menu-avatar" aria-hidden="true">
            ${avatarUrl
              ? `<img src="${avatarUrl}" alt="" class="user-menu-avatar-image" />`
              : `<span class="user-menu-avatar-initial">${initial}</span>`}
          </span>
          <span class="user-menu-name">${safeUsername}</span>
          <span class="user-menu-caret" aria-hidden="true">▾</span>
        </button>

        <div class="user-menu-panel" role="menu" aria-labelledby="${triggerId}">
          <div class="user-menu-head">
            <span class="user-menu-avatar user-menu-avatar-large" aria-hidden="true">
              ${avatarUrl
                ? `<img src="${avatarUrl}" alt="" class="user-menu-avatar-image" />`
                : `<span class="user-menu-avatar-initial">${initial}</span>`}
            </span>
            <div class="user-menu-meta">
              <strong>${safeUsername}</strong>
              <span>${safeEmail}</span>
            </div>
          </div>

          <a href="profile.html" class="user-menu-link" role="menuitem">${t('navProfile')}</a>
          <a href="settings.html" class="user-menu-link" role="menuitem">${t('navSettings')}</a>
          <a href="quiz.html" class="user-menu-link" role="menuitem">${practiceLabel}</a>
          <a href="competition.html" class="user-menu-link" role="menuitem">${competitionLabel}</a>
          ${user.is_admin ? `<a href="admin.html" class="user-menu-link" role="menuitem">${t('navAdmin')}</a>` : ''}
          <button type="button" class="user-menu-link user-menu-logout" role="menuitem" id="${logoutId}">${t('navLogout')}</button>
        </div>
      </div>
    `;
  }

  function attachUserMenu(elementId) {
    const menu = document.getElementById(`${elementId}Menu`);
    if (!menu) return;

    ensureMenuListeners();

    const trigger = document.getElementById(`${elementId}Trigger`);
    const logoutButton = document.getElementById(`${elementId}Logout`);

    if (trigger) {
      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !menu.classList.contains('open');
        closeAllUserMenus(menu);
        menu.classList.toggle('open', willOpen);
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    menu.querySelectorAll('.user-menu-link[href]').forEach((link) => {
      link.addEventListener('click', () => closeAllUserMenus());
    });

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        closeAllUserMenus();
        logout();
      });
    }
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

    element.innerHTML = createUserMenuMarkup(elementId, user, compact);
    attachUserMenu(elementId);
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
