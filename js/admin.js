(function () {
  let adminQuestions = [];
  let adminUsers = [];

  function getFormPayload(form) {
    const data = new FormData(form);
    return {
      subject: data.get('subject'),
      question_text_en: data.get('question_text_en'),
      question_text_uz: data.get('question_text_uz'),
      options_en: [data.get('option_en_1'), data.get('option_en_2'), data.get('option_en_3'), data.get('option_en_4')],
      options_uz: [data.get('option_uz_1'), data.get('option_uz_2'), data.get('option_uz_3'), data.get('option_uz_4')],
      correct_answer_index: Number(data.get('correct_answer_index'))
    };
  }

  function setAdminMessage(message, type = '') {
    const element = document.getElementById('adminMessage');
    if (!element) return;
    element.textContent = message || '';
    element.className = `form-message${type ? ` ${type}` : ''}`;
  }

  function renderQuestions() {
    const body = document.getElementById('questionsBody');

    if (adminQuestions.length === 0) {
      body.innerHTML = `<tr><td colspan="5" class="empty-cell">${t('adminNoQuestions')}</td></tr>`;
      return;
    }

    body.innerHTML = adminQuestions
      .map((question) => `
        <tr>
          <td>${question.id}</td>
          <td>${question.subject}</td>
          <td>${question.question_text_en}</td>
          <td>${question.question_text_uz}</td>
          <td>
            <button type="button" class="danger-inline-btn" data-delete-question="${question.id}">
              ${t('adminRemoveQuestion')}
            </button>
          </td>
        </tr>
      `)
      .join('');

    body.querySelectorAll('[data-delete-question]').forEach((button) => {
      button.addEventListener('click', async () => {
        const questionId = button.getAttribute('data-delete-question');
        try {
          await window.apiClient.delete(`/admin/questions/${questionId}`, { auth: true });
          await loadQuestions();
        } catch (error) {
          setAdminMessage(error.message, 'error');
        }
      });
    });
  }

  async function loadQuestions() {
    adminQuestions = await window.apiClient.get('/admin/questions', { auth: true });
    renderQuestions();
  }

  function renderUsers() {
    const body = document.getElementById('usersBody');

    if (adminUsers.length === 0) {
      body.innerHTML = `<tr><td colspan="5" class="empty-cell">${t('adminNoUsers')}</td></tr>`;
      return;
    }

    body.innerHTML = adminUsers
      .map((user) => `
        <tr>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
          <td>${user.total_quizzes_taken}</td>
          <td>${user.best_score ?? '-'}</td>
        </tr>
      `)
      .join('');
  }

  async function loadUsers() {
    adminUsers = await window.apiClient.get('/admin/users', { auth: true });
    renderUsers();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.authClient.renderUserActions('headerUserActions');

    const profile = await window.authClient.requireAdmin();
    if (!profile) return;
    window.authClient.renderUserActions('headerUserActions');

    const form = document.getElementById('questionForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setAdminMessage('');

      try {
        await window.apiClient.post('/admin/questions', getFormPayload(form), { auth: true });
        form.reset();
        setAdminMessage(t('adminSaved'), 'success');
        await loadQuestions();
      } catch (error) {
        setAdminMessage(error.message, 'error');
      }
    });

    try {
      await Promise.all([loadQuestions(), loadUsers()]);
    } catch (error) {
      setAdminMessage(error.message, 'error');
    }
  });

  window.handleLanguageChange = function handleAdminLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
    renderQuestions();
    renderUsers();
  };
})();
