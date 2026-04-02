window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

if (
  typeof window.matchMedia === 'function' &&
  (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches)
) {
  document.documentElement.classList.add('is-touch');
}

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
});

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
  if (!menuBtn || !mobileMenu) return;
  const isOpen = menuBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.classList.toggle('no-scroll', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', toggleMobileMenu);
  menuBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      toggleMobileMenu();
    }
  });

  mobileMenu.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), index * 75);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach((element) => observer.observe(element));

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.target.querySelector('.form-submit');
    button.textContent = t('contactSent');
    button.style.background = '#2a4a00';
    button.style.color = 'var(--accent)';
    setTimeout(() => {
      button.textContent = t('contactSend');
      button.style.background = '';
      button.style.color = '';
      event.target.reset();
    }, 3000);
  });
}

function resetPreviewState() {
  document.querySelectorAll('.preview-option').forEach((option) => {
    option.classList.remove('done', 'correct', 'wrong');
  });

  const feedback = document.getElementById('previewFeedback');
  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'preview-feedback';
  }
}

function handlePreview(el) {
  const options = document.querySelectorAll('.preview-option');
  if (el.classList.contains('done')) return;

  options.forEach((option) => option.classList.add('done'));

  const isCorrect = el.getAttribute('data-correct') === 'true';
  const feedback = document.getElementById('previewFeedback');
  const correctEl = document.querySelector('.preview-option[data-correct="true"]');

  if (isCorrect) {
    el.classList.add('correct');
    feedback.textContent = t('previewCorrectFeedback');
    feedback.className = 'preview-feedback correct';
  } else {
    el.classList.add('wrong');
    correctEl.classList.add('correct');
    feedback.textContent = t('previewWrongFeedback');
    feedback.className = 'preview-feedback wrong';
  }
}

function renderLeaderboard(entries) {
  const container = document.getElementById('leaderboardRows');
  if (!container) return;

  if (!entries.length) {
    container.innerHTML = `<div class="leader-empty">${t('liveEmpty')}</div>`;
    return;
  }

  container.innerHTML = entries
    .map((entry, index) => {
      const topClass = index === 0 ? ' top' : '';
      return `
        <div class="leader-row${topClass}">
          <div class="leader-rank${topClass}">${entry.rank}</div>
          <div class="leader-user">
            <div class="leader-name">${entry.username}</div>
            <div class="leader-meta"><span>${entry.completed_runs}</span> <span>${t('liveRuns')}</span></div>
          </div>
          <div class="leader-score">
            <div class="leader-score-value">${entry.total_score.toLocaleString()}</div>
            <div class="leader-score-label">${t('livePoints')}</div>
          </div>
        </div>
      `;
    })
    .join('');
}

function setElementText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

async function loadLiveData() {
  try {
    const stats = await window.apiClient.get('/stats');
    const totalCount = stats.total_quizzes_taken.toLocaleString();
    const averageCount = `${stats.average_score.toFixed(1)}%`;
    const activeCount = stats.active_users_today.toLocaleString();

    setElementText('liveTotalCount', totalCount);
    setElementText('liveAverageCount', averageCount);
    setElementText('liveActiveCount', activeCount);
    setElementText('heroTotalPulse', totalCount);
    setElementText('heroAveragePulse', averageCount);
    setElementText('heroActivePulse', activeCount);
  } catch (_error) {
    setElementText('liveTotalCount', '—');
    setElementText('liveAverageCount', '—');
    setElementText('liveActiveCount', '—');
    setElementText('heroTotalPulse', '—');
    setElementText('heroAveragePulse', '—');
    setElementText('heroActivePulse', '—');
  }

  try {
    const leaderboard = await window.apiClient.get('/leaderboard?mode=competition&limit=5');
    renderLeaderboard(leaderboard.entries);
  } catch (_error) {
    renderLeaderboard([]);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.authClient.isAuthenticated()) {
    await window.authClient.fetchCurrentUser();
  }
  window.authClient.renderUserActions('navUserActions');
  loadLiveData();
});

window.handleLanguageChange = function handleHomeLanguageChange() {
  resetPreviewState();
  window.authClient.renderUserActions('navUserActions');
  loadLiveData();
};

window.handlePreview = handlePreview;
