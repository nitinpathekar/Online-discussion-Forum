import axios from "axios";
import { BASE_URL } from "../config";

// ─── Helper: build headers with JWT ───────────────────────────────────────────
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { "x-access-token": token } : {};
};

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (username, email, password) =>
  axios.post(`${BASE_URL}/api/users/register`, { username, email, password });

export const loginUser = (email, password) =>
  axios.post(`${BASE_URL}/api/users/login`, { email, password });

// ─── Posts ─────────────────────────────────────────────────────────────────────
export const getPosts = (params = {}) =>
  axios.get(`${BASE_URL}/api/posts`, {
    headers: authHeaders(),
    params,
  });

export const getPost = (postId) =>
  axios.get(`${BASE_URL}/api/posts/${postId}`, {
    headers: authHeaders(),
  });

export const createPost = (title, content) =>
  axios.post(
    `${BASE_URL}/api/posts`,
    { title, content },
    { headers: authHeaders() }
  );

export const deletePost = (postId) =>
  axios.delete(`${BASE_URL}/api/posts/${postId}`, {
    headers: authHeaders(),
  });

export const likePost = (postId) =>
  axios.post(
    `${BASE_URL}/api/posts/like/${postId}`,
    {},
    { headers: authHeaders() }
  );

export const unlikePost = (postId) =>
  axios.delete(`${BASE_URL}/api/posts/like/${postId}`, {
    headers: authHeaders(),
  });

// ─── Comments (Answers) ────────────────────────────────────────────────────────
export const getComments = (postId) =>
  axios.get(`${BASE_URL}/api/comments/post/${postId}`);

// parentId is optional — pass it to create a nested reply
export const createComment = (postId, content, parentId = null) =>
  axios.post(
    `${BASE_URL}/api/comments/${postId}`,
    { content, parentId },
    { headers: authHeaders() }
  );

export const deleteComment = (commentId) =>
  axios.delete(`${BASE_URL}/api/comments/${commentId}`, {
    headers: authHeaders(),
  });

// ─── Users ─────────────────────────────────────────────────────────────────────
export const getUserProfile = (username) =>
  axios.get(`${BASE_URL}/api/users/${username}`);
