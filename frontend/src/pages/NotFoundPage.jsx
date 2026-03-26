import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="panel centered-panel">
      <p className="eyebrow">404</p>
      <h1>This route does not exist in the React app.</h1>
      <Link className="primary-button" to="/">
        Back to overview
      </Link>
    </section>
  );
}
