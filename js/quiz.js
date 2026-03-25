const badgeKeys = {
  mathematics: 'badgeMath',
  english: 'badgeEnglish',
  science: 'badgeScience',
  history: 'badgeHistory',
  geography: 'badgeGeo',
  cs: 'badgeCS'
};

let currentSubject = '';
let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let savedScoreId = null;
let isSavingScore = false;

function getSubjectFromURL() {
  return new URLSearchParams(window.location.search).get('subject');
}

function getCurrentQuestion() {
  return questions[currentIndex];
}

function setMessage(message, type = '') {
  const element = document.getElementById('quizMessage');
  if (!element) return;
  element.textContent = message || '';
  element.className = `page-message${type ? ` ${type}` : ''}`;
}

function setLoading(isLoading) {
  const loader = document.getElementById('quizLoading');
  if (!loader) return;
  loader.style.display = isLoading ? 'block' : 'none';
  loader.textContent = t('quizLoading');
}

function showAuthPrompt() {
  document.getElementById('authPrompt').style.display = 'block';
  document.getElementById('subjectSelect').style.display = 'none';
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
}

function hideAuthPrompt() {
  document.getElementById('authPrompt').style.display = 'none';
}

async function ensureAuthenticated() {
  const profile = await window.authClient.requireAuth({ redirect: false });
  if (!profile) {
    showAuthPrompt();
    return false;
  }

  window.authClient.renderUserActions('headerUserActions');
  hideAuthPrompt();
  return true;
}

function buildQuestionQuery(questionIds = []) {
  const params = new URLSearchParams();
  params.set('lang', currentLang);
  if (questionIds.length) {
    params.set('ids', questionIds.join(','));
    params.set('limit', String(questionIds.length));
  } else {
    params.set('limit', '10');
  }
  return params.toString();
}

async function fetchQuestions(subject, questionIds = []) {
  const response = await window.apiClient.get(`/questions/${subject}?${buildQuestionQuery(questionIds)}`);
  questions = response.questions;
}

function updateQuizProgress() {
  const total = questions.length;
  document.getElementById('questionCounter').textContent = `${t('questionOf')} ${currentIndex + 1} ${t('of')} ${total}`;
  document.getElementById('scoreCounter').textContent = `${t('scoreLabel')} ${score}`;
  document.getElementById('progressFill').style.width = `${((currentIndex + 1) / total) * 100}%`;
  document.getElementById('questionNum').textContent = `${t('questionOf')} ${String(currentIndex + 1).padStart(2, '0')}`;
}

function syncQuestionText() {
  if (!currentSubject || questions.length === 0) return;

  const question = getCurrentQuestion();
  updateQuizProgress();
  document.getElementById('questionText').textContent = question.question_text;
  document.querySelectorAll('#optionsGrid .option-text').forEach((optionText, index) => {
    optionText.textContent = question.options[index];
  });

  const isLast = currentIndex === questions.length - 1;
  document.getElementById('nextBtn').textContent = isLast ? t('seeResults') : t('nextBtn');
  document.getElementById('subjectBadge').textContent = t(badgeKeys[currentSubject]);
}

async function loadQuiz(subject, questionIds = []) {
  setLoading(true);
  setMessage('');

  try {
    await fetchQuestions(subject, questionIds);
    if (!questions.length) {
      throw new Error(t('quizNoQuestions'));
    }
  } catch (error) {
    setMessage(error.message, 'error');
    throw error;
  } finally {
    setLoading(false);
  }
}

async function startQuiz(subject) {
  if (!(await ensureAuthenticated())) return;

  currentSubject = subject;
  currentIndex = 0;
  score = 0;
  answered = false;
  savedScoreId = null;

  try {
    await loadQuiz(subject);
  } catch (_error) {
    document.getElementById('subjectSelect').style.display = 'block';
    return;
  }

  document.getElementById('subjectBadge').textContent = t(badgeKeys[subject]);
  document.getElementById('subjectSelect').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
  document.getElementById('quizArea').style.display = 'block';
  document.getElementById('resultSaveStatus').textContent = '';
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const question = getCurrentQuestion();
  updateQuizProgress();
  document.getElementById('questionText').textContent = question.question_text;
  document.getElementById('nextBtn').classList.remove('visible');

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  question.options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerHTML = `<div class="option-letter">${letters[index]}</div><div class="option-text">${option}</div>`;
    div.addEventListener('click', () => selectAnswer(index));
    grid.appendChild(div);
  });

  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'slideIn 0.3s ease';
}

function selectAnswer(selected) {
  if (answered) return;
  answered = true;

  const correct = getCurrentQuestion().correct_answer_index;
  const options = document.querySelectorAll('.option');
  options.forEach((option) => option.classList.add('answered'));

  if (selected === correct) {
    options[selected].classList.add('correct');
    score++;
  } else {
    options[selected].classList.add('wrong');
    options[correct].classList.add('correct');
  }

  document.getElementById('scoreCounter').textContent = `${t('scoreLabel')} ${score}`;
  document.getElementById('nextBtn').classList.add('visible');

  const isLast = currentIndex === questions.length - 1;
  document.getElementById('nextBtn').textContent = isLast ? t('seeResults') : t('nextBtn');
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

async function saveScore() {
  if (savedScoreId || isSavingScore || !currentSubject) return;

  const saveStatus = document.getElementById('resultSaveStatus');
  saveStatus.textContent = t('scoreSaving');
  saveStatus.className = 'result-save-status';
  isSavingScore = true;

  try {
    const saved = await window.apiClient.post('/scores', {
      subject: currentSubject,
      score,
      mode: 'practice'
    }, { auth: true });
    savedScoreId = saved.id;
    saveStatus.textContent = t('scoreSaved');
    saveStatus.classList.add('success');
  } catch (error) {
    saveStatus.textContent = error.status === 401 ? t('scoreSaveLogin') : `${t('scoreSaveFailed')} ${error.message}`;
    saveStatus.classList.add('error');
  } finally {
    isSavingScore = false;
  }
}

function showResults() {
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('resultScreen').classList.add('visible');

  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  document.getElementById('resultScore').textContent = `${score}/${total}`;
  document.getElementById('resultLabel').textContent = `${t('youGot')} ${pct}${t('correct')}`;
  document.getElementById('tryAgainBtn').textContent = t('tryAgain');
  document.getElementById('backHomeBtn').textContent = t('backHome');

  let grade;
  let gradeStyle;

  if (pct >= 90) {
    grade = t('gradeExcellent');
    gradeStyle = 'background:rgba(200,241,53,0.15);color:var(--accent);border:1px solid rgba(200,241,53,0.3)';
  } else if (pct >= 70) {
    grade = t('gradeGood');
    gradeStyle = 'background:rgba(100,200,100,0.1);color:#6dc86d;border:1px solid rgba(100,200,100,0.3)';
  } else if (pct >= 50) {
    grade = t('gradeAverage');
    gradeStyle = 'background:rgba(255,180,0,0.1);color:#ffb400;border:1px solid rgba(255,180,0,0.3)';
  } else {
    grade = t('gradeStudy');
    gradeStyle = 'background:rgba(255,79,79,0.1);color:var(--danger);border:1px solid rgba(255,79,79,0.3)';
  }

  const gradeEl = document.getElementById('resultGrade');
  gradeEl.textContent = grade;
  gradeEl.style.cssText = gradeStyle;
  saveScore();
}

function restartQuiz() {
  startQuiz(currentSubject);
}

window.handleLanguageChange = async function handleQuizLanguageChange() {
  window.authClient.renderUserActions('headerUserActions');

  if (currentSubject) {
    document.getElementById('subjectBadge').textContent = t(badgeKeys[currentSubject]);
  }

  if (questions.length === 0 || !currentSubject) return;

  try {
    await fetchQuestions(currentSubject, questions.map((question) => question.id));
    if (document.getElementById('resultScreen').classList.contains('visible')) {
      showResults();
      return;
    }

    if (document.getElementById('quizArea').style.display !== 'none') {
      syncQuestionText();
    }
  } catch (error) {
    setMessage(error.message, 'error');
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  window.authClient.renderUserActions('headerUserActions');
  const currentPage = `${window.location.pathname.split('/').pop() || 'quiz.html'}${window.location.search}`;
  document.getElementById('quizLoginLink').href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
  document.getElementById('quizRegisterLink').href = `register.html?redirect=${encodeURIComponent(currentPage)}`;

  const isAuthed = await ensureAuthenticated();
  if (isAuthed) {
    document.getElementById('subjectSelect').style.display = 'block';
  }

  const urlSubject = getSubjectFromURL();
  if (urlSubject && badgeKeys[urlSubject] && isAuthed) {
    startQuiz(urlSubject);
  }
});
