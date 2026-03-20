const QUESTIONS = {
  mathematics: [
    { q: "What is 15 × 14?", options: ["200", "210", "195", "220"], answer: 1 },
    { q: "If x + 7 = 23, what is x?", options: ["16", "14", "30", "15"], answer: 0 },
    { q: "What is the square root of 144?", options: ["11", "13", "12", "14"], answer: 2 },
    { q: "What is 25% of 200?", options: ["40", "60", "55", "50"], answer: 3 },
    { q: "What is 2³ + 3²?", options: ["17", "13", "19", "18"], answer: 0 },
    { q: "Solve: 5x - 10 = 20", options: ["x = 5", "x = 4", "x = 6", "x = 8"], answer: 2 },
    { q: "What is the area of a circle with radius 7? (π ≈ 3.14)", options: ["43.96", "153.86", "87.92", "21.98"], answer: 1 },
    { q: "What is 120 ÷ 8?", options: ["16", "12", "15", "14"], answer: 2 },
    { q: "What is the value of 7! (7 factorial)?", options: ["5040", "720", "2520", "40320"], answer: 0 },
    { q: "If a triangle has angles 60° and 80°, what is the third angle?", options: ["30°", "50°", "40°", "60°"], answer: 2 }
  ]
};

let currentSubject = '';
let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSubjectFromURL() {
  return new URLSearchParams(window.location.search).get('subject');
}

function startQuiz(subject) {
  currentSubject = subject;
  questions = shuffle([...QUESTIONS[subject]]);
  currentIndex = 0;
  score = 0;
  answered = false;

  const names = {
    mathematics: 'Mathematics'
  };
  document.getElementById('subjectBadge').textContent = names[subject] || subject;
  document.getElementById('subjectSelect').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
  document.getElementById('quizArea').style.display = 'block';

  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = questions[currentIndex];
  const total = questions.length;

  document.getElementById('questionCounter').textContent = `Question ${currentIndex + 1} of ${total}`;
  document.getElementById('scoreCounter').textContent = `Score: ${score}`;
  document.getElementById('progressFill').style.width = `${((currentIndex + 1) / total) * 100}%`;
  document.getElementById('questionNum').textContent = `Question ${String(currentIndex + 1).padStart(2, '0')}`;
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('nextBtn').classList.remove('visible');

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerHTML = `<div class="option-letter">${letters[i]}</div><div class="option-text">${opt}</div>`;
    div.addEventListener('click', () => selectAnswer(i, q.answer));
    grid.appendChild(div);
  });

  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'slideIn 0.3s ease';
}

function selectAnswer(selected, correct) {
  if (answered) return;
  answered = true;

  const options = document.querySelectorAll('.option');
  options.forEach(o => o.classList.add('answered'));

  if (selected === correct) {
    options[selected].classList.add('correct');
    score++;
  } else {
    options[selected].classList.add('wrong');
    options[correct].classList.add('correct');
  }

  document.getElementById('scoreCounter').textContent = `Score: ${score}`;
  document.getElementById('nextBtn').classList.add('visible');

  const isLast = currentIndex === questions.length - 1;
  document.getElementById('nextBtn').textContent = isLast ? 'See Results →' : 'Next Question →';
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  document.getElementById('quizArea').style.display = 'none';
  const screen = document.getElementById('resultScreen');
  screen.classList.add('visible');

  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  document.getElementById('resultScore').textContent = `${score}/${total}`;
  document.getElementById('resultLabel').textContent = `You got ${pct}% correct`;

  let grade, gradeStyle;
  if (pct >= 90)      { grade = '🔥 Excellent';   gradeStyle = 'background:rgba(200,241,53,0.15);color:var(--accent);border:1px solid rgba(200,241,53,0.3)'; }
  else if (pct >= 70) { grade = '✅ Good';         gradeStyle = 'background:rgba(100,200,100,0.1);color:#6dc86d;border:1px solid rgba(100,200,100,0.3)'; }
  else if (pct >= 50) { grade = '⚠️ Average';      gradeStyle = 'background:rgba(255,180,0,0.1);color:#ffb400;border:1px solid rgba(255,180,0,0.3)'; }
  else                { grade = '💀 Study more';   gradeStyle = 'background:rgba(255,79,79,0.1);color:var(--danger);border:1px solid rgba(255,79,79,0.3)'; }

  const gradeEl = document.getElementById('resultGrade');
  gradeEl.textContent = grade;
  gradeEl.style.cssText = gradeStyle;
}

function restartQuiz() {
  startQuiz(currentSubject);
}

// Init
const urlSubject = getSubjectFromURL();
if (urlSubject && QUESTIONS[urlSubject]) {
  startQuiz(urlSubject);
}
