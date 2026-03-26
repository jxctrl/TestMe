(function () {
  let profileData = null;
  let avatarFile = null;

  function setMessage(message, type = '') {
    const element = document.getElementById('settingsMessage');
    if (!element) return;
    element.textContent = message || '';
    element.className = `form-message${type ? ` ${type}` : ''}`;
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
      reader.onerror = () => reject(new Error('Failed to read selected image.'));
      reader.readAsDataURL(file);
    });
  }

  async function init() {
    window.authClient.renderUserActions('headerUserActions');

    profileData = await window.authClient.requireAuth();
    if (!profileData) return;

    const usernameInput = document.getElementById('settingsUsername');
    if (usernameInput) usernameInput.value = profileData.username || '';

    const avatarUrl = profileData.avatar_url || profileData.avatarUrl || profileData.avatar || null;
    const initial = (profileData.username || 'U').charAt(0).toUpperCase();
    setPreviewUsername(profileData.username || 'User');
    setSelectedFileName('');
    setAvatarPreview({ url: avatarUrl, initial });
    syncStoredUser(profileData);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await init();

    const avatarInput = document.getElementById('settingsAvatarInput');
    const usernameInput = document.getElementById('settingsUsername');

    if (usernameInput) {
      usernameInput.addEventListener('input', (event) => {
        setPreviewUsername(event.target.value);
      });
    }

    if (avatarInput) {
      avatarInput.addEventListener('change', async (event) => {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        avatarFile = file;

        if (!file) {
          setSelectedFileName('');
          setPreviewUsername(usernameInput?.value || profileData?.username || 'User');
          const currentAvatarUrl = profileData?.avatar_url || profileData?.avatarUrl || profileData?.avatar || null;
          setAvatarPreview({
            url: currentAvatarUrl,
            initial: ((usernameInput?.value || profileData?.username || 'U').trim().charAt(0) || 'U').toUpperCase()
          });
          return;
        }

        try {
          setMessage('', '');
          setSelectedFileName(file.name);
          const dataUrl = await readFileAsDataUrl(file);
          setAvatarPreview({ url: dataUrl, initial: null });
        } catch (error) {
          setMessage(error.message, 'error');
        }
      });
    }

    const form = document.getElementById('settingsForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const username = (usernameInput?.value || '').trim();

      if (!username || username.length < 3) {
        setMessage('Username must be at least 3 characters.', 'error');
        return;
      }

      setMessage('', '');
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

        const refreshedUsername = profileData?.username || username;
        const refreshedAvatarUrl = profileData?.avatar_url || profileData?.avatarUrl || profileData?.avatar || null;

        if (usernameInput) usernameInput.value = refreshedUsername;
        setPreviewUsername(refreshedUsername);

        const initial = refreshedUsername ? refreshedUsername.charAt(0).toUpperCase() : 'U';
        setAvatarPreview({ url: refreshedAvatarUrl, initial });

        window.authClient.renderUserActions('headerUserActions');
        setMessage(t('settingsSaved'), 'success');
        avatarFile = null;
        setSelectedFileName('');
        if (avatarInput) avatarInput.value = '';
      } catch (error) {
        const msg = error.status === 401
          ? t('settingsSaveFailed')
          : `${t('settingsSaveFailed')} ${error.message}`;
        setMessage(msg, 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = t('settingsSaveButton');
        }
      }
    });
  });

  window.handleLanguageChange = function handleSettingsLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
  };
})();
