import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobGrid from '../components/JobGrid';
import Loader from '../components/Loader';
import { searchJobs } from '../api/jobsApi';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (kw) => {
    if (!kw.trim()) return;
    setLoading(true);
    setError(null);
    setKeyword(kw);
    setSearchParams({ keyword: kw });

    try {
      const data = await searchJobs(kw);
      setJobs(data.results || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    const kw = searchParams.get('keyword');
    if (kw) {
      doSearch(kw);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="search-page">
      <div className="search-page__header">
        <div className="container">
          <h1 className="search-page__title">
            <span className="search-page__title-gradient">Search</span> Jobs
          </h1>
          <div className="search-page__bar-wrapper">
            <SearchBar
              onSearch={doSearch}
              initialValue={keyword}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="search-page__results container">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="search-page__error">
            <div className="search-page__error-icon">⚠️</div>
            <h3 className="search-page__error-title">Search Failed</h3>
            <p className="search-page__error-text">{error}</p>
            <button
              className="search-page__error-retry"
              onClick={() => doSearch(keyword)}
            >
              Try Again
            </button>
          </div>
        ) : searched ? (
          <JobGrid jobs={jobs} keyword={keyword} />
        ) : (
          <div className="search-page__initial">
            <div className="search-page__initial-icon">🚀</div>
            <h3 className="search-page__initial-title">
              Start your job search
            </h3>
            <p className="search-page__initial-text">
              Enter a keyword above to search across Findwork, Jooble, Arbeitnow & Jobicy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
