

import CompanyLogo from './CompanyLogo';

function getSourceClass(source) {
  const s = (source || '').toLowerCase();
  if (s.includes('findwork')) return 'findwork';
  if (s.includes('jooble')) return 'jooble';
  if (s.includes('arbeitnow')) return 'arbeitnow';
  if (s.includes('jobicy')) return 'jobicy';
  if (s.includes('linkedin')) return 'linkedin';
  return 'database';
}

export default function JobCard({ job, index = 0 }) {
  const sourceClass = getSourceClass(job.source);

  return (
    <article
      className="job-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="job-card__header" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <CompanyLogo companyLogo={job.companyLogo} logo={job.logo} company={job.company} style={{ width: '36px', height: '36px', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h3 className="job-card__title" style={{ margin: 0 }}>{job.title || 'Untitled Position'}</h3>
        </div>
        <span className={`job-card__source job-card__source--${sourceClass}`}>
          {job.source || 'Unknown'}
        </span>
      </div>

      <div className="job-card__meta">
        <div className="job-card__meta-item">
          <span className="job-card__meta-icon">🏢</span>
          <span className="job-card__meta-text">
            {job.company || 'Company not specified'}
          </span>
        </div>
        <div className="job-card__meta-item">
          <span className="job-card__meta-icon">📍</span>
          <span className="job-card__meta-text">
            {job.location || 'Remote / Not specified'}
          </span>
        </div>
      </div>

      <div className="job-card__footer">
        {job.url ? (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="job-card__apply"
          >
            Apply Now
            <span className="job-card__apply-arrow">→</span>
          </a>
        ) : (
          <span className="job-card__apply" style={{ opacity: 0.5, cursor: 'default' }}>
            No Link Available
          </span>
        )}
      </div>
    </article>
  );
}

