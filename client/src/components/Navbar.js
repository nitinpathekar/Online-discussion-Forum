import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Navbar — appears on every page.
  Shows: site title | Home | Ask Question (if logged in) | Login/Register OR username + Logout
*/
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav id="navbar">
      <Link to="/" id="nav-brand">
        <strong>Student Forum</strong>
      </Link>

      <div id="nav-links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/posts/create">Ask Question</Link>
            <span id="nav-username">Hi, {user.username}</span>
            <button id="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
