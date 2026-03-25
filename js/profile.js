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
  const LEVELS = [
    { min: 0, labelKey: 'profileLevelNewcomer', next: 1 },
    { min: 1, labelKey: 'profileLevelBeginner', next: 10 },
    { min: 10, labelKey: 'profileLevelIntermediate', next: 25 },
    { min: 25, labelKey: 'profileLevelPro', next: 45 },
    { min: 45, labelKey: 'profileLevelExpert', next: 70 },
    { min: 70, labelKey: 'profileLevelMaster', next: null }
  ];
  const BADGE_DEFINITIONS = {
    first_quiz: { icon: '🎯', titleKey: 'badgeFirstQuiz', descKey: 'badgeFirstQuizDesc' },
    practice_starter: { icon: '📝', titleKey: 'badgePracticeStarter', descKey: 'badgePracticeStarterDesc' },
    speed_runner: { icon: '⚡', titleKey: 'badgeSpeedRunner', descKey: 'badgeSpeedRunnerDesc' },
    high_scorer: { icon: '🔥', titleKey: 'badgeHighScorer', descKey: 'badgeHighScorerDesc' },
    perfect_ten: { icon: '💯', titleKey: 'badgePerfectTen', descKey: 'badgePerfectTenDesc' },
    speed_champion: { icon: '🏆', titleKey: 'badgeSpeedChampion', descKey: 'badgeSpeedChampionDesc' },
    all_rounder: { icon: '🌍', titleKey: 'badgeAllRounder', descKey: 'badgeAllRounderDesc' },
    veteran: { icon: '🛡️', titleKey: 'badgeVeteran', descKey: 'badgeVeteranDesc' }
  };
  let profileData = null;

  function subjectLabel(subject) {
    return t(SUBJECT_KEYS[subject] || subject);
  }

  function formatText(key, replacements = {}) {
    return Object.entries(replacements).reduce(
      (message, [placeholder, value]) => message.replaceAll(`{${placeholder}}`, String(value)),
      t(key)
    );
  }

  function modeLabel(mode) {
    if (mode === 'practice') return t('modePractice');
    if (mode === 'competition') return t('modeCompetition');
    return mode;
  }

  function animateCount(element, targetValue) {
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || targetValue <= 0) {
      element.textContent = targetValue;
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    function tick(timestamp) {
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(targetValue * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
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
          <td>${modeLabel(item.mode)}</td>
          <td>${item.score}</td>
          <td>${new Date(item.completed_at).toLocaleString()}</td>
        </tr>
      `)
      .join('');
  }

  function getLevelInfo(totalQuizzes) {
    let level = LEVELS[0];
    for (const threshold of LEVELS) {
      if (totalQuizzes >= threshold.min) level = threshold;
      else break;
    }
    return level;
  }

  function getNextLevel(levelInfo) {
    if (levelInfo.next === null) return null;
    return LEVELS.find((level) => level.min === levelInfo.next) || null;
  }

  function getTopSubject(bestScores) {
    return [...(bestScores || [])].sort((a, b) => b.best_score - a.best_score)[0] || null;
  }

  function buildRecentBadges(history) {
    const orderedHistory = [...(history || [])].sort(
      (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );

    const awarded = new Set();
    const badges = [];
    const practicedSubjects = new Set();
    let totalCompleted = 0;

    function award(badgeId, earnedAt) {
      if (awarded.has(badgeId)) return;
      awarded.add(badgeId);
      badges.push({
        id: badgeId,
        earnedAt,
        ...BADGE_DEFINITIONS[badgeId]
      });
    }

    orderedHistory.forEach((item) => {
      totalCompleted += 1;
      const earnedAt = item.completed_at;

      if (item.subject !== 'mixed') {
        practicedSubjects.add(item.subject);
      }

      award('first_quiz', earnedAt);

      if (item.mode === 'practice') {
        award('practice_starter', earnedAt);
      }

      if (item.mode === 'competition') {
        award('speed_runner', earnedAt);
      }

      if (item.mode === 'practice' && item.score >= 8) {
        award('high_scorer', earnedAt);
      }

      if (item.mode === 'practice' && item.score >= 10) {
        award('perfect_ten', earnedAt);
      }

      if (item.mode === 'competition' && item.score >= 8000) {
        award('speed_champion', earnedAt);
      }

      if (practicedSubjects.size >= 3) {
        award('all_rounder', earnedAt);
      }

      if (totalCompleted >= 10) {
        award('veteran', earnedAt);
      }
    });

    return badges
      .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
      .slice(0, 4);
  }

  function renderRecentBadges(history) {
    const container = document.getElementById('recentBadgesList');
    if (!container) return;

    const badges = buildRecentBadges(history);
    if (badges.length === 0) {
      container.innerHTML = `<div class="empty-state">${t('profileNoBadges')}</div>`;
      return;
    }

    container.innerHTML = badges
      .map((badge) => `
        <article class="badge-card">
          <div class="badge-icon" aria-hidden="true">${badge.icon}</div>
          <div class="badge-copy">
            <div class="badge-title">${t(badge.titleKey)}</div>
            <p class="badge-desc">${t(badge.descKey)}</p>
            <div class="badge-date">${formatText('profileBadgeEarnedOn', {
              date: new Date(badge.earnedAt).toLocaleDateString()
            })}</div>
          </div>
        </article>
      `)
      .join('');
  }

  function renderProfileOverview({ animateStats = false } = {}) {
    if (!profileData) return;

    document.getElementById('profileUsername').textContent = profileData.username;
    document.getElementById('profileEmail').textContent = profileData.email;
    document.getElementById('profileMemberSince').textContent = new Date(profileData.created_at).toLocaleDateString();

    const totalQuizzes = profileData.stats?.total_quizzes_taken || 0;
    const totalQuizzesElement = document.getElementById('totalQuizzesCount');
    if (animateStats) {
      animateCount(totalQuizzesElement, totalQuizzes);
    } else {
      totalQuizzesElement.textContent = totalQuizzes;
    }

    const levelInfo = getLevelInfo(totalQuizzes);
    const nextLevel = getNextLevel(levelInfo);
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
      levelLabel.textContent = t(levelInfo.labelKey);
    }

    if (progressFill && progressText) {
      if (levelInfo.next && nextLevel) {
        const progress = Math.min(100, Math.round(((totalQuizzes - levelInfo.min) / (levelInfo.next - levelInfo.min)) * 100));
        progressFill.style.width = `${progress}%`;
        const remaining = Math.max(0, levelInfo.next - totalQuizzes);
        progressText.textContent = formatText(
          remaining === 1 ? 'profileProgressToNextSingular' : 'profileProgressToNextPlural',
          { remaining, level: t(nextLevel.labelKey) }
        );
      } else {
        progressFill.style.width = '100%';
        progressText.textContent = t('profileProgressMax');
      }
    }

    if (topSubject) {
      const bestScoreItem = getTopSubject(profileData.best_scores);
      topSubject.textContent = bestScoreItem
        ? formatText('profileTopSubjectValue', {
            subject: subjectLabel(bestScoreItem.subject),
            score: bestScoreItem.best_score
          })
        : t('profileTopSubjectEmpty');
    }

    if (profileData.is_admin) {
      document.getElementById('profileAdminLink').style.display = 'inline-flex';
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    window.authClient.renderUserActions('headerUserActions');

    profileData = await window.authClient.requireAuth();
    if (!profileData) return;
    window.authClient.renderUserActions('headerUserActions');
    renderProfileOverview({ animateStats: true });
    renderBestScores(profileData.best_scores);
    renderRecentBadges(profileData.score_history);
    renderHistory(profileData.score_history);
  });

  window.handleLanguageChange = function handleProfileLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
    if (!profileData) return;
    renderProfileOverview();
    renderBestScores(profileData.best_scores);
    renderRecentBadges(profileData.score_history);
    renderHistory(profileData.score_history);
  };
})();
