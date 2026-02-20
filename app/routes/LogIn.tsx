import { useNavigate } from "@remix-run/react";
import * as React from "react";
import { useLogin } from "~/presentation/hooks/useLogin";

function LogIn() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [showPass, setShowPass] = React.useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }

    const session = await login({ username, password });
    if (!session) {
      setFormError("Invalid username or password.");
      return;
    }
    navigate("/home");
  };

  const displayError = formError ?? error;

  return (
    <div className="login-root">

      {/* ── Left teal panel ───────────────────────────── */}
      <div className="panel-left">
        <div className="rings">
          <span /><span /><span /><span /><span />
        </div>
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="panel-copy">
          <p className="panel-eyebrow">Your clinic portal</p>
          <h2 className="panel-headline">
            Every treatment,<br /><em>in balance</em><br />within reach.
          </h2>
          <p className="panel-sub">
            Sign in to continue your healing journey. Your records, your wellness, your way.
          </p>
          <div className="dots">
            <span className="active" />
            <span />
            <span />
          </div>
        </div>
      </div>

      {/* ── Right white form panel ────────────────────── */}
      <div className="panel-right">
        <div className="form-shell">

          <h1 className="form-heading">Sign in</h1>
          <p className="form-sub">Welcome back — good to see you again.</p>

          {displayError && (
            <div className="error-box" key={displayError}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="username">Username</label>
              <div className="input-wrap" style={{ position: "relative" }}>
                <svg className="i-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                  position: "absolute",
                  left: "13px", top: "50%",
                  transform: "translateY(-50%)",
                  width: "15px", height: "15px",
                  color: "#b0cdd0",
                  pointerEvents: "none",
                  transition: "color 0.2s",
                }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="your_username"
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 38px 12px 38px",
                    background: "var(--off-white)",
                    border: "1.5px solid #d4eaec",
                    borderRadius: "10px",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: "400",
                    color: "#0d2c30",
                    outline: "none",
                    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap" style={{ position: "relative" }}>
                <svg className="i-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                  position: "absolute",
                  left: "13px", top: "50%",
                  transform: "translateY(-50%)",
                  width: "15px", height: "15px",
                  color: "#b0cdd0",
                  pointerEvents: "none",
                  transition: "color 0.2s",
                }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 38px 12px 38px",
                    background: "var(--off-white)",
                    border: "1.5px solid #d4eaec",
                    borderRadius: "10px",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: "400",
                    color: "#0d2c30",
                    outline: "none",
                    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  }}
                />
                <svg
                  className="i-toggle"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute",
                    right: "13px", top: "50%",
                    transform: "translateY(-50%)",
                    width: "15px", height: "15px",
                    color: "#b0cdd0",
                    cursor: "pointer",
                    pointerEvents: "all",
                    transition: "color 0.2s",
                  }}
                >
                  {showPass ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </div>
            </div>

            <div className="btn-wrap">
              <button type="submit" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default LogIn;