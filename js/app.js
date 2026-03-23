window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 400);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
  const isOpen = menuBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.classList.toggle('no-scroll', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

menuBtn.addEventListener('click', toggleMobileMenu);

menuBtn.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    toggleMobileMenu();
  }
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

// Fade in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 75);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = t('contactSent');
  btn.style.background = '#2a4a00';
  btn.style.color = 'var(--accent)';
  setTimeout(() => {
    btn.textContent = t('contactSend');
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
});

// Sample question preview
function resetPreviewState() {
  document.querySelectorAll('.preview-option').forEach(option => {
    option.classList.remove('done', 'correct', 'wrong');
  });

  const feedback = document.getElementById('previewFeedback');
  feedback.textContent = '';
  feedback.className = 'preview-feedback';
}

function handlePreview(el) {
  const options = document.querySelectorAll('.preview-option');
  if (el.classList.contains('done')) return;

  options.forEach(o => o.classList.add('done'));

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

window.handleLanguageChange = function handleHomeLanguageChange() {
  resetPreviewState();
};
