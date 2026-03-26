export const SUBJECTS = [
  { value: "mathematics", label: "Mathematics" },
  { value: "english", label: "English" },
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "cs", label: "Computer Science" },
  { value: "all", label: "Mixed" }
];

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "uz", label: "Uzbek" }
];

const subjectLabels = Object.fromEntries(SUBJECTS.map((subject) => [subject.value, subject.label]));

export function formatSubject(subject) {
  return subjectLabels[subject] || subject;
}

export function formatMode(mode) {
  if (mode === "competition") {
    return "Competition";
  }
  return "Practice";
}

export function formatScore(mode, score) {
  return mode === "competition" ? `${score} pts` : `${score}/10`;
}
