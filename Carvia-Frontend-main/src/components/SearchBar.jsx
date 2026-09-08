import { useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '', loading = false }) {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-bar__icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </span>
      <input
        id="search-input"
        type="text"
        className="search-bar__input"
        placeholder="Try React, platform engineer, product designer..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        aria-label="Search jobs"
      />
      <button
        id="search-button"
        type="submit"
        className="search-bar__btn"
        disabled={loading || !keyword.trim()}
      >
        {loading ? (
          <>
            <span className="button-spinner" />
            Searching…
          </>
        ) : 'Search'}
      </button>
    </form>
  );
}
