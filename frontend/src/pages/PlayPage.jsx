import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { LANGUAGES, SUBJECTS, formatMode, formatSubject } from "../lib/content";

const QUESTION_LIMIT = 10;

function buildInitialSession() {
  return {
    currentIndex: 0,
    questions: [],
    resolvedAnswer: null,
    score: 0,
    started: false,
    submitted: false,
    subject: "mathematics",
    answers: []
  };
}

export default function PlayPage() {
  const { mode } = useParams();
  const { token } = useAuth();
  const [subject, setSubject] = useState("mathematics");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [session, setSession] = useState(buildInitialSession);
  const [timeLeft, setTimeLeft] = useState(10);

  const isCompetition = mode === "competition";
  const isPractice = mode === "practice";
  const currentQuestion = session.questions[session.currentIndex];

  useEffect(() => {
    setSession(buildInitialSession());
    setTimeLeft(10);
    setError("");
    setSubmitMessage("");
  }, [mode]);

  useEffect(() => {
    if (!isCompetition || !session.started || session.resolvedAnswer !== null) {
      return undefined;
    }

    if (timeLeft <= 0) {
      resolveAnswer(null);
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isCompetition, session.started, session.currentIndex, session.resolvedAnswer, timeLeft]);

  async function startRun(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSubmitMessage("");

    try {
      const response = await api.get(`/questions/${subject}?lang=${language}&limit=${QUESTION_LIMIT}`);
      setSession({
        answers: [],
        currentIndex: 0,
        questions: response.questions || [],
        resolvedAnswer: null,
        score: 0,
        started: true,
        submitted: false,
        subject
      });
      setTimeLeft(10);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  function finishRun(nextAnswers, nextScore) {
    setSession((current) => ({
      ...current,
      answers: nextAnswers,
      currentIndex: current.questions.length,
      resolvedAnswer: null,
      score: nextScore,
      started: false
    }));
    setTimeLeft(10);
  }

  function resolveAnswer(answerIndex) {
    if (!currentQuestion || session.resolvedAnswer !== null) {
      return;
    }

    const isCorrect = answerIndex === currentQuestion.correct_answer_index;
    const scoreDelta = isCorrect ? (isCompetition ? 1000 : 1) : 0;
    const nextAnswers = [
      ...session.answers,
      {
        questionId: currentQuestion.id,
        prompt: currentQuestion.question_text,
        selectedIndex: answerIndex,
        correctIndex: currentQuestion.correct_answer_index,
        isCorrect
      }
    ];
    const nextScore = session.score + scoreDelta;

    if (isCompetition) {
      const nextIndex = session.currentIndex + 1;
      const hasNextQuestion = nextIndex < session.questions.length;
      if (hasNextQuestion) {
        setSession((current) => ({
          ...current,
          answers: nextAnswers,
          currentIndex: nextIndex,
          score: nextScore
        }));
        setTimeLeft(10);
      } else {
        finishRun(nextAnswers, nextScore);
      }
      return;
    }

    setSession((current) => ({
      ...current,
      answers: nextAnswers,
      resolvedAnswer: {
        isCorrect,
        selectedIndex: answerIndex
      },
      score: nextScore
    }));
  }

  function goToNextQuestion() {
    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.questions.length) {
      finishRun(session.answers, session.score);
      return;
    }

    setSession((current) => ({
      ...current,
      currentIndex: nextIndex,
      resolvedAnswer: null
    }));
  }

  async function submitScore() {
    setError("");
    setSubmitMessage("");

    try {
      await api.post(
        "/scores",
        {
          subject: session.subject,
          score: session.score,
          mode
        },
        { token }
      );

      setSession((current) => ({
        ...current,
        submitted: true
      }));
      setSubmitMessage("Score saved to the backend.");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  if (!isPractice && !isCompetition) {
    return (
      <section className="panel centered-panel">
        <h1>Unknown game mode.</h1>
      </section>
    );
  }

  const completed = session.questions.length > 0 && !session.started && session.currentIndex >= session.questions.length;

  return (
    <div className="stack-page">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">{isCompetition ? "Competition mode" : "Practice mode"}</p>
          <h1>{isCompetition ? "Beat the clock." : "Sharpen your accuracy."}</h1>
          <p className="muted-text">
            {isCompetition
              ? "Every correct answer is worth 1,000 points. Stay calm, move fast, and keep the streak alive."
              : "Ten-question runs, instant feedback, and a cleaner flow for everyday revision."}
          </p>
        </div>

        <form className="config-grid" onSubmit={startRun}>
          <label className="field">
            <span>Subject</span>
            <select value={subject} onChange={(event) => setSubject(event.target.value)} disabled={loading || session.started}>
              {SUBJECTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} disabled={loading || session.started}>
              {LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button" disabled={loading || session.started} type="submit">
            {loading ? "Loading questions..." : "Start run"}
          </button>
        </form>
      </section>

      {error ? <div className="banner error-banner">{error}</div> : null}
      {submitMessage ? <div className="banner success-banner">{submitMessage}</div> : null}

      {session.started && currentQuestion ? (
        <section className="panel quiz-panel">
          <div className="quiz-header">
            <div>
              <p className="eyebrow">
                {formatSubject(session.subject)} · Question {session.currentIndex + 1} of {session.questions.length}
              </p>
              <h2>{currentQuestion.question_text}</h2>
            </div>
            <div className="quiz-metrics">
              <div className="score-chip">
                <span>Score</span>
                <strong>{session.score}</strong>
              </div>
              {isCompetition ? (
                <div className="score-chip">
                  <span>Timer</span>
                  <strong>{timeLeft}s</strong>
                </div>
              ) : null}
            </div>
          </div>

          <div className="option-grid">
            {currentQuestion.options.map((option, index) => {
              const isSelected = session.resolvedAnswer?.selectedIndex === index;
              const isCorrect = currentQuestion.correct_answer_index === index;
              const answerState =
                session.resolvedAnswer === null
                  ? ""
                  : isCorrect
                    ? " correct"
                    : isSelected
                      ? " incorrect"
                      : "";

              return (
                <button
                  className={`option-card${answerState}`}
                  disabled={session.resolvedAnswer !== null}
                  key={`${currentQuestion.id}-${index}`}
                  type="button"
                  onClick={() => resolveAnswer(index)}
                >
                  <span className="option-index">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {isPractice && session.resolvedAnswer !== null ? (
            <div className="quiz-footer">
              <p className={session.resolvedAnswer.isCorrect ? "success-text" : "error-text"}>
                {session.resolvedAnswer.isCorrect
                  ? "Correct answer. Nice work."
                  : `Correct answer: ${currentQuestion.options[currentQuestion.correct_answer_index]}`}
              </p>
              <button className="primary-button" type="button" onClick={goToNextQuestion}>
                {session.currentIndex + 1 === session.questions.length ? "Finish run" : "Next question"}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {completed ? (
        <section className="panel">
          <p className="eyebrow">Run complete</p>
          <h2>
            {formatMode(mode)} score: {session.score}
          </h2>
          <p className="muted-text">
            {isCompetition
              ? "Competition mode stores your total points on the ranked board."
              : "Practice mode stores your correct answers out of ten."}
          </p>

          <div className="summary-grid">
            <article className="score-chip">
              <span>Correct answers</span>
              <strong>{session.answers.filter((item) => item.isCorrect).length}</strong>
            </article>
            <article className="score-chip">
              <span>Wrong or timed out</span>
              <strong>{session.answers.filter((item) => !item.isCorrect).length}</strong>
            </article>
            <article className="score-chip">
              <span>Saved subject</span>
              <strong>{formatSubject(session.subject)}</strong>
            </article>
          </div>

          <div className="hero-actions">
            <button className="primary-button" disabled={session.submitted} type="button" onClick={submitScore}>
              {session.submitted ? "Score submitted" : "Submit score"}
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setSession(buildInitialSession());
                setTimeLeft(10);
                setSubmitMessage("");
              }}
            >
              Configure another run
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
