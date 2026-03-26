(function () {
  let profileData = null;
  let avatarFile = null;

  function setMessage(message, type = '') {
    const element = document.getElementById('settingsMessage');
    if (!element) return;
    element.textContent = message || '';
    element.className = `form-message${type ? ` ${type}` : ''}`;
  }

  function setAvatarPreview({ url = null, initial = null } = {}) {
    const avatarImage = document.getElementById('settingsAvatarImage');
    const avatarInitial = document.getElementById('settingsAvatarInitial');

    if (url && avatarImage && avatarInitial) {
      avatarImage.src = url;
      avatarImage.style.display = 'block';
      avatarInitial.style.display = 'none';
      return;
    }

    if (avatarInitial) {
      avatarInitial.textContent = initial || '?';
      avatarInitial.style.display = 'block';
    }

    if (avatarImage) avatarImage.style.display = 'none';
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
    setAvatarPreview({ url: avatarUrl, initial });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await init();

    const avatarInput = document.getElementById('settingsAvatarInput');
    if (avatarInput) {
      avatarInput.addEventListener('change', async (event) => {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        avatarFile = file;
        if (!file) return;

        try {
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

      const usernameInput = document.getElementById('settingsUsername');
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
        // 1) Update username (JSON).
        await window.apiClient.patch('/users/me', { username }, { auth: true });

        // 2) Upload avatar (multipart/form-data) if user selected a file.
        if (avatarFile) {
          const fd = new FormData();
          fd.append('avatar', avatarFile);
          await window.apiClient.post('/users/me/avatar', fd, { auth: true });
        }

        // Refresh cached profile (updates header + profile avatar).
        profileData = await window.authClient.fetchCurrentUser();

        const refreshedUsername = profileData?.username || username;
        const refreshedAvatarUrl = profileData?.avatar_url || profileData?.avatarUrl || profileData?.avatar || null;

        if (usernameInput) usernameInput.value = refreshedUsername;

        const initial = refreshedUsername ? refreshedUsername.charAt(0).toUpperCase() : 'U';
        setAvatarPreview({ url: refreshedAvatarUrl, initial });

        window.authClient.renderUserActions('headerUserActions');
        setMessage(t('settingsSaved'), 'success');
        avatarFile = null;
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

