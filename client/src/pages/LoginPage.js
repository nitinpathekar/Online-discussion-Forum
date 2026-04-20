import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";

/*
  LoginPage — email + password form.
  On success: stores user in AuthContext and redirects to home.
  Validates: both fields required, valid email format.
*/
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!password) {
      errs.password = "Password is required.";
    }
    return errs;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await loginUser(email.trim(), password);
      login(res.data); // store in context + localStorage
      navigate("/");
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="login-page">
      <h1>Login</h1>

      <form id="login-form" onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="field-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p id="server-error" role="alert">
            {serverError}
          </p>
        )}

        <button id="login-btn" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </main>
  );
}

export default LoginPage;
