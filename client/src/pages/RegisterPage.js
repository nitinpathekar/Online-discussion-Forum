import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api";

/*
  RegisterPage — username + email + password form.
  Validates:
    - Username: 6–30 chars, no spaces
    - Email: valid format
    - Password: at least 8 characters
    - Confirm password: must match
*/
function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    if (!username.trim()) {
      errs.username = "Username is required.";
    } else if (username.includes(" ")) {
      errs.username = "Username must not contain spaces.";
    } else if (username.length < 6 || username.length > 30) {
      errs.username = "Username must be between 6 and 30 characters.";
    }

    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
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
      const res = await registerUser(username.trim(), email.trim(), password);
      login(res.data); // auto-login after register
      navigate("/");
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="register-page">
      <h1>Create an Account</h1>

      <form id="register-form" onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            placeholder="6–30 characters, no spaces"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={6}
            maxLength={30}
          />
          {errors.username && (
            <p className="field-error" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="form-group">
          <label htmlFor="reg-confirm-password">Confirm Password</label>
          <input
            id="reg-confirm-password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="field-error" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p id="server-error" role="alert">
            {serverError}
          </p>
        )}

        <button id="register-btn" type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
