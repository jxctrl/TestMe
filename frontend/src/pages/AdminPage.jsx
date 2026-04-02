import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { SUBJECTS } from "../lib/content";

function buildEmptyForm() {
  return {
    subject: "mathematics",
    question_text_en: "",
    question_text_uz: "",
    options_en: ["", "", "", ""],
    options_uz: ["", "", "", ""],
    correct_answer_index: 0
  };
}

export default function AdminPage() {
  const { token } = useAuth();
  const [formState, setFormState] = useState(buildEmptyForm);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAdminData() {
      setLoading(true);
      setError("");

      try {
        const [questionResponse, userResponse] = await Promise.all([
          api.get("/admin/questions", { token }),
          api.get("/admin/users", { token })
        ]);

        if (!active) {
          return;
        }

        setQuestions(questionResponse);
        setUsers(userResponse);
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAdminData();
    return () => {
      active = false;
    };
  }, [token]);

  function updateOption(languageKey, index, value) {
    setFormState((current) => {
      const nextOptions = [...current[languageKey]];
      nextOptions[index] = value;
      return {
        ...current,
        [languageKey]: nextOptions
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const created = await api.post("/admin/questions", formState, { token });
      setQuestions((current) =>
        [...current, created].sort((left, right) => {
          if (left.subject === right.subject) {
            return left.id - right.id;
          }
          return left.subject.localeCompare(right.subject);
        })
      );
      setFormState(buildEmptyForm());
      setMessage("Question saved.");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function deleteQuestion(questionId) {
    setMessage("");
    setError("");

    try {
      await api.delete(`/admin/questions/${questionId}`, { token });
      setQuestions((current) => current.filter((item) => item.id !== questionId));
      setMessage("Question removed.");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <div className="stack-page">
      <section className="panel">
        <p className="eyebrow">Admin console</p>
        <h1>Manage question content and review player accounts.</h1>
        <p className="muted-text">
          Review registered users, publish bilingual question sets, and keep the arena content sharp.
        </p>
      </section>

      {message ? <div className="banner success-banner">{message}</div> : null}
      {error ? <div className="banner error-banner">{error}</div> : null}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Create question</p>
            <h2>Add bilingual quiz content</h2>
          </div>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Subject</span>
            <select
              value={formState.subject}
              onChange={(event) => setFormState((current) => ({ ...current, subject: event.target.value }))}
            >
              {SUBJECTS.filter((subject) => subject.value !== "all").map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field field-span-2">
            <span>Question (English)</span>
            <textarea
              value={formState.question_text_en}
              onChange={(event) =>
                setFormState((current) => ({ ...current, question_text_en: event.target.value }))
              }
              rows={3}
              required
            />
          </label>

          <label className="field field-span-2">
            <span>Question (Uzbek)</span>
            <textarea
              value={formState.question_text_uz}
              onChange={(event) =>
                setFormState((current) => ({ ...current, question_text_uz: event.target.value }))
              }
              rows={3}
              required
            />
          </label>

          {formState.options_en.map((option, index) => (
            <label className="field" key={`option-en-${index}`}>
              <span>Option EN {index + 1}</span>
              <input
                type="text"
                value={option}
                onChange={(event) => updateOption("options_en", index, event.target.value)}
                required
              />
            </label>
          ))}

          {formState.options_uz.map((option, index) => (
            <label className="field" key={`option-uz-${index}`}>
              <span>Option UZ {index + 1}</span>
              <input
                type="text"
                value={option}
                onChange={(event) => updateOption("options_uz", index, event.target.value)}
                required
              />
            </label>
          ))}

          <label className="field">
            <span>Correct answer index</span>
            <select
              value={formState.correct_answer_index}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  correct_answer_index: Number(event.target.value)
                }))
              }
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>

          <button className="primary-button" type="submit">
            Save question
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Questions</p>
            <h2>Existing question bank</h2>
          </div>
        </div>

        {loading ? (
          <p className="muted-text">Loading admin data...</p>
        ) : questions.length === 0 ? (
          <p className="muted-text">No questions found.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>English</th>
                  <th>Uzbek</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td>{question.id}</td>
                    <td>{question.subject}</td>
                    <td>{question.question_text_en}</td>
                    <td>{question.question_text_uz}</td>
                    <td>
                      <button className="ghost-button danger-button" type="button" onClick={() => deleteQuestion(question.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Users</p>
            <h2>Registered accounts</h2>
          </div>
        </div>

        {loading ? (
          <p className="muted-text">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="muted-text">No users have registered yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Runs</th>
                  <th>Best score</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>{user.total_quizzes_taken}</td>
                    <td>{user.best_score ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
