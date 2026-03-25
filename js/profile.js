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
  let profileData = null;

  function subjectLabel(subject) {
    return t(SUBJECT_KEYS[subject] || subject);
  }

  function renderBestScores(bestScores) {
    const container = document.getElementById('bestScoresList');
    if (!container) return;

    if (bestScores.length === 0) {
      container.innerHTML = `<div class="empty-state">${t('profileNoScores')}</div>`;
      return;
    }

    container.innerHTML = bestScores
      .map((item) => `
        <div class="stat-list-item">
          <span>${subjectLabel(item.subject)}</span>
          <strong>${item.best_score}</strong>
        </div>
      `)
      .join('');
  }

  function renderHistory(history) {
    const body = document.getElementById('historyBody');
    if (!body) return;

    if (history.length === 0) {
      body.innerHTML = `<tr><td colspan="4" class="empty-cell">${t('profileNoScores')}</td></tr>`;
      return;
    }

    body.innerHTML = history
      .map((item) => `
        <tr>
          <td>${subjectLabel(item.subject)}</td>
          <td>${item.mode}</td>
          <td>${item.score}</td>
          <td>${new Date(item.completed_at).toLocaleString()}</td>
        </tr>
      `)
      .join('');
  }

  function getLevelInfo(totalQuizzes) {
    const thresholds = [
      { min: 0, label: 'Newcomer', next: 1 },
      { min: 1, label: 'Beginner', next: 10 },
      { min: 10, label: 'Intermediate', next: 25 },
      { min: 25, label: 'Pro', next: 45 },
      { min: 45, label: 'Expert', next: 70 },
      { min: 70, label: 'Master', next: null }
    ];

    let level = thresholds[0];
    for (const t of thresholds) {
      if (totalQuizzes >= t.min) level = t;
      else break;
    }
    return level;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.authClient.renderUserActions('headerUserActions');

    profileData = await window.authClient.requireAuth();
    if (!profileData) return;
    window.authClient.renderUserActions('headerUserActions');

    document.getElementById('profileUsername').textContent = profileData.username;
    document.getElementById('profileEmail').textContent = profileData.email;
    document.getElementById('profileMemberSince').textContent = new Date(profileData.created_at).toLocaleDateString();

    const totalQuizzes = profileData.stats?.total_quizzes_taken || 0;
    document.getElementById('totalQuizzesCount').textContent = totalQuizzes;

    const levelInfo = getLevelInfo(totalQuizzes);
    const levelLabel = document.getElementById('profileLevel');
    const progressFill = document.getElementById('profileProgressFill');
    const progressText = document.getElementById('profileProgressText');
    const avatar = document.getElementById('profileAvatar');
    const topSubject = document.getElementById('profileTopSubject');

    if (avatar) {
      avatar.textContent = (profileData.username || 'U').charAt(0).toUpperCase();
      avatar.setAttribute('aria-label', profileData.username || 'User avatar');
    }

    if (levelLabel) {
      levelLabel.textContent = levelInfo.label;
    }

    if (progressFill && progressText) {
      if (levelInfo.next) {
        const progress = Math.min(100, Math.round(((totalQuizzes - levelInfo.min) / (levelInfo.next - levelInfo.min)) * 100));
        progressFill.style.width = `${progress}%`;
        const remaining = Math.max(0, levelInfo.next - totalQuizzes);
        progressText.textContent = `${remaining} more quiz${remaining === 1 ? '' : 'zes'} to reach ${getLevelInfo(levelInfo.next).label}.`;
      } else {
        progressFill.style.width = '100%';
        progressText.textContent = 'You are at the top level — keep it going!';
      }
    }

    if (topSubject) {
      const bestScoreItem = (profileData.best_scores || []).sort((a, b) => b.best_score - a.best_score)[0];
      topSubject.textContent = bestScoreItem ? `Top: ${subjectLabel(bestScoreItem.subject)} ${bestScoreItem.best_score}` : 'No best score yet';
    }

    if (profileData.is_admin) {
      document.getElementById('profileAdminLink').style.display = 'inline-flex';
    }

    renderBestScores(profileData.best_scores);
    renderHistory(profileData.score_history);
  });

  window.handleLanguageChange = function handleProfileLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
    if (!profileData) return;
    renderBestScores(profileData.best_scores);
    renderHistory(profileData.score_history);
  };
})();
