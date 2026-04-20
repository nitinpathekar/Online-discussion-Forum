import React, { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { getPosts } from "../api";

/*
  HomePage — lists all questions.
  Features: keyword search, sort (newest / oldest / most liked), pagination.
*/
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, sortBy };
      if (search.trim()) params.search = search.trim();

      const res = await getPosts(params);
      setPosts(res.data.data);
      setTotalCount(res.data.count);
    } catch (err) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchPosts();
  }, [page, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main id="home-page">
      <h1>Student Discussion Forum</h1>
      <p>Browse questions asked by students. Login to ask your own.</p>

      {/* ── Search & Sort ── */}
      <section id="home-filters">
        <form onSubmit={handleSearch} id="search-form">
          <input
            id="search-input"
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button id="search-btn" type="submit">
            Search
          </button>
        </form>

        <label htmlFor="sort-select">Sort by: </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-likeCount">Most Liked</option>
        </select>
      </section>

      {/* ── Status ── */}
      {loading && <p id="loading-msg">Loading...</p>}
      {error && <p id="error-msg">{error}</p>}

      {/* ── Post List ── */}
      {!loading && !error && (
        <section id="post-list">
          {posts.length === 0 ? (
            <p>No questions found.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onVote={fetchPosts} />
            ))
          )}
        </section>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div id="pagination">
          <button
            id="prev-btn"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            id="next-btn"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default HomePage;
