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

  document.addEventListener('DOMContentLoaded', () => {
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
  });
})();
