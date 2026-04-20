import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { likePost, unlikePost } from "../api";

/*
  PostCard — shown in the home feed (list of questions).
  Props:
    post      → the post object from the API
    onVote    → callback to refresh the list after a vote
*/
function PostCard({ post, onVote }) {
  const { user } = useAuth();

  const handleVote = async (e) => {
    e.preventDefault(); // don't navigate to post detail
    if (!user) {
      alert("Please login to vote.");
      return;
    }
    try {
      if (post.liked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
      onVote();
    } catch (err) {
      alert(err.response?.data?.error || "Vote failed.");
    }
  };

  return (
    <div id={`post-card-${post._id}`} className="post-card">
      {/* Vote column */}
      <div className="post-card-votes">
        <button
          className="vote-btn"
          onClick={handleVote}
          title={post.liked ? "Unlike" : "Like"}
        >
          ▲
        </button>
        <span className="vote-count">{post.likeCount}</span>
      </div>

      {/* Content column */}
      <div className="post-card-body">
        <Link to={`/posts/${post._id}`} className="post-card-title">
          {post.title}
        </Link>

        <div className="post-card-meta">
          <span>by {post.poster?.username || "unknown"}</span>
          <span>&nbsp;·&nbsp;{post.commentCount} answer(s)</span>
          <span>
            &nbsp;·&nbsp;
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          {post.edited && <span>&nbsp;· (edited)</span>}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
