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
  const SUBJECT_COLORS = {
    mathematics: '#7b7eff',
    english: '#2edbff',
    science: '#f3b12f',
    history: '#c864ff',
    geography: '#5ee39d',
    cs: '#ff7f6b',
    mixed: '#94a3d4'
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

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function modeLabel(mode) {
    if (mode === 'practice') return t('modePractice');
    if (mode === 'competition') return t('modeCompetition');
    return mode;
  }

  function modeIcon(mode) {
    if (mode === 'practice') return '📝';
    if (mode === 'competition') return '⚡';
    return '🎯';
  }

  function formatShortDate(value) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function normalizeScore(item) {
    if (item.mode === 'competition') {
      return Math.min(100, Math.round((item.score / 10000) * 100));
    }
    return Math.min(100, Math.round((item.score / 10) * 100));
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
    const maxValue = Math.max(100, ...points.map((point) => point.value));
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
    const axisLabels = points.map((point) => `<span class="chart-axis-label">${point.label}</span>`).join('');

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
          ${axisLabels}
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

  function renderBarChart(containerId, bars, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!bars || bars.length === 0) {
      container.innerHTML = `<div class="chart-empty"><div class="empty-state">${emptyMessage}</div></div>`;
      return;
    }

    const maxValue = Math.max(...bars.map((bar) => bar.value), 1);
    container.innerHTML = `
      <div class="bar-chart" style="--bar-columns:${bars.length}">
        ${bars
          .map((bar) => {
            const height = Math.max(10, Math.round((bar.value / maxValue) * 100));
            return `
              <article class="bar-column">
                <div class="bar-value">${bar.value}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="height:${height}%"></div>
                </div>
                <div class="bar-label">${bar.label}</div>
              </article>
            `;
          })
          .join('')}
      </div>
    `;
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

    if (!bestScores || bestScores.length === 0) {
      container.innerHTML = `<div class="empty-state">${t('profileNoScores')}</div>`;
      return;
    }

    container.innerHTML = bestScores
      .map((item) => `
        <div class="best-score-card">
          <div class="best-score-subject">${subjectLabel(item.subject)}</div>
          <div class="best-score-value">${item.best_score}</div>
        </div>
      `)
      .join('');
  }

  function renderHistory(history) {
    const list = document.getElementById('historyList');
    if (!list) return;

    if (!history || history.length === 0) {
      list.innerHTML = `<div class="empty-state">${t('profileNoScores')}</div>`;
      return;
    }

    list.innerHTML = history
      .map((item) => {
        const completed = item.completed_at ? new Date(item.completed_at) : null;
        const completedText = completed ? completed.toLocaleDateString() : '—';
        return `
          <div class="history-item">
            <div class="history-left">
              <div class="history-subject">${subjectLabel(item.subject)}</div>
              <div class="history-mode-pill mode-${item.mode}">
                <span class="history-mode-icon" aria-hidden="true">${modeIcon(item.mode)}</span>
                <span class="history-mode-text">${modeLabel(item.mode)}</span>
              </div>
            </div>
            <div class="history-score">
              <div class="history-score-value">${item.score}</div>
              <div class="history-score-label">${t('profileScoreHeader')}</div>
            </div>
            <div class="history-date">
              <div class="history-date-value">${completedText}</div>
              <div class="history-date-label">${t('profileDateHeader')}</div>
            </div>
          </div>
        `;
      })
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

  function buildAllBadges(history) {
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

    return badges.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
  }

  function buildRecentBadges(history) {
    return buildAllBadges(history).slice(0, 4);
  }

  function getFavoriteMode(history) {
    const totals = (history || []).reduce(
      (result, item) => {
        if (item.mode === 'practice') result.practice += 1;
        if (item.mode === 'competition') result.competition += 1;
        return result;
      },
      { practice: 0, competition: 0 }
    );

    if (!totals.practice && !totals.competition) return null;
    if (totals.practice >= totals.competition) {
      return { mode: 'practice', count: totals.practice };
    }
    return { mode: 'competition', count: totals.competition };
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

  function renderTrendChart(history) {
    const recentRuns = [...(history || [])].slice(0, 6).reverse();
    const points = recentRuns.map((item) => ({
      label: formatShortDate(item.completed_at),
      value: normalizeScore(item)
    }));
    const average = points.length
      ? Math.round(points.reduce((sum, point) => sum + point.value, 0) / points.length)
      : 0;

    renderLineChart('profileTrendChart', points, t('profileNoScores'));
    setText(
      'profileTrendSummary',
      points.length ? formatText('profileTrendSummary', { count: points.length, average }) : t('profileNoScores')
    );
    setText('profileTrendBadge', points.length ? formatText('profileTrendBadge', { value: average }) : '--');
  }

  function renderSubjectFocus(history) {
    const counts = (history || []).reduce((result, item) => {
      const subject = item.subject || 'mixed';
      result[subject] = (result[subject] || 0) + 1;
      return result;
    }, {});
    const entries = Object.entries(counts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([subject, value]) => ({
        color: SUBJECT_COLORS[subject] || SUBJECT_COLORS.mixed,
        label: subjectLabel(subject),
        value
      }));

    renderDonutChart('profileSubjectDonut', 'profileSubjectLegend', entries, t('profileRunsLabel'), t('profileNoScores'));
  }

  function renderActivityChart(history) {
    if (!history || history.length === 0) {
      renderBarChart('profileActivityChart', [], t('profileNoScores'));
      setText('profileActivitySummary', t('profileNoScores'));
      return;
    }

    const bars = Array.from({ length: 7 }, (_, offset) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - offset));
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const count = (history || []).filter((item) => {
        const completedAt = new Date(item.completed_at);
        return completedAt >= date && completedAt < nextDate;
      }).length;

      return {
        label: date.toLocaleDateString(undefined, { weekday: 'short' }),
        value: count
      };
    });

    const activeDays = bars.filter((bar) => bar.value > 0).length;
    renderBarChart('profileActivityChart', bars, t('profileNoScores'));
    setText('profileActivitySummary', formatText('profileActivitySummary', { count: activeDays }));
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
    const topSubjectPanel = document.getElementById('profileTopSubjectPanel');
    const allBadges = buildAllBadges(profileData.score_history);
    const bestScoreItem = getTopSubject(profileData.best_scores);
    const favoriteMode = getFavoriteMode(profileData.score_history);

    if (avatar) {
      const avatarImage = document.getElementById('profileAvatarImage');
      const avatarInitial = document.getElementById('profileAvatarInitial');
      const initial = (profileData.username || 'U').charAt(0).toUpperCase();

      const avatarUrl = profileData.avatar_url || profileData.avatarUrl || profileData.avatar || null;
      if (avatarImage && avatarInitial && avatarUrl) {
        avatarImage.src = avatarUrl;
        avatarImage.style.display = 'block';
        avatarInitial.style.display = 'none';
      } else if (avatarInitial) {
        avatarInitial.textContent = initial;
        avatarInitial.style.display = 'block';
        if (avatarImage) avatarImage.style.display = 'none';
      }

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
      topSubject.textContent = bestScoreItem
        ? formatText('profileTopSubjectValue', {
            subject: subjectLabel(bestScoreItem.subject),
            score: bestScoreItem.best_score
          })
        : t('profileTopSubjectEmpty');
    }

    if (topSubjectPanel) {
      topSubjectPanel.textContent = bestScoreItem
        ? formatText('profileTopSubjectValue', {
            subject: subjectLabel(bestScoreItem.subject),
            score: bestScoreItem.best_score
          })
        : t('profileTopSubjectEmpty');
    }

    setText('profileLevelSummary', t(levelInfo.labelKey));
    setText('profileBestScoreValue', bestScoreItem ? bestScoreItem.best_score : '—');
    setText('profileBestScoreNote', bestScoreItem ? subjectLabel(bestScoreItem.subject) : t('profileTopSubjectEmpty'));
    setText('profileBadgeCount', allBadges.length);
    setText('profileBadgeNote', allBadges.length ? t(allBadges[0].titleKey) : t('profileNoBadges'));
    setText('profileFavoriteModeValue', favoriteMode ? modeLabel(favoriteMode.mode) : '—');
    setText(
      'profileFavoriteModeNote',
      favoriteMode ? formatText('profileFavoriteModeRuns', { count: favoriteMode.count }) : t('profileNoScores')
    );

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
    renderTrendChart(profileData.score_history);
    renderSubjectFocus(profileData.score_history);
    renderActivityChart(profileData.score_history);
    renderRecentBadges(profileData.score_history);
    renderHistory(profileData.score_history);
  });

  window.handleLanguageChange = function handleProfileLanguageChange() {
    window.authClient.renderUserActions('headerUserActions');
    if (!profileData) return;
    renderProfileOverview();
    renderBestScores(profileData.best_scores);
    renderTrendChart(profileData.score_history);
    renderSubjectFocus(profileData.score_history);
    renderActivityChart(profileData.score_history);
    renderRecentBadges(profileData.score_history);
    renderHistory(profileData.score_history);
  };
})();
