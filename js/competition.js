const TIME_PER_QUESTION = 10;

let questions = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timeoutCount = 0;
let timer = null;
let timeLeft = TIME_PER_QUESTION;
let answered = false;
let savedScoreId = null;
let isSavingScore = false;

function setCompetitionMessage(message, type = '') {
  const element = document.getElementById('competitionMessage');
  if (!element) return;
  element.textContent = message || '';
  element.className = `page-message${type ? ` ${type}` : ''}`;
}

function showCompetitionAuthPrompt() {
  document.getElementById('competitionAuthPrompt').style.display = 'block';
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
}

function hideCompetitionAuthPrompt() {
  document.getElementById('competitionAuthPrompt').style.display = 'none';
}

async function ensureCompetitionAuth() {
  const profile = await window.authClient.requireAuth({ redirect: false });
  if (!profile) {
    showCompetitionAuthPrompt();
    return false;
  }

  window.authClient.renderUserActions('headerUserActions');
  hideCompetitionAuthPrompt();
  document.getElementById('lobby').style.display = 'block';
  return true;
}

function getCurrentQuestion() {
  return questions[currentIndex];
}

function optionLetter(index) {
  // Support any option count from the backend.
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index >= 0 && index < alphabet.length) return alphabet[index];
  return String(index + 1);
}

function buildCompetitionQuery(questionIds = []) {
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

async function fetchCompetitionQuestions(questionIds = []) {
  const response = await window.apiClient.get(`/questions/all?${buildCompetitionQuery(questionIds)}`);
  questions = response.questions;
}

function syncQuestionText() {
  if (!questions.length) return;

  const question = getCurrentQuestion();
  document.getElementById('questionText').textContent = question.question_text;
  document.getElementById('liveScore').textContent = score.toLocaleString();
  document.querySelectorAll('#optionsGrid .option-text').forEach((optionText, index) => {
    optionText.textContent = question.options[index] ?? '';
  });
}

async function startCompetition() {
  if (!(await ensureCompetitionAuth())) return;

  currentIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  timeoutCount = 0;
  savedScoreId = null;
  // Prevent in-flight score save from blocking the next run.
  isSavingScore = false;
  setCompetitionMessage('');

  try {
    await fetchCompetitionQuestions();
  } catch (error) {
    setCompetitionMessage(error.message, 'error');
    return;
  }

  document.getElementById('lobby').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
  document.getElementById('quizArea').style.display = 'block';
  document.getElementById('resultSaveStatusComp').textContent = '';

  renderQuestion();
}

function renderQuestion() {
  answered = false;
  clearInterval(timer);
  timeLeft = TIME_PER_QUESTION;

  const question = getCurrentQuestion();
  document.getElementById('questionText').textContent = question.question_text;
  const total = questions.length || 1;
  document.getElementById('qCounter').textContent = `${currentIndex + 1}/${total}`;
  document.getElementById('liveScore').textContent = score.toLocaleString();

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  (question.options || []).forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'option';

    const letterEl = document.createElement('div');
    letterEl.className = 'option-letter';
    letterEl.textContent = optionLetter(index);

    const textEl = document.createElement('div');
    textEl.className = 'option-text';
    textEl.textContent = option;

    div.appendChild(letterEl);
    div.appendChild(textEl);
    div.addEventListener('click', () => selectAnswer(index));
    grid.appendChild(div);
  });

  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'slideIn 0.3s ease';

  startTimer();
}

function startTimer() {
  updateTimerUI();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerUI() {
  const pct = (timeLeft / TIME_PER_QUESTION) * 100;
  const fill = document.getElementById('timerFill');
  fill.style.width = `${pct}%`;
  fill.style.background = timeLeft > 6 ? 'var(--accent)' : timeLeft > 3 ? '#ffb400' : 'var(--danger)';

  const num = document.getElementById('timerNum');
  num.textContent = timeLeft;
  num.style.color = timeLeft > 6 ? 'var(--text)' : timeLeft > 3 ? '#ffb400' : 'var(--danger)';
}

function handleTimeout() {
  if (answered) return;
  answered = true;
  timeoutCount++;

  const options = document.querySelectorAll('.option');
  options.forEach((option) => option.classList.add('answered'));
  const correct = getCurrentQuestion().correct_answer_index;
  const correctEl = options[correct];
  if (correctEl) correctEl.classList.add('timeout');

  showFlash('⏱️');
  setTimeout(advanceQuestion, 1800);
}

function selectAnswer(selected) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = getCurrentQuestion().correct_answer_index;
  const options = document.querySelectorAll('.option');
  options.forEach((option) => option.classList.add('answered'));
  const selectedEl = options[selected];
  const correctEl = options[correct];

  if (selected === correct) {
    if (selectedEl) selectedEl.classList.add('correct');
    score += 1000;
    correctCount++;
    showFlash('✅');
  } else {
    if (selectedEl) selectedEl.classList.add('wrong');
    if (correctEl) correctEl.classList.add('correct');
    wrongCount++;
    showFlash('❌');
  }

  document.getElementById('liveScore').textContent = score.toLocaleString();
  setTimeout(advanceQuestion, 1500);
}

function showFlash(icon) {
  const flash = document.getElementById('flash');
  flash.textContent = icon;
  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 600);
}

function advanceQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

async function saveCompetitionScore() {
  if (savedScoreId || isSavingScore) return;

  const saveStatus = document.getElementById('resultSaveStatusComp');
  saveStatus.textContent = t('scoreSaving');
  saveStatus.className = 'result-save-status';
  isSavingScore = true;

  try {
    const saved = await window.apiClient.post('/scores', {
      subject: 'mixed',
      score,
      mode: 'competition'
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
  clearInterval(timer);
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('resultScreen').classList.add('visible');

  const total = questions.length || 1;
  document.getElementById('resultScore').textContent = `${correctCount}/${total}`;
  document.getElementById('resultPoints').textContent = score.toLocaleString();
  document.getElementById('pointsEarnedLabel').textContent = t('pointsEarned');
  document.getElementById('correctLabel').textContent = t('correctLabel');
  document.getElementById('wrongLabel').textContent = t('wrongLabel');
  document.getElementById('timedOutLabel').textContent = t('timedOut');
  document.getElementById('bdCorrect').textContent = correctCount;
  document.getElementById('bdWrong').textContent = wrongCount;
  document.getElementById('bdTime').textContent = timeoutCount;
  document.getElementById('playAgainBtn').textContent = t('playAgain');
  document.getElementById('backHomeBtnComp').textContent = t('backHome');

  const pct = (correctCount / total) * 100;
  let grade;
  let gradeStyle;

  if (pct >= 90) {
    grade = t('gradeUnstoppable');
    gradeStyle = 'background:rgba(200,241,53,0.15);color:var(--accent);border:1px solid rgba(200,241,53,0.3)';
  } else if (pct >= 70) {
    grade = t('gradeStrong');
    gradeStyle = 'background:rgba(200,100,255,0.15);color:var(--purple);border:1px solid rgba(200,100,255,0.3)';
  } else if (pct >= 50) {
    grade = t('gradeDecent');
    gradeStyle = 'background:rgba(255,180,0,0.1);color:#ffb400;border:1px solid rgba(255,180,0,0.3)';
  } else {
    grade = t('gradeTrain');
    gradeStyle = 'background:rgba(255,79,79,0.1);color:var(--danger);border:1px solid rgba(255,79,79,0.3)';
  }

  const gradeEl = document.getElementById('resultGrade');
  gradeEl.textContent = grade;
  gradeEl.style.cssText = gradeStyle;

  saveCompetitionScore();
}

window.handleLanguageChange = async function handleCompetitionLanguageChange() {
  window.authClient.renderUserActions('headerUserActions');

  if (questions.length === 0) {
    return;
  }

  try {
    await fetchCompetitionQuestions(questions.map((question) => question.id));
    if (document.getElementById('resultScreen').classList.contains('visible')) {
      showResults();
      return;
    }

    if (document.getElementById('quizArea').style.display !== 'none') {
      syncQuestionText();
    }
  } catch (error) {
    setCompetitionMessage(error.message, 'error');
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  window.authClient.renderUserActions('headerUserActions');
  const currentPage = `${window.location.pathname.split('/').pop() || 'competition.html'}${window.location.search}`;
  document.getElementById('competitionLoginLink').href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
  document.getElementById('competitionRegisterLink').href = `register.html?redirect=${encodeURIComponent(currentPage)}`;
  await ensureCompetitionAuth();
});
