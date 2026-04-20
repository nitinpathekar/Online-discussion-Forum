import React from "react";
import { useAuth } from "../context/AuthContext";
import { deleteComment } from "../api";

/*
  AnswerCard — renders one comment (answer) and its nested replies.
  Props:
    comment      → the comment object (may have .children array)
    postId       → needed to post nested replies from the parent
    onDelete     → callback to refresh comments after deletion
    onReply      → callback(parentId) → lifts state to show reply form
*/
function AnswerCard({ comment, onDelete, onReply }) {
  const { user } = useAuth();

  const canDelete =
    user && (user.userId === comment.commenter?._id || user.isAdmin);

  const handleDelete = async () => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      await deleteComment(comment._id);
      onDelete();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed.");
    }
  };

  return (
    <div
      id={`answer-${comment._id}`}
      className="answer-card"
      style={{ marginLeft: comment.parent ? "2rem" : "0" }}
    >
      <p className="answer-content">{comment.content}</p>

      <div className="answer-meta">
        <span>by {comment.commenter?.username || "unknown"}</span>
        <span>&nbsp;·&nbsp;{new Date(comment.createdAt).toLocaleDateString()}</span>
        {comment.edited && <span>&nbsp;· (edited)</span>}
      </div>

      <div className="answer-actions">
        {user && (
          <button
            className="reply-btn"
            onClick={() => onReply(comment._id)}
          >
            Reply
          </button>
        )}
        {canDelete && (
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      {/* Nested replies */}
      {comment.children && comment.children.length > 0 && (
        <div className="answer-children">
          {comment.children.map((child) => (
            <AnswerCard
              key={child._id}
              comment={child}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AnswerCard;
