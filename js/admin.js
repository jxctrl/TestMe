(function () {
  const SUBJECT_KEYS = {
    mathematics: 'badgeMath',
    english: 'badgeEnglish',
    science: 'badgeScience',
    history: 'badgeHistory',
    geography: 'badgeGeo',
    cs: 'badgeCS',
    mixed: 'mixedSubject'
  };
  const SUBJECT_COLORS = {
    mathematics: '#7b7eff',
    english: '#2edbff',
    science: '#f3b12f',
    history: '#c864ff',
    geography: '#5ee39d',
    cs: '#ff7f6b',
    mixed: '#94a3d4'
  };
  let adminQuestions = [];
  let adminUsers = [];

  function subjectLabel(subject) {
    return t(SUBJECT_KEYS[subject] || subject);
  }

  function formatText(key, replacements = {}) {
    return Object.entries(replacements).reduce(
      (message, [placeholder, value]) => message.replaceAll(`{${placeholder}}`, String(value)),
      t(key)
    );
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = value;
  }

  function renderLineChart(containerId, points, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!points || points.length === 0) {
      container.innerHTML = `<div class="chart-empty"><div class="empty-state">${emptyMessage}</div></div>`;
      return;
    }

    const width = 720;
    const height = 250;
    const paddingX = 28;
    const paddingTop = 18;
    const paddingBottom = 34;
    const maxValue = Math.max(1, ...points.map((point) => point.value));
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingTop - paddingBottom;

    const coords = points.map((point, index) => {
      const x = points.length === 1 ? width / 2 : paddingX + (usableWidth / (points.length - 1)) * index;
      const y = paddingTop + usableHeight - (point.value / maxValue) * usableHeight;
      return { ...point, x, y };
    });

    const linePath = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;
    const guideValues = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];
    const guideMarkup = guideValues
      .map((value) => {
        const y = paddingTop + usableHeight - (value / maxValue) * usableHeight;
        return `
          <line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="rgba(136, 150, 198, 0.18)" stroke-dasharray="4 8" />
          <text x="${paddingX - 8}" y="${y + 4}" text-anchor="end" fill="#7280a9" font-size="12">${value}</text>
        `;
      })
      .join('');
    const pointMarkup = coords
      .map(
        (point) => `
          <circle cx="${point.x}" cy="${point.y}" r="4.5" fill="#0f1730" stroke="#7b7eff" stroke-width="3" />
        `
      )
      .join('');

    container.innerHTML = `
      <div class="line-chart-canvas">
        <svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${emptyMessage}">
          <defs>
            <linearGradient id="${containerId}Area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="rgba(123, 126, 255, 0.32)"></stop>
              <stop offset="100%" stop-color="rgba(46, 219, 255, 0.03)"></stop>
            </linearGradient>
          </defs>
          ${guideMarkup}
          <path d="${areaPath}" fill="url(#${containerId}Area)"></path>
          <path d="${linePath}" fill="none" stroke="#7b7eff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
          ${pointMarkup}
        </svg>
        <div class="chart-axis-row" style="--chart-columns:${points.length}">
          ${points.map((point) => `<span class="chart-axis-label">${point.label}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderDonutChart(chartId, legendId, entries, centerLabel, emptyMessage) {
    const chart = document.getElementById(chartId);
    const legend = document.getElementById(legendId);
    if (!chart || !legend) return;

    if (!entries || entries.length === 0) {
      chart.innerHTML = `<div class="chart-empty"><div class="empty-state">${emptyMessage}</div></div>`;
      legend.innerHTML = '';
      return;
    }

    const total = entries.reduce((sum, entry) => sum + entry.value, 0);
    let progress = 0;
    const gradient = entries
      .map((entry) => {
        const start = progress;
        progress += (entry.value / total) * 100;
        return `${entry.color} ${start}% ${progress}%`;
      })
      .join(', ');

    chart.innerHTML = `
      <div class="donut-ring" style="background: conic-gradient(${gradient});">
        <div class="donut-hole">
          <strong>${total}</strong>
          <span>${centerLabel}</span>
        </div>
      </div>
    `;

    legend.innerHTML = entries
      .map((entry) => {
        const percentage = Math.round((entry.value / total) * 100);
        return `
          <article class="donut-legend-item">
            <div class="legend-head">
              <div class="legend-copy">
                <span class="legend-swatch" style="background:${entry.color}"></span>
                <span class="legend-label">${entry.label}</span>
              </div>
              <span class="legend-value">${percentage}%</span>
            </div>
            <div class="legend-meta">${entry.value}</div>
          </article>
        `;
      })
      .join('');
  }

  function renderHorizontalBars(containerId, entries, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!entries || entries.length === 0) {
      container.innerHTML = `<div class="chart-empty"><div class="empty-state">${emptyMessage}</div></div>`;
      return;
    }

    const maxValue = Math.max(...entries.map((entry) => entry.value), 1);
    container.innerHTML = entries
      .map((entry) => {
        const width = Math.max(12, Math.round((entry.value / maxValue) * 100));
        return `
          <article class="hbar-item">
            <div class="hbar-head">
              <div class="hbar-name">${entry.label}</div>
              <div class="hbar-value">${entry.value}</div>
            </div>
            <div class="hbar-rail">
              <div class="hbar-fill" style="width:${width}%"></div>
            </div>
            <div class="hbar-meta">${entry.meta}</div>
          </article>
        `;
      })
      .join('');
  }

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
          <td>${subjectLabel(question.subject)}</td>
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
          renderAdminOverview();
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

  function renderQuestionMix() {
    const counts = adminQuestions.reduce((result, question) => {
      const key = question.subject || 'mixed';
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
    const entries = Object.entries(counts)
      .sort((left, right) => right[1] - left[1])
      .map(([subject, value]) => ({
        color: SUBJECT_COLORS[subject] || SUBJECT_COLORS.mixed,
        label: subjectLabel(subject),
        value
      }));

    renderDonutChart('adminQuestionDonut', 'adminSubjectDistribution', entries, t('adminQuestionsShort'), t('adminNoQuestions'));
  }

  function renderRecentUsers() {
    const container = document.getElementById('adminRecentUsersList');
    if (!container) return;

    if (adminUsers.length === 0) {
      container.innerHTML = `<div class="empty-state">${t('adminNoRecentUsers')}</div>`;
      return;
    }

    container.innerHTML = adminUsers
      .slice(0, 4)
      .map((user) => `
        <article class="recent-user-card">
          <div class="recent-user-head">
            <div class="recent-user-name">${user.username}</div>
            <div class="recent-user-date">${new Date(user.created_at).toLocaleDateString()}</div>
          </div>
          <div class="recent-user-email">${user.email}</div>
        </article>
      `)
      .join('');
  }

  function renderGrowthChart() {
    if (adminUsers.length === 0) {
      renderLineChart('adminGrowthChart', [], t('adminNoUsers'));
      setText('adminGrowthSummary', t('adminNoUsers'));
      setText('adminGrowthBadge', '--');
      return;
    }

    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      return new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    });
    const points = months.map((monthStart) => {
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
      const value = adminUsers.filter((user) => new Date(user.created_at) < monthEnd).length;
      return {
        label: monthStart.toLocaleDateString(undefined, { month: 'short' }),
        value
      };
    });
    const latestGrowth = points.length > 1 ? points[points.length - 1].value - points[points.length - 2].value : points[0]?.value || 0;

    renderLineChart('adminGrowthChart', points, t('adminNoUsers'));
    setText('adminGrowthSummary', formatText('adminGrowthSummaryValue', { count: points[points.length - 1]?.value || 0 }));
    setText('adminGrowthBadge', formatText('adminGrowthBadge', { count: latestGrowth }));
  }

  function renderPowerUsers() {
    const activeUsers = [...adminUsers]
      .filter((user) => user.total_quizzes_taken > 0)
      .sort((left, right) => right.total_quizzes_taken - left.total_quizzes_taken)
      .slice(0, 5)
      .map((user) => ({
        label: user.username,
        meta: formatText('adminPowerUsersMeta', {
          best: user.best_score ?? 0
        }),
        value: user.total_quizzes_taken
      }));

    renderHorizontalBars('adminPowerUsersChart', activeUsers, t('adminNoUsers'));
    setText(
      'adminPowerUsersSummary',
      activeUsers.length ? formatText('adminPowerUsersSummaryValue', { count: activeUsers.length }) : t('adminNoUsers')
    );
  }

  function renderAdminOverview() {
    const totalUsers = adminUsers.length;
    const totalQuestions = adminQuestions.length;
    const totalRuns = adminUsers.reduce((sum, user) => sum + (user.total_quizzes_taken || 0), 0);
    const subjectCounts = adminQuestions.reduce((result, question) => {
      const key = question.subject || 'mixed';
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
    const subjects = Object.keys(subjectCounts);
    const topSubject = subjects.sort((left, right) => subjectCounts[right] - subjectCounts[left])[0] || null;
    const latestUser = adminUsers[0] || null;

    setText('adminUsersCount', totalUsers);
    setText('adminQuestionCount', totalQuestions);
    setText('adminRunCount', totalRuns);
    setText('adminSubjectCount', subjects.length);
    setText('adminUsersNote', latestUser ? formatText('adminLatestSignup', { name: latestUser.username }) : t('adminNoUsers'));
    setText('adminQuestionNote', formatText('adminAcrossSubjects', { count: subjects.length || 0 }));
    setText('adminRunNote', t('adminRunsTracked'));
    setText('adminSubjectNote', topSubject ? formatText('adminTopSubjectValue', { subject: subjectLabel(topSubject) }) : t('adminNoQuestions'));

    renderGrowthChart();
    renderQuestionMix();
    renderPowerUsers();
    renderRecentUsers();
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
        renderAdminOverview();
      } catch (error) {
        setAdminMessage(error.message, 'error');
      }
    });

    try {
      await Promise.all([loadQuestions(), loadUsers()]);
      renderAdminOverview();
    } catch (error) {
      setAdminMessage(error.message, 'error');
    }
  });

  window.handleLanguageChange = function handleAdminLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
    renderQuestions();
    renderUsers();
    renderAdminOverview();
  };
})();
