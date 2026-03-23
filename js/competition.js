// competition.js — depends on lang.js being loaded first

const ALL_QUESTIONS = {
  en: [
    { q: "What is 15 × 14?", options: ["200", "210", "195", "220"], answer: 1 },
    { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
    { q: "What is the capital of Poland?", options: ["Krakow", "Wrocław", "Gdańsk", "Warsaw"], answer: 3 },
    { q: "What does CPU stand for?", options: ["Core Processing Unit", "Computer Power Unit", "Central Processing Unit", "Core Program Unit"], answer: 2 },
    { q: "In what year did World War II end?", options: ["1943", "1944", "1946", "1945"], answer: 3 },
    { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], answer: 2 },
    { q: "Which data structure uses LIFO?", options: ["Queue", "Array", "Stack", "Linked List"], answer: 2 },
    { q: "What is the square root of 144?", options: ["11", "13", "12", "14"], answer: 2 },
    { q: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1 },
    { q: "The French Revolution began in:", options: ["1776", "1804", "1789", "1799"], answer: 2 },
    { q: "What is the binary representation of decimal 10?", options: ["1010", "1100", "1001", "1110"], answer: 0 },
    { q: "What is the speed of light (approximately)?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], answer: 0 },
    { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(1)", "O(log n)"], answer: 3 },
    { q: "Which word is a synonym for 'eloquent'?", options: ["Silent", "Articulate", "Confused", "Harsh"], answer: 1 },
    { q: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mars", "Mercury"], answer: 3 },
    { q: "What is 25% of 200?", options: ["40", "60", "55", "50"], answer: 3 },
    { q: "Who was the first human to travel to space?", options: ["Neil Armstrong", "Buzz Aldrin", "Alan Shepard", "Yuri Gagarin"], answer: 3 },
    { q: "What does 'git commit' do?", options: ["Uploads to GitHub", "Saves a snapshot of changes", "Deletes a branch", "Merges branches"], answer: 1 },
    { q: "What is the pH of pure water?", options: ["0", "7", "14", "5"], answer: 1 },
    { q: "Which country has the most natural lakes?", options: ["Russia", "Finland", "USA", "Canada"], answer: 3 }
  ],
  uz: [
    { q: "15 × 14 nechaga teng?", options: ["200", "210", "195", "220"], answer: 1 },
    { q: "Oltinning kimyoviy belgisi qaysi?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
    { q: "Polshaning poytaxti qaysi shahar?", options: ["Krakov", "Vrotslav", "Gdansk", "Varshava"], answer: 3 },
    { q: "CPU nima degan qisqartma?", options: ["Asosiy Ishlov Berish Bloki", "Kompyuter Quvvat Bloki", "Markaziy Ishlov Berish Qurilmasi", "Asosiy Dastur Bloki"], answer: 2 },
    { q: "Ikkinchi Jahon urushi qaysi yilda tugadi?", options: ["1943", "1944", "1946", "1945"], answer: 3 },
    { q: "Hujayraning 'elektrostansiyasi' qaysi organoid?", options: ["Yadro", "Ribosoma", "Mitoxondriya", "Vakuol"], answer: 2 },
    { q: "LIFO qaysi ma'lumot tuzilmasida ishlatiladi?", options: ["Navbat", "Massiv", "Stek", "Bog'liq ro'yxat"], answer: 2 },
    { q: "144 ning kvadrat ildizi necha?", options: ["11", "13", "12", "14"], answer: 2 },
    { q: "Dunyodagi eng uzun daryo qaysi?", options: ["Amazonka", "Nil", "Yantszi", "Missisipi"], answer: 1 },
    { q: "Fransuz inqilobi qaysi yilda boshlandi?", options: ["1776", "1804", "1789", "1799"], answer: 2 },
    { q: "10 sonining ikkilik tizimidagi ifodasi qaysi?", options: ["1010", "1100", "1001", "1110"], answer: 0 },
    { q: "Yorug'lik tezligi taxminan qancha?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], answer: 0 },
    { q: "Ikkilik qidiruvning vaqt murakkabligi qancha?", options: ["O(n)", "O(n²)", "O(1)", "O(log n)"], answer: 3 },
    { q: "'Eloquent' so'zining sinonimi qaysi?", options: ["Silent", "Articulate", "Confused", "Harsh"], answer: 1 },
    { q: "Quyoshga eng yaqin sayyora qaysi?", options: ["Venera", "Yer", "Mars", "Merkuriy"], answer: 3 },
    { q: "200 ning 25% i necha?", options: ["40", "60", "55", "50"], answer: 3 },
    { q: "Kosmosga chiqqan birinchi inson kim?", options: ["Nil Armstrong", "Buzz Aldrin", "Alan Shepard", "Yuriy Gagarin"], answer: 3 },
    { q: "'git commit' buyrug'i nima qiladi?", options: ["GitHubga yuklaydi", "O'zgarishlar snapshotini saqlaydi", "Branchni o'chiradi", "Branchlarni birlashtiradi"], answer: 1 },
    { q: "Toza suvning pH darajasi qancha?", options: ["0", "7", "14", "5"], answer: 1 },
    { q: "Eng ko'p tabiiy ko'llarga ega mamlakat qaysi?", options: ["Rossiya", "Finlandiya", "AQSh", "Kanada"], answer: 3 }
  ]
};

const TIME_PER_QUESTION = 10;
let questionOrder = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timeoutCount = 0;
let timer = null;
let timeLeft = TIME_PER_QUESTION;
let answered = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuestionIds() {
  return ALL_QUESTIONS.en.map((_, index) => index);
}

function getCurrentQuestion() {
  return ALL_QUESTIONS[currentLang][questionOrder[currentIndex]];
}

function syncQuestionText() {
  if (questionOrder.length === 0) return;

  const q = getCurrentQuestion();
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('liveScore').textContent = score.toLocaleString();
  document.querySelectorAll('#optionsGrid .option-text').forEach((optionText, index) => {
    optionText.textContent = q.options[index];
  });
}

function startCompetition() {
  questionOrder = shuffle(getQuestionIds()).slice(0, 10);
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  timeoutCount = 0;

  document.getElementById('lobby').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
  document.getElementById('quizArea').style.display = 'block';

  renderQuestion();
}

function renderQuestion() {
  answered = false;
  clearInterval(timer);
  timeLeft = TIME_PER_QUESTION;

  const q = getCurrentQuestion();
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('qCounter').textContent = `${currentIndex + 1}/10`;
  document.getElementById('liveScore').textContent = score.toLocaleString();

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerHTML = `<div class="option-letter">${letters[i]}</div><div class="option-text">${opt}</div>`;
    div.addEventListener('click', () => selectAnswer(i));
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
  fill.style.width = pct + '%';
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
  options.forEach(o => o.classList.add('answered'));
  options[getCurrentQuestion().answer].classList.add('timeout');

  showFlash('⏱️');
  setTimeout(advanceQuestion, 1800);
}

function selectAnswer(selected) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = getCurrentQuestion().answer;
  const options = document.querySelectorAll('.option');
  options.forEach(o => o.classList.add('answered'));

  if (selected === correct) {
    options[selected].classList.add('correct');
    score += 1000;
    correctCount++;
    showFlash('✅');
  } else {
    options[selected].classList.add('wrong');
    options[correct].classList.add('correct');
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
  if (currentIndex >= questionOrder.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  clearInterval(timer);
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('resultScreen').classList.add('visible');

  document.getElementById('resultScore').textContent = `${correctCount}/10`;
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

  const pct = (correctCount / 10) * 100;
  let grade, gradeStyle;
  if (pct >= 90)      { grade = t('gradeUnstoppable'); gradeStyle = 'background:rgba(200,241,53,0.15);color:var(--accent);border:1px solid rgba(200,241,53,0.3)'; }
  else if (pct >= 70) { grade = t('gradeStrong');       gradeStyle = 'background:rgba(200,100,255,0.15);color:var(--purple);border:1px solid rgba(200,100,255,0.3)'; }
  else if (pct >= 50) { grade = t('gradeDecent');       gradeStyle = 'background:rgba(255,180,0,0.1);color:#ffb400;border:1px solid rgba(255,180,0,0.3)'; }
  else                { grade = t('gradeTrain');        gradeStyle = 'background:rgba(255,79,79,0.1);color:var(--danger);border:1px solid rgba(255,79,79,0.3)'; }

  const gradeEl = document.getElementById('resultGrade');
  gradeEl.textContent = grade;
  gradeEl.style.cssText = gradeStyle;
}

window.handleLanguageChange = function handleCompetitionLanguageChange() {
  if (document.getElementById('resultScreen').classList.contains('visible')) {
    showResults();
    return;
  }

  if (document.getElementById('quizArea').style.display !== 'none' && questionOrder.length > 0) {
    syncQuestionText();
  }
};
