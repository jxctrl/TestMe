(function () {
  function setMessage(element, message, type = '') {
    if (!element) return;
    element.textContent = message || '';
    element.className = `form-message${type ? ` ${type}` : ''}`;
  }

  async function handleFormSubmit(form, endpoint) {
    const messageEl = document.getElementById('authMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setMessage(messageEl, '');
    submitButton.disabled = true;
    submitButton.textContent = t('authProcessing');

    try {
      const result = await window.apiClient.post(endpoint, payload);
      window.authClient.saveSession(result);
      window.authClient.handlePostAuthRedirect('profile.html');
    } catch (error) {
      setMessage(messageEl, error.message, 'error');
      submitButton.disabled = false;
      submitButton.textContent = endpoint.includes('register') ? t('registerSubmit') : t('loginSubmit');
    }
  }

  async function loadGoogleIdentityClient() {
    if (window.google?.accounts?.id) {
      return window.google.accounts.id;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          resolve(window.google.accounts.id);
        } else {
          reject(new Error('Google Identity Services failed to load.'));
        }
      };
      script.onerror = () => reject(new Error('Google Identity Services failed to load.'));
      document.head.appendChild(script);
    });
  }

  async function handleGoogleCredentialResponse(response) {
    const messageEl = document.getElementById('authMessage');
    if (!response?.credential) {
      setMessage(messageEl, 'Google login failed. Please try again.', 'error');
      return;
    }

    try {
      const result = await window.apiClient.post('/auth/google', { credential: response.credential });
      window.authClient.saveSession(result);
      window.authClient.handlePostAuthRedirect('profile.html');
    } catch (error) {
      setMessage(messageEl, error.message || 'Google login failed. Please try again.', 'error');
    }
  }

  async function initializeGoogleLogin() {
    const container = document.getElementById('googleButtonContainer');
    const socialArea = document.querySelector('.social-auth');
    if (!container || !socialArea) return;

    try {
      const config = await window.apiClient.get('/auth/config');
      const clientId = config?.google_client_id;
      if (!clientId) {
        socialArea.style.display = 'none';
        return;
      }

      const accountsId = await loadGoogleIdentityClient();
      accountsId.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup'
      });
      accountsId.renderButton(container, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        width: '100%',
        text: 'continue_with'
      });
    } catch (_error) {
      const socialAreaElement = document.querySelector('.social-auth');
      if (socialAreaElement) {
        socialAreaElement.style.display = 'none';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('authForm');
    if (!form) return;

    if (window.authClient.isAuthenticated()) {
      window.authClient.handlePostAuthRedirect('profile.html');
      return;
    }

    const pageType = form.dataset.authPage;
    const endpoint = pageType === 'register' ? '/auth/register' : '/auth/login';

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleFormSubmit(form, endpoint);
    });

    await initializeGoogleLogin();
  });
})();
