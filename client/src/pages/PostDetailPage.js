import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnswerCard from "../components/AnswerCard";
import { getPost, likePost, unlikePost, getComments, createComment, deletePost } from "../api";

/*
  PostDetailPage — shows a single question, its full content, and all answers.
  Features:
    - Like / Unlike the question
    - Submit an answer (top-level comment)
    - Reply to an existing answer (nested comment)
    - Delete the post (owner / admin)
    - Delete answers (owner / admin) — handled inside AnswerCard
*/
function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState("");

  // ── Answer form state ──────────────────────────────────────────────────────
  const [answerContent, setAnswerContent] = useState("");
  const [replyToId, setReplyToId] = useState(null); // null = top-level answer
  const [answerError, setAnswerError] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);

  // ── Fetch post ─────────────────────────────────────────────────────────────
  const fetchPost = async () => {
    try {
      const res = await getPost(id);
      setPost(res.data);
    } catch {
      setPostError("Question not found.");
    } finally {
      setPostLoading(false);
    }
  };

  // ── Fetch comments ─────────────────────────────────────────────────────────
  const fetchComments = async () => {
    try {
      const res = await getComments(id);
      setComments(res.data);
    } catch {
      // Non-fatal — show empty list
      setComments([]);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // ── Vote ───────────────────────────────────────────────────────────────────
  const handleVote = async () => {
    if (!user) {
      alert("Please login to vote.");
      return;
    }
    try {
      if (post.liked) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
      fetchPost();
    } catch (err) {
      alert(err.response?.data?.error || "Vote failed.");
    }
  };

  // ── Delete post ────────────────────────────────────────────────────────────
  const handleDeletePost = async () => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed.");
    }
  };

  // ── Submit answer ──────────────────────────────────────────────────────────
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setAnswerError("");

    if (!answerContent.trim()) {
      setAnswerError("Answer cannot be empty.");
      return;
    }

    setAnswerSubmitting(true);
    try {
      await createComment(id, answerContent.trim(), replyToId);
      setAnswerContent("");
      setReplyToId(null);
      fetchComments();
      fetchPost(); // update comment count
    } catch (err) {
      setAnswerError(err.response?.data?.error || "Failed to submit answer.");
    } finally {
      setAnswerSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (postLoading) return <p id="loading-msg">Loading question...</p>;
  if (postError) return <p id="error-msg">{postError}</p>;
  if (!post) return null;

  const canDeletePost =
    user && (user.userId === post.poster?._id || user.isAdmin);

  return (
    <main id="post-detail-page">
      {/* ── Question ── */}
      <section id="question-section">
        <h1 id="question-title">{post.title}</h1>

        <div id="question-meta">
          <span>Asked by {post.poster?.username || "unknown"}</span>
          <span>&nbsp;·&nbsp;{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.edited && <span>&nbsp;· (edited)</span>}
        </div>

        <p id="question-content">{post.content}</p>

        <div id="question-actions">
          {/* Vote */}
          <button id="vote-btn" onClick={handleVote}>
            {post.liked ? "▲ Unlike" : "▲ Like"} ({post.likeCount})
          </button>

          {/* Delete question */}
          {canDeletePost && (
            <button id="delete-post-btn" onClick={handleDeletePost}>
              Delete Question
            </button>
          )}
        </div>
      </section>

      <hr />

      {/* ── Answers ── */}
      <section id="answers-section">
        <h2>{comments.length} Answer(s)</h2>

        {comments.length === 0 ? (
          <p>No answers yet. Be the first to answer!</p>
        ) : (
          comments.map((comment) => (
            <AnswerCard
              key={comment._id}
              comment={comment}
              onDelete={fetchComments}
              onReply={(parentId) => {
                setReplyToId(parentId);
                // Scroll to the answer form
                document.getElementById("answer-form")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))
        )}
      </section>

      <hr />

      {/* ── Answer Form ── */}
      <section id="answer-form-section">
        {user ? (
          <>
            <h2>
              {replyToId ? "Write a Reply" : "Your Answer"}
            </h2>

            {replyToId && (
              <p>
                Replying to a comment.{" "}
                <button
                  id="cancel-reply-btn"
                  onClick={() => setReplyToId(null)}
                >
                  Cancel reply
                </button>
              </p>
            )}

            <form id="answer-form" onSubmit={handleAnswerSubmit}>
              <textarea
                id="answer-textarea"
                placeholder="Write your answer here..."
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                rows={5}
                required
              />

              {answerError && (
                <p id="answer-error" role="alert">
                  {answerError}
                </p>
              )}

              <button
                id="answer-submit-btn"
                type="submit"
                disabled={answerSubmitting}
              >
                {answerSubmitting ? "Submitting..." : "Post Answer"}
              </button>
            </form>
          </>
        ) : (
          <p id="login-prompt">
            <a href="/login">Login</a> to post an answer.
          </p>
        )}
      </section>
    </main>
  );
}

export default PostDetailPage;
