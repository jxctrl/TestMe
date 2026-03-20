// =====================
// LANGUAGE SYSTEM
// =====================

const TRANSLATIONS = {
  en: {
    // NAV
    navHome: "Home",
    navSubjects: "Subjects",
    navModes: "Modes",
    navContact: "Contact",
    navCta: "Start Test →",

    // HERO
    heroBadge: "Now with Competition Mode",
    heroTitle1: "Test your",
    heroTitle2: "knowledge.",
    heroTitle3: "Beat the clock.",
    heroDesc: "Challenge yourself across subjects. Compete against the timer. Track your score. Built for students who want to actually prepare — not just feel like they are.",
    heroBtn1: "Start a Test →",
    heroBtn2: "View Modes",
    heroStat1: "Subjects",
    heroStat2: "Per Question",
    heroStat3: "Always",

    // SUBJECTS SECTION
    subjectsLabel: "Subjects",
    subjectsTitle: "Pick your subject.\nStart immediately.",
    subjectQuestions: "10 questions",

    // SUBJECT NAMES
    subjectMath: "Mathematics",
    subjectMathDesc: "Numbers, structures, logic. From arithmetic to algebra — test your calculation speed.",
    subjectEnglish: "English",
    subjectEnglishDesc: "Grammar, vocabulary, comprehension. Strengthen your language foundation.",
    subjectScience: "Natural Science",
    subjectScienceDesc: "Biology, chemistry, physics fundamentals. Explore the natural world through questions.",
    subjectHistory: "History",
    subjectHistoryDesc: "Key events, dates, figures. How well do you actually know the past?",
    subjectGeo: "Geography",
    subjectGeoDesc: "Countries, capitals, physical features. Test your knowledge of the world.",
    subjectCS: "Computer Science",
    subjectCSDesc: "Algorithms, logic, fundamentals. For the next generation of developers.",

    // MODES SECTION
    modesLabel: "Game Modes",
    modesTitle: "Two ways to play.",
    classicTag: "Classic",
    classicTitle: "Practice Mode",
    classicDesc: "No timer pressure. Work through questions at your own pace. See correct answers immediately. Best for learning and revision.",
    classicBtn: "Start Practice →",
    compTag: "Competition",
    compTitle: "Speed Mode",
    compDesc: "10 seconds per question. Points for correct answers. Score as high as you can before time runs out.",
    compBtn: "Compete Now →",

    // CONTACT
    contactLabel: "Contact",
    contactTitle: "Get in touch.",
    contactDesc: "Found a bug? Have a subject suggestion? Want to contribute questions? Reach out directly.",
    contactName: "First Name",
    contactSurname: "Last Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSend: "Send Message",
    contactSent: "Sent ✓",

    // QUIZ PAGE
    selectSubject: "Choose a subject.",
    selectSubjectSub: "Pick a topic and start immediately.",
    questionOf: "Question",
    of: "of",
    scoreLabel: "Score:",
    nextBtn: "Next Question →",
    seeResults: "See Results →",
    tryAgain: "Try Again",
    backHome: "Back to Home",
    youGot: "You got",
    correct: "% correct",

    // GRADES
    gradeExcellent: "🔥 Excellent",
    gradeGood: "✅ Good",
    gradeAverage: "⚠️ Average",
    gradeStudy: "💀 Study more",

    // COMPETITION PAGE
    compPageTitle: "Speed Mode",
    compDescLobby: "10 seconds per question. Answer fast. Answer right. Your score is your rank.",
    compRule1: "Correct answer: +1000 points",
    compRule2: "Wrong answer: 0 points",
    compRule3: "Time runs out: auto-counted as wrong",
    compRule4: "10 questions, all subjects mixed",
    startComp: "Start Competition →",
    pointsEarned: "points earned",
    correctLabel: "Correct",
    wrongLabel: "Wrong",
    timedOut: "Timed Out",
    playAgain: "Play Again",
    backBtn: "← Back",
    backHome: "Back to Home",

    // COMP GRADES
    gradeUnstoppable: "🔥 Unstoppable",
    gradeStrong: "💪 Strong",
    gradeDecent: "⚠️ Decent",
    gradeTrain: "💀 Train harder",

    // SUBJECT BADGE NAMES
    badgeMath: "📐 Mathematics",
    badgeEnglish: "📖 English",
    badgeScience: "🔬 Natural Science",
    badgeHistory: "🏛️ History",
    badgeGeo: "🌍 Geography",
    badgeCS: "💻 Computer Science",
  },

  uz: {
    // NAV
    navHome: "Bosh sahifa",
    navSubjects: "Fanlar",
    navModes: "Rejimlar",
    navContact: "Aloqa",
    navCta: "Testni boshlash →",

    // HERO
    heroBadge: "Musobaqa rejimi mavjud",
    heroTitle1: "Bilimingizni",
    heroTitle2: "sinab ko'ring.",
    heroTitle3: "Vaqtdan ustun bo'l.",
    heroDesc: "Fanlar bo'yicha o'zingizni sinab ko'ring. Taymer bilan raqobatlashing. Natijangizni kuzating. Haqiqatan tayyorlanmoqchi bo'lgan talabalar uchun.",
    heroBtn1: "Testni boshlash →",
    heroBtn2: "Rejimlarni ko'rish",
    heroStat1: "Fan",
    heroStat2: "Har savol",
    heroStat3: "Bepul",

    // SUBJECTS SECTION
    subjectsLabel: "Fanlar",
    subjectsTitle: "Fanni tanlang.\nHoziroq boshlang.",
    subjectQuestions: "10 ta savol",

    // SUBJECT NAMES
    subjectMath: "Matematika",
    subjectMathDesc: "Sonlar, tuzilmalar, mantiq. Arifmetikadan algebragacha — hisoblash tezligingizni sinang.",
    subjectEnglish: "Ingliz tili",
    subjectEnglishDesc: "Grammatika, lug'at, tushunish. Til poydevorini mustahkamlang.",
    subjectScience: "Tabiiy fanlar",
    subjectScienceDesc: "Biologiya, kimyo, fizika asoslari. Savollar orqali tabiat olamini o'rganing.",
    subjectHistory: "Tarix",
    subjectHistoryDesc: "Muhim voqealar, sanalar, shaxslar. O'tmishni qanchalik bilasiz?",
    subjectGeo: "Geografiya",
    subjectGeoDesc: "Mamlakatlar, poytaxtlar, geografik xususiyatlar. Dunyo haqidagi bilimingizni sinang.",
    subjectCS: "Informatika",
    subjectCSDesc: "Algoritmlar, mantiq, asoslar. Kelajak dasturchilar uchun.",

    // MODES SECTION
    modesLabel: "O'yin rejimlari",
    modesTitle: "Ikki xil o'yin.",
    classicTag: "Klassik",
    classicTitle: "Mashq rejimi",
    classicDesc: "Taymer bosimi yo'q. Savollar bo'ylab o'z sur'atingizda o'ting. To'g'ri javoblarni darhol ko'ring. O'rganish uchun eng yaxshi.",
    classicBtn: "Mashqni boshlash →",
    compTag: "Musobaqa",
    compTitle: "Tezlik rejimi",
    compDesc: "Har savolga 10 soniya. To'g'ri javoblar uchun ball. Vaqt tugagunicha imkon qadar yuqori ball to'plang.",
    compBtn: "Musobaqaga kirish →",

    // CONTACT
    contactLabel: "Aloqa",
    contactTitle: "Bog'laning.",
    contactDesc: "Xato topdingizmi? Fan taklif qilmoqchimisiz? Savol qo'shmoqchimisiz? To'g'ridan-to'g'ri murojaat qiling.",
    contactName: "Ism",
    contactSurname: "Familiya",
    contactEmail: "Email",
    contactMessage: "Xabar",
    contactSend: "Xabar yuborish",
    contactSent: "Yuborildi ✓",

    // QUIZ PAGE
    selectSubject: "Fan tanlang.",
    selectSubjectSub: "Mavzuni tanlang va hoziroq boshlang.",
    questionOf: "Savol",
    of: "/",
    scoreLabel: "Ball:",
    nextBtn: "Keyingi savol →",
    seeResults: "Natijalarni ko'rish →",
    tryAgain: "Qayta urinish",
    backHome: "Bosh sahifaga",
    youGot: "Siz",
    correct: "% to'g'ri javob berdingiz",

    // GRADES
    gradeExcellent: "🔥 A'lo",
    gradeGood: "✅ Yaxshi",
    gradeAverage: "⚠️ O'rtacha",
    gradeStudy: "💀 Ko'proq o'qing",

    // COMPETITION PAGE
    compPageTitle: "Tezlik rejimi",
    compDescLobby: "Har savolga 10 soniya. Tez javob bering. To'g'ri javob bering. Natijangiz sizning reytingingiz.",
    compRule1: "To'g'ri javob: +1000 ball",
    compRule2: "Noto'g'ri javob: 0 ball",
    compRule3: "Vaqt tugasa: noto'g'ri hisoblanadi",
    compRule4: "10 ta savol, barcha fanlardan aralash",
    startComp: "Musobaqani boshlash →",
    pointsEarned: "ball to'plandi",
    correctLabel: "To'g'ri",
    wrongLabel: "Noto'g'ri",
    timedOut: "Vaqt tugadi",
    playAgain: "Qayta o'ynash",
    backBtn: "← Orqaga",

    // COMP GRADES
    gradeUnstoppable: "🔥 To'xtatib bo'lmas",
    gradeStrong: "💪 Kuchli",
    gradeDecent: "⚠️ O'rtacha",
    gradeTrain: "💀 Ko'proq mashq qiling",

    // SUBJECT BADGE NAMES
    badgeMath: "📐 Mathematics",
    badgeEnglish: "📖 English",
    badgeScience: "🔬 Natural Science",
    badgeHistory: "🏛️ History",
    badgeGeo: "🌍 Geography",
    badgeCS: "💻 Computer Science",
  }
};

// Read saved language, default to 'en'
let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Update toggle button text
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'en' ? "🇺🇿 O'Z" : "🇬🇧 EN";
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'uz' : 'en');
}

// Auto-apply on page load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});
