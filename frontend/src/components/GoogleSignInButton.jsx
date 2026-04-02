import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
const GOOGLE_PLACEHOLDER = "your-google-oauth-client-id";

function isGoogleConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes(GOOGLE_PLACEHOLDER));
}

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_URL}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

export default function GoogleSignInButton({ disabled = false, onCredential, onError }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!isGoogleConfigured()) {
      return undefined;
    }

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => {
            if (!credential) {
              onError?.(new Error("Google did not return a credential."));
              return;
            }
            onCredential?.(credential);
          }
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 320
        });

        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          onError?.(new Error("Google sign-in could not be loaded."));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onCredential, onError]);

  if (!isGoogleConfigured()) {
    return null;
  }

  return (
    <div className="social-auth-block">
      <div className="auth-divider">
        <span>Continue with</span>
      </div>
      <div aria-busy={!ready || disabled} className={`google-button-shell ${disabled ? "is-disabled" : ""}`}>
        <div ref={containerRef} />
      </div>
    </div>
  );
}
