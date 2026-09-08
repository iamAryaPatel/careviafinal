import { useState, useMemo } from 'react';
import JobCard from './JobCard';

const SOURCES = ['All', 'Findwork', 'Jooble', 'Arbeitnow', 'Jobicy', 'LinkedIn', 'Remotive'];

export default function JobGrid({ jobs = [], keyword = '' }) {
  const [activeSource, setActiveSource] = useState('All');

  const filteredJobs = useMemo(() => {
    if (activeSource === 'All') return jobs;
    return jobs.filter(
      (job) => (job.source || '').toLowerCase() === activeSource.toLowerCase()
    );
  }, [jobs, activeSource]);

  return (
    <div>
      <div className="job-grid__header">
        <h2 className="job-grid__title">
          {keyword ? `Results for "${keyword}"` : 'Latest Jobs'}
        </h2>
        <span className="job-grid__count">
          Showing <strong>{filteredJobs.length}</strong> of{' '}
          <strong>{jobs.length}</strong> jobs
        </span>
      </div>

      <div className="job-grid__filters">
        {SOURCES.map((source) => (
          <button
            key={source}
            className={`job-grid__filter-chip ${activeSource === source ? 'active' : ''}`}
            onClick={() => setActiveSource(source)}
          >
            {source}
          </button>
        ))}
      </div>

      <div className="job-grid__grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, i) => (
            <JobCard key={`${job.source}-${job.title}-${i}`} job={job} index={i} />
          ))
        ) : (
          <div className="job-grid__empty">
            <div className="job-grid__empty-icon">🔎</div>
            <h3 className="job-grid__empty-title">No jobs found</h3>
            <p className="job-grid__empty-text">
              {activeSource !== 'All'
                ? `No results from ${activeSource}. Try selecting "All" sources.`
                : 'Try a different search keyword.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
