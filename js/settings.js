(function () {
  let profileData = null;
  let avatarFile = null;
  let preferenceMessageTimer = null;

  function setMessage(elementId, message, type = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message || '';
    element.className = `form-message${type ? ` ${type}` : ''}`;
  }

  function setText(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
  }

  function getPreferredLanguage() {
    return localStorage.getItem('lang') || 'en';
  }

  function setPreviewUsername(username) {
    const normalized = (username || '').trim();
    const displayName = normalized || 'User';
    const previewName = document.getElementById('settingsPreviewUsername');
    const avatarImage = document.getElementById('settingsAvatarImage');
    const avatarInitial = document.getElementById('settingsAvatarInitial');

    if (previewName) previewName.textContent = displayName;

    if (avatarInitial && (!avatarImage || avatarImage.style.display !== 'block')) {
      avatarInitial.textContent = displayName.charAt(0).toUpperCase();
    }
  }

  function setSelectedFileName(name = '') {
    const element = document.getElementById('settingsSelectedFile');
    if (!element) return;

    element.textContent = name || '';
    element.classList.toggle('visible', Boolean(name));
  }

  function syncStoredUser(profile) {
    if (!profile || !window.authClient?.setUser) return;

    const existing = window.authClient.getStoredUser ? window.authClient.getStoredUser() || {} : {};
    const avatarUrl = profile.avatar_url || profile.avatarUrl || profile.avatar || null;

    window.authClient.setUser({
      ...existing,
      id: profile.id ?? existing.id,
      username: profile.username ?? existing.username,
      email: profile.email ?? existing.email,
      created_at: profile.created_at ?? existing.created_at,
      is_admin: profile.is_admin ?? existing.is_admin ?? false,
      avatar_url: avatarUrl
    });
  }

  function setAvatarPreview({ url = null, initial = null } = {}) {
    const avatarImage = document.getElementById('settingsAvatarImage');
    const avatarInitial = document.getElementById('settingsAvatarInitial');

    if (url && avatarImage && avatarInitial) {
      avatarImage.src = url;
      avatarImage.alt = 'Profile picture preview';
      avatarImage.style.display = 'block';
      avatarInitial.style.display = 'none';
      return;
    }

    if (avatarInitial) {
      avatarInitial.textContent = initial || '?';
      avatarInitial.style.display = 'block';
    }

    if (avatarImage) {
      avatarImage.removeAttribute('src');
      avatarImage.style.display = 'none';
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(t('settingsImageReadFailed')));
      reader.readAsDataURL(file);
    });
  }

  function refreshOverview() {
    if (!profileData) return;

    const email = profileData.email || '—';
    const memberSince = profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : '—';
    const role = profileData.is_admin ? t('settingsRoleAdmin') : t('settingsRoleMember');
    const emailInput = document.getElementById('settingsEmail');
    const languageSelect = document.getElementById('settingsLanguage');
    const adminShortcut = document.getElementById('settingsAdminShortcut');

    if (emailInput) emailInput.value = profileData.email || '';
    if (languageSelect) languageSelect.value = getPreferredLanguage();
    if (adminShortcut) adminShortcut.style.display = profileData.is_admin ? 'inline-flex' : 'none';

    setText('settingsOverviewEmail', email);
    setText('settingsOverviewMemberSince', memberSince);
    setText('settingsOverviewRole', role);
  }

  function showPreferenceSavedMessage() {
    setMessage('settingsPreferenceMessage', t('settingsLanguageSaved'), 'success');
    if (preferenceMessageTimer) {
      window.clearTimeout(preferenceMessageTimer);
    }
    preferenceMessageTimer = window.setTimeout(() => {
      setMessage('settingsPreferenceMessage', '');
    }, 2400);
  }

  async function init() {
    window.authClient.renderUserActions('headerUserActions');

    profileData = await window.authClient.requireAuth();
    if (!profileData) return;

    const usernameInput = document.getElementById('settingsUsername');
    if (usernameInput) usernameInput.value = profileData.username || '';

    setPreviewUsername(profileData.username || 'User');
    setSelectedFileName('');
    setAvatarPreview({
      url: profileData.avatar_url || profileData.avatarUrl || profileData.avatar || null,
      initial: (profileData.username || 'U').charAt(0).toUpperCase()
    });
    refreshOverview();
    syncStoredUser(profileData);
    setMessage('settingsMessage', '');
    setMessage('settingsPreferenceMessage', '');
    setMessage('settingsDangerMessage', '');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await init();

    const usernameInput = document.getElementById('settingsUsername');
    const avatarInput = document.getElementById('settingsAvatarInput');
    const languageSelect = document.getElementById('settingsLanguage');
    const form = document.getElementById('settingsForm');
    const deleteAccountButton = document.getElementById('deleteAccountBtn');

    if (usernameInput) {
      usernameInput.addEventListener('input', (event) => {
        setPreviewUsername(event.target.value);
      });
    }

    if (languageSelect) {
      languageSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
        showPreferenceSavedMessage();
      });
    }

    if (avatarInput) {
      avatarInput.addEventListener('change', async (event) => {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        avatarFile = file;

        if (!file) {
          setSelectedFileName('');
          setPreviewUsername(usernameInput?.value || profileData?.username || 'User');
          setAvatarPreview({
            url: profileData?.avatar_url || profileData?.avatarUrl || profileData?.avatar || null,
            initial: ((usernameInput?.value || profileData?.username || 'U').trim().charAt(0) || 'U').toUpperCase()
          });
          return;
        }

        try {
          setMessage('settingsMessage', '');
          setSelectedFileName(file.name);
          const dataUrl = await readFileAsDataUrl(file);
          setAvatarPreview({ url: dataUrl, initial: null });
        } catch (error) {
          setMessage('settingsMessage', error.message, 'error');
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const username = (usernameInput?.value || '').trim();

        if (!username || username.length < 3) {
          setMessage('settingsMessage', t('settingsUsernameTooShort'), 'error');
          return;
        }

        setMessage('settingsMessage', '');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = t('settingsSaving');
        }

        try {
          let updatedProfile = await window.apiClient.patch('/users/me', { username }, { auth: true });

          if (avatarFile) {
            const fd = new FormData();
            fd.append('avatar', avatarFile);
            updatedProfile = await window.apiClient.post('/users/me/avatar', fd, { auth: true });
          }

          profileData = updatedProfile || profileData;
          syncStoredUser(profileData);
          refreshOverview();

          const refreshedUsername = profileData?.username || username;
          const refreshedAvatarUrl = profileData?.avatar_url || profileData?.avatarUrl || profileData?.avatar || null;

          if (usernameInput) usernameInput.value = refreshedUsername;
          setPreviewUsername(refreshedUsername);
          setAvatarPreview({
            url: refreshedAvatarUrl,
            initial: refreshedUsername ? refreshedUsername.charAt(0).toUpperCase() : 'U'
          });

          window.authClient.renderUserActions('headerUserActions');
          setMessage('settingsMessage', t('settingsSaved'), 'success');
          avatarFile = null;
          setSelectedFileName('');
          if (avatarInput) avatarInput.value = '';
        } catch (error) {
          const msg = error.status === 401
            ? t('settingsSaveFailed')
            : `${t('settingsSaveFailed')} ${error.message}`;
          setMessage('settingsMessage', msg, 'error');
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = t('settingsSaveButton');
          }
        }
      });
    }

    if (deleteAccountButton) {
      deleteAccountButton.addEventListener('click', async () => {
        if (!window.confirm(t('settingsDeleteConfirm'))) return;

        setMessage('settingsDangerMessage', '');
        deleteAccountButton.disabled = true;
        deleteAccountButton.textContent = t('settingsDeleting');

        try {
          await window.apiClient.delete('/users/me', { auth: true });
          window.authClient.clearSession();
          window.location.href = 'index.html';
        } catch (error) {
          const msg = error.status === 401
            ? t('settingsDeleteFailed')
            : `${t('settingsDeleteFailed')} ${error.message}`;
          setMessage('settingsDangerMessage', msg, 'error');
          deleteAccountButton.disabled = false;
          deleteAccountButton.textContent = t('settingsDeleteButton');
        }
      });
    }
  });

  window.handleLanguageChange = function handleSettingsLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
    if (!profileData) return;
    refreshOverview();
    const usernameInput = document.getElementById('settingsUsername');
    setPreviewUsername(usernameInput?.value || profileData.username || 'User');
  };
})();
