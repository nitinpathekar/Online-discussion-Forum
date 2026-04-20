import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/*
  App.js — root component.
  Wraps everything in AuthProvider so all pages can access user state.
  Routes:
    /              → Home (all questions)
    /posts/:id     → Single question + answers
    /posts/create  → Ask a question (protected)
    /login         → Login
    /register      → Register
*/
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/posts/:id" element={<PostDetailPage />} />

          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePostPage />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
