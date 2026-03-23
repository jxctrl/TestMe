// quiz.js — depends on lang.js being loaded first

const QUESTIONS = {
  en: {
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
    ],
    english: [
      { q: "Which word is a synonym for 'eloquent'?", options: ["Silent", "Articulate", "Confused", "Harsh"], answer: 1 },
      { q: "Choose the correct sentence:", options: ["She don't know", "She doesn't know", "She not knows", "She no know"], answer: 1 },
      { q: "What is the plural of 'criterion'?", options: ["Criterions", "Criterias", "Criteria", "Criterium"], answer: 2 },
      { q: "Which is the correct past tense of 'arise'?", options: ["Arised", "Arosen", "Arose", "Arisen"], answer: 2 },
      { q: "What does 'ubiquitous' mean?", options: ["Rare", "Extremely common", "Unknown", "Temporary"], answer: 1 },
      { q: "Identify the adjective: 'The quick brown fox'", options: ["fox", "quick", "the", "jumps"], answer: 1 },
      { q: "Which sentence uses the subjunctive mood correctly?", options: ["If I was you...", "If I were you...", "If I am you...", "If I be you..."], answer: 1 },
      { q: "What is the antonym of 'benevolent'?", options: ["Kind", "Generous", "Malevolent", "Peaceful"], answer: 2 },
      { q: "Choose the correct word: 'The data ___ clear.'", options: ["is", "are", "both are correct", "were"], answer: 2 },
      { q: "What is a 'clause'?", options: ["A type of comma", "A group of words with subject and verb", "A paragraph break", "A type of noun"], answer: 1 }
    ],
    science: [
      { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
      { q: "How many bones are in the adult human body?", options: ["208", "212", "195", "206"], answer: 3 },
      { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], answer: 2 },
      { q: "What is the speed of light (approximately)?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], answer: 0 },
      { q: "What is the atomic number of carbon?", options: ["8", "12", "4", "6"], answer: 3 },
      { q: "What process do plants use to make food?", options: ["Respiration", "Digestion", "Photosynthesis", "Osmosis"], answer: 2 },
      { q: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mars", "Mercury"], answer: 3 },
      { q: "What is Newton's second law of motion?", options: ["F = ma", "E = mc²", "v = u + at", "p = mv"], answer: 0 },
      { q: "What is the pH of pure water?", options: ["0", "7", "14", "5"], answer: 1 },
      { q: "DNA stands for:", options: ["Deoxyribonucleic Acid", "Dextrose Nucleic Acid", "Double Nucleic Acid", "Deoxyribose Nuclear Acid"], answer: 0 }
    ],
    history: [
      { q: "In what year did World War II end?", options: ["1943", "1944", "1946", "1945"], answer: 3 },
      { q: "Who was the first President of the United States?", options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"], answer: 2 },
      { q: "The French Revolution began in:", options: ["1776", "1804", "1789", "1799"], answer: 2 },
      { q: "Which empire built the Colosseum?", options: ["Greek", "Ottoman", "Byzantine", "Roman"], answer: 3 },
      { q: "Who wrote the Communist Manifesto?", options: ["Lenin and Stalin", "Marx and Engels", "Trotsky and Lenin", "Engels and Bakunin"], answer: 1 },
      { q: "The Berlin Wall fell in:", options: ["1987", "1991", "1985", "1989"], answer: 3 },
      { q: "Who was the first human to travel to space?", options: ["Neil Armstrong", "Buzz Aldrin", "Alan Shepard", "Yuri Gagarin"], answer: 3 },
      { q: "The Renaissance began in which country?", options: ["France", "Germany", "Spain", "Italy"], answer: 3 },
      { q: "Which country was NOT part of the Allied Powers in WWII?", options: ["USA", "Italy", "USSR", "UK"], answer: 1 },
      { q: "The Industrial Revolution first began in:", options: ["France", "Germany", "USA", "England"], answer: 3 }
    ],
    geography: [
      { q: "What is the capital of Poland?", options: ["Krakow", "Wrocław", "Gdańsk", "Warsaw"], answer: 3 },
      { q: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1 },
      { q: "Which country has the most natural lakes?", options: ["Russia", "Finland", "USA", "Canada"], answer: 3 },
      { q: "What is the smallest country in the world?", options: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"], answer: 2 },
      { q: "Mount Everest is located in:", options: ["India and Tibet", "Nepal and Tibet", "Nepal and India", "Bhutan and Nepal"], answer: 1 },
      { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
      { q: "Which continent has the most countries?", options: ["Asia", "Europe", "South America", "Africa"], answer: 3 },
      { q: "The Sahara Desert is located in:", options: ["Asia", "Australia", "South America", "Africa"], answer: 3 },
      { q: "What is the capital of Japan?", options: ["Osaka", "Kyoto", "Hiroshima", "Tokyo"], answer: 3 },
      { q: "Through how many countries does the Amazon River flow?", options: ["5", "4", "2", "9"], answer: 3 }
    ],
    cs: [
      { q: "What does CPU stand for?", options: ["Core Processing Unit", "Computer Power Unit", "Central Processing Unit", "Core Program Unit"], answer: 2 },
      { q: "What is the binary representation of decimal 10?", options: ["1010", "1100", "1001", "1110"], answer: 0 },
      { q: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyper Text Machine Language"], answer: 1 },
      { q: "Which data structure uses LIFO (Last In First Out)?", options: ["Queue", "Array", "Stack", "Linked List"], answer: 2 },
      { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(1)", "O(log n)"], answer: 3 },
      { q: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Read And Modify"], answer: 0 },
      { q: "Which language is primarily used for iOS app development?", options: ["Java", "Kotlin", "Swift", "Python"], answer: 2 },
      { q: "What does 'git commit' do?", options: ["Uploads to GitHub", "Saves a snapshot of changes", "Deletes a branch", "Merges branches"], answer: 1 },
      { q: "What is an API?", options: ["A type of database", "An Application Programming Interface", "A programming language", "A web server"], answer: 1 },
      { q: "What does CSS stand for?", options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], answer: 2 }
    ]
  },

  uz: {
    mathematics: [
      { q: "15 × 14 nechaga teng?", options: ["200", "210", "195", "220"], answer: 1 },
      { q: "Agar x + 7 = 23 bo'lsa, x nechaga teng?", options: ["16", "14", "30", "15"], answer: 0 },
      { q: "144 ning kvadrat ildizi necha?", options: ["11", "13", "12", "14"], answer: 2 },
      { q: "200 ning 25% i necha?", options: ["40", "60", "55", "50"], answer: 3 },
      { q: "2³ + 3² nechaga teng?", options: ["17", "13", "19", "18"], answer: 0 },
      { q: "5x - 10 = 20 tenglamani yeching", options: ["x = 5", "x = 4", "x = 6", "x = 8"], answer: 2 },
      { q: "Radiusi 7 bo'lgan doiraning yuzi? (π ≈ 3.14)", options: ["43.96", "153.86", "87.92", "21.98"], answer: 1 },
      { q: "120 ÷ 8 nechaga teng?", options: ["16", "12", "15", "14"], answer: 2 },
      { q: "7! (7 faktorial) qancha?", options: ["5040", "720", "2520", "40320"], answer: 0 },
      { q: "Uchburchak burchaklari 60° va 80° bo'lsa, uchinchi burchak necha?", options: ["30°", "50°", "40°", "60°"], answer: 2 }
    ],
    english: [
      { q: "'Eloquent' so'zining sinonimi qaysi?", options: ["Silent", "Articulate", "Confused", "Harsh"], answer: 1 },
      { q: "To'g'ri gapni tanlang:", options: ["She don't know", "She doesn't know", "She not knows", "She no know"], answer: 1 },
      { q: "'Criterion' so'zining ko'pligi qaysi?", options: ["Criterions", "Criterias", "Criteria", "Criterium"], answer: 2 },
      { q: "'Arise' fe'lining to'g'ri o'tgan zamoni qaysi?", options: ["Arised", "Arosen", "Arose", "Arisen"], answer: 2 },
      { q: "'Ubiquitous' so'zi nimani anglatadi?", options: ["Kam uchraydigan", "Juda keng tarqalgan", "Noma'lum", "Vaqtinchalik"], answer: 1 },
      { q: "'The quick brown fox' jumlasidagi sifat qaysi?", options: ["fox", "quick", "the", "jumps"], answer: 1 },
      { q: "Subjunktiv kayfiyat to'g'ri ishlatilgan gap qaysi?", options: ["If I was you...", "If I were you...", "If I am you...", "If I be you..."], answer: 1 },
      { q: "'Benevolent' so'zining antonimi qaysi?", options: ["Kind", "Generous", "Malevolent", "Peaceful"], answer: 2 },
      { q: "To'g'ri so'zni tanlang: 'The data ___ clear.'", options: ["is", "are", "ikkisi ham to'g'ri", "were"], answer: 2 },
      { q: "'Clause' nima?", options: ["Vergul turi", "Ega va kesimdan iborat so'z guruhi", "Paragraf bo'limi", "Ot turi"], answer: 1 }
    ],
    science: [
      { q: "Oltinning kimyoviy belgisi qaysi?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
      { q: "Katta yoshli inson tanasida nechta suyak bor?", options: ["208", "212", "195", "206"], answer: 3 },
      { q: "Hujayraning 'elektrostansiyasi' qaysi organoid?", options: ["Yadro", "Ribosoma", "Mitoxondriya", "Vakuol"], answer: 2 },
      { q: "Yorug'lik tezligi taxminan qancha?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], answer: 0 },
      { q: "Uglerodning atom raqami qancha?", options: ["8", "12", "4", "6"], answer: 3 },
      { q: "O'simliklar oziq-ovqat ishlab chiqarish uchun qaysi jarayondan foydalanadi?", options: ["Nafas olish", "Hazm qilish", "Fotosintez", "Osmoz"], answer: 2 },
      { q: "Quyoshga eng yaqin sayyora qaysi?", options: ["Venera", "Yer", "Mars", "Merkuriy"], answer: 3 },
      { q: "Nyutonning ikkinchi qonuni qaysi?", options: ["F = ma", "E = mc²", "v = u + at", "p = mv"], answer: 0 },
      { q: "Toza suvning pH darajasi qancha?", options: ["0", "7", "14", "5"], answer: 1 },
      { q: "DNK nima degan ma'noni anglatadi?", options: ["Dezoksiribonuklein kislota", "Dekstrozali nuklein kislota", "Ikki zanjirli nuklein kislota", "Dezoksiriboza yadro kislotasi"], answer: 0 }
    ],
    history: [
      { q: "Ikkinchi Jahon urushi qaysi yilda tugadi?", options: ["1943", "1944", "1946", "1945"], answer: 3 },
      { q: "AQShning birinchi prezidenti kim edi?", options: ["John Adams", "Thomas Jefferson", "Jorj Vashington", "Benjamin Franklin"], answer: 2 },
      { q: "Fransuz inqilobi qaysi yilda boshlandi?", options: ["1776", "1804", "1789", "1799"], answer: 2 },
      { q: "Kolizeyni qaysi imperiya qurdirgan?", options: ["Yunon", "Usmonli", "Vizantiya", "Rim"], answer: 3 },
      { q: "Kommunistik Manifestni kim yozgan?", options: ["Lenin va Stalin", "Marks va Engels", "Trotskiy va Lenin", "Engels va Bakunin"], answer: 1 },
      { q: "Berlin devori qaysi yilda qulab tushdi?", options: ["1987", "1991", "1985", "1989"], answer: 3 },
      { q: "Kosmosga chiqqan birinchi inson kim?", options: ["Nil Armstrong", "Buzz Aldrin", "Alan Shepard", "Yuriy Gagarin"], answer: 3 },
      { q: "Uyg'onish davri qaysi mamlakatda boshlangan?", options: ["Fransiya", "Germaniya", "Ispaniya", "Italiya"], answer: 3 },
      { q: "Ikkinchi Jahon urushida Ittifoqchilar tomonida bo'lmagan mamlakat qaysi?", options: ["AQSh", "Italiya", "SSSR", "Britaniya"], answer: 1 },
      { q: "Sanoat inqilobi birinchi qayerda boshlandi?", options: ["Fransiya", "Germaniya", "AQSh", "Angliya"], answer: 3 }
    ],
    geography: [
      { q: "Polshaning poytaxti qaysi shahar?", options: ["Krakov", "Vrotslav", "Gdansk", "Varshava"], answer: 3 },
      { q: "Dunyodagi eng uzun daryo qaysi?", options: ["Amazonka", "Nil", "Yantszi", "Missisipi"], answer: 1 },
      { q: "Eng ko'p tabiiy ko'llarga ega mamlakat qaysi?", options: ["Rossiya", "Finlandiya", "AQSh", "Kanada"], answer: 3 },
      { q: "Dunyodagi eng kichik davlat qaysi?", options: ["Monako", "Lixtenshtein", "Vatikan", "San-Marino"], answer: 2 },
      { q: "Everest tog'i qayerda joylashgan?", options: ["Hindiston va Tibet", "Nepal va Tibet", "Nepal va Hindiston", "Butan va Nepal"], answer: 1 },
      { q: "Yer yuzidagi eng katta okean qaysi?", options: ["Atlantika", "Hind", "Arktika", "Tinch"], answer: 3 },
      { q: "Eng ko'p davlatga ega qit'a qaysi?", options: ["Osiyo", "Yevropa", "Janubiy Amerika", "Afrika"], answer: 3 },
      { q: "Saxara cho'li qayerda joylashgan?", options: ["Osiyo", "Avstraliya", "Janubiy Amerika", "Afrika"], answer: 3 },
      { q: "Yaponiyaning poytaxti qaysi?", options: ["Osaka", "Kioto", "Xiroshima", "Tokio"], answer: 3 },
      { q: "Amazonka daryosi nechta mamlakatdan oqib o'tadi?", options: ["5", "4", "2", "9"], answer: 3 }
    ],
    cs: [
      { q: "CPU nima degan qisqartma?", options: ["Asosiy Ishlov Berish Bloki", "Kompyuter Quvvat Bloki", "Markaziy Ishlov Berish Qurilmasi", "Asosiy Dastur Bloki"], answer: 2 },
      { q: "10 sonining ikkilik tizimidagi ifodasi qaysi?", options: ["1010", "1100", "1001", "1110"], answer: 0 },
      { q: "HTML nima degan qisqartma?", options: ["Giperhavolalar va Matn Belgilash Tili", "Gipermatn Belgilash Tili", "Uy Qurilmasi Belgilash Tili", "Gipermatn Mashina Tili"], answer: 1 },
      { q: "LIFO qaysi ma'lumot tuzilmasida ishlatiladi?", options: ["Navbat", "Massiv", "Stek", "Bog'liq ro'yxat"], answer: 2 },
      { q: "Ikkilik qidiruvning vaqt murakkabligi qancha?", options: ["O(n)", "O(n²)", "O(1)", "O(log n)"], answer: 3 },
      { q: "RAM nima degan qisqartma?", options: ["Tasodifiy Kirish Xotirasi", "Faqat O'qish Xotirasi", "Tezkor Kirish Xotirasi", "O'qish va O'zgartirish"], answer: 0 },
      { q: "iOS ilovalarini ishlab chiqishda asosan qaysi til ishlatiladi?", options: ["Java", "Kotlin", "Swift", "Python"], answer: 2 },
      { q: "'git commit' buyrug'i nima qiladi?", options: ["GitHubga yuklaydi", "O'zgarishlar snapshotini saqlaydi", "Branchni o'chiradi", "Branchlarni birlashtiradi"], answer: 1 },
      { q: "API nima?", options: ["Ma'lumotlar bazasi turi", "Dastur Interfeysini Ilovalashtirish", "Dasturlash tili", "Veb-server"], answer: 1 },
      { q: "CSS nima degan qisqartma?", options: ["Ijodiy Uslublar Jadvali", "Kompyuter Uslublar Jadvali", "Kaskadli Uslublar Jadvali", "Rangli Uslublar Jadvali"], answer: 2 }
    ]
  }
};

let currentSubject = '';
let questionOrder = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const badgeKeys = {
  mathematics: 'badgeMath',
  english: 'badgeEnglish',
  science: 'badgeScience',
  history: 'badgeHistory',
  geography: 'badgeGeo',
  cs: 'badgeCS'
};

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

function getQuestionIds(subject) {
  return QUESTIONS.en[subject].map((_, index) => index);
}

function getCurrentQuestion() {
  return QUESTIONS[currentLang][currentSubject][questionOrder[currentIndex]];
}

function updateQuizProgress() {
  const total = questionOrder.length;
  document.getElementById('questionCounter').textContent = `${t('questionOf')} ${currentIndex + 1} ${t('of')} ${total}`;
  document.getElementById('scoreCounter').textContent = `${t('scoreLabel')} ${score}`;
  document.getElementById('progressFill').style.width = `${((currentIndex + 1) / total) * 100}%`;
  document.getElementById('questionNum').textContent = `${t('questionOf')} ${String(currentIndex + 1).padStart(2, '0')}`;
}

function syncQuestionText() {
  if (!currentSubject || questionOrder.length === 0) return;

  const q = getCurrentQuestion();
  updateQuizProgress();
  document.getElementById('questionText').textContent = q.q;
  document.querySelectorAll('#optionsGrid .option-text').forEach((optionText, index) => {
    optionText.textContent = q.options[index];
  });

  const isLast = currentIndex === questionOrder.length - 1;
  document.getElementById('nextBtn').textContent = isLast ? t('seeResults') : t('nextBtn');
}

function startQuiz(subject) {
  currentSubject = subject;
  questionOrder = shuffle(getQuestionIds(subject));
  currentIndex = 0;
  score = 0;
  answered = false;

  document.getElementById('subjectBadge').textContent = t(badgeKeys[subject]);
  document.getElementById('subjectSelect').style.display = 'none';
  document.getElementById('resultScreen').classList.remove('visible');
  document.getElementById('quizArea').style.display = 'block';

  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = getCurrentQuestion();
  updateQuizProgress();
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('nextBtn').classList.remove('visible');

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
}

function selectAnswer(selected) {
  if (answered) return;
  answered = true;

  const correct = getCurrentQuestion().answer;

  const options = document.querySelectorAll('.option');
  options.forEach(o => o.classList.add('answered'));

  if (selected === correct) {
    options[selected].classList.add('correct');
    score++;
  } else {
    options[selected].classList.add('wrong');
    options[correct].classList.add('correct');
  }

  document.getElementById('scoreCounter').textContent = `${t('scoreLabel')} ${score}`;
  document.getElementById('nextBtn').classList.add('visible');

  const isLast = currentIndex === questionOrder.length - 1;
  document.getElementById('nextBtn').textContent = isLast ? t('seeResults') : t('nextBtn');
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questionOrder.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('resultScreen').classList.add('visible');

  const total = questionOrder.length;
  const pct = Math.round((score / total) * 100);

  document.getElementById('resultScore').textContent = `${score}/${total}`;
  document.getElementById('resultLabel').textContent = `${t('youGot')} ${pct}${t('correct')}`;
  document.getElementById('tryAgainBtn').textContent = t('tryAgain');
  document.getElementById('backHomeBtn').textContent = t('backHome');

  let grade, gradeStyle;
  if (pct >= 90)      { grade = t('gradeExcellent'); gradeStyle = 'background:rgba(200,241,53,0.15);color:var(--accent);border:1px solid rgba(200,241,53,0.3)'; }
  else if (pct >= 70) { grade = t('gradeGood');      gradeStyle = 'background:rgba(100,200,100,0.1);color:#6dc86d;border:1px solid rgba(100,200,100,0.3)'; }
  else if (pct >= 50) { grade = t('gradeAverage');   gradeStyle = 'background:rgba(255,180,0,0.1);color:#ffb400;border:1px solid rgba(255,180,0,0.3)'; }
  else                { grade = t('gradeStudy');     gradeStyle = 'background:rgba(255,79,79,0.1);color:var(--danger);border:1px solid rgba(255,79,79,0.3)'; }

  const gradeEl = document.getElementById('resultGrade');
  gradeEl.textContent = grade;
  gradeEl.style.cssText = gradeStyle;
}

function restartQuiz() {
  startQuiz(currentSubject);
}

window.handleLanguageChange = function handleQuizLanguageChange() {
  if (currentSubject) {
    document.getElementById('subjectBadge').textContent = t(badgeKeys[currentSubject]);
  }

  if (document.getElementById('resultScreen').classList.contains('visible')) {
    showResults();
    return;
  }

  if (document.getElementById('quizArea').style.display !== 'none' && questionOrder.length > 0) {
    syncQuestionText();
  }
};

const urlSubject = getSubjectFromURL();
if (urlSubject && QUESTIONS['en'][urlSubject]) {
  startQuiz(urlSubject);
}
