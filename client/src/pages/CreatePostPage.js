import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";

/*
  CreatePostPage — form to ask a new question.
  Accessible only to logged-in users (protected by PrivateRoute in App.js).
  Validates:
    - Title: required, 1–80 characters
    - Content: required, 1–8000 characters
*/
function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Client-side validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.trim().length > 80) {
      newErrors.title = "Title must be at most 80 characters.";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required.";
    } else if (content.trim().length > 8000) {
      newErrors.content = "Content must be at most 8000 characters.";
    }

    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await createPost(title.trim(), content.trim());
      // Navigate to the newly created post
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Failed to create question. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="create-post-page">
      <h1>Ask a Question</h1>

      <form id="create-post-form" onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="post-title">
            Title <span className="required">*</span>
          </label>
          <input
            id="post-title"
            type="text"
            placeholder="E.g. How do I sort an array in JavaScript?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
          <small>{title.length}/80 characters</small>
          {errors.title && (
            <p className="field-error" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="post-content">
            Details <span className="required">*</span>
          </label>
          <textarea
            id="post-content"
            placeholder="Describe your question in detail..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            maxLength={8000}
          />
          <small>{content.length}/8000 characters</small>
          {errors.content && (
            <p className="field-error" role="alert">
              {errors.content}
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p id="server-error" role="alert">
            {serverError}
          </p>
        )}

        <button id="create-post-btn" type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Question"}
        </button>
      </form>
    </main>
  );
}

export default CreatePostPage;
