import { Link, useParams, useLocation } from 'react-router-dom';
import { jobs } from '../data/mockJobs';
import { useState } from 'react';
import Toast from '../components/Toast';
import CompanyLogo from '../components/CompanyLogo';

export default function JobDetail() { 
  const { id } = useParams(); 
  const location = useLocation();
  const jobState = location.state?.job;
  const job = jobState || jobs.find(x => x.id === id) || jobs[0]; 
  const [toast, setToast] = useState(''); 
  const notify = m => { setToast(m); setTimeout(() => setToast(''), 2200); }; 

  const handleApply = () => {
    if (job.url && job.url !== '#') {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    } else {
      notify('Opening original application…');
    }
  };

  return (
    <main className="shell detail-page">
      <Link className="back-link" to="/jobs">← Back to jobs</Link>
      <div className="detail-grid">
        <section>
          <header className="detail-head">
            <CompanyLogo companyLogo={job.companyLogo} logo={job.logo} company={job.company} className="company-stamp large" />

            <div>
              <span className="source-chip">
                {job.direct ? 'Direct company listing' : `Aggregated from ${job.source}`}
              </span>
              <h1>{job.title}</h1>
              <p>{job.company} · {job.location} · {job.mode}</p>
              <small className="provenance">
                {job.sourceDomain || job.source} · Last verified {job.verified || 'recently'}
              </small>
            </div>
          </header>
          <div className="detail-highlights">
            <div><span>Salary range</span><b>{job.salary}</b></div>
            <div><span>Experience</span><b>{job.experience}</b></div>
            <div><span>Posted</span><b>{job.posted}</b></div>
          </div>
          <section className="detail-block">
            <h2>About this role</h2>
            <p>{job.description}</p>
          </section>
          <section className="detail-block">
            <h2>Skills that matter</h2>
            <div className="skill-row">
              {(job.skills || ['Communication', 'Problem solving']).map(x => <i key={x}>{x}</i>)}
            </div>
          </section>
          <section className="detail-block">
            <h2>Salary comparison</h2>
            <div className="salary-compare">
              <span>Market midpoint <b>₹18L</b></span>
              <div><i style={{ width: '74%' }}/></div>
              <small>This role’s estimate is above the market midpoint for similar roles.</small>
            </div>
          </section>
        </section>
        <aside className="apply-panel">
          <div className="match-score">
            <span>Your match</span>
            <strong>{job.score || 88}%</strong>
            <p>Strong overlap across skills, experience, and role preference.</p>
          </div>
          <button className="primary-button" onClick={handleApply}>
            Apply on Original Site <span>↗</span>
          </button>
          <button className="secondary-button" onClick={() => notify('Job saved to your workspace')}>
            Save job
          </button>
          <button className="plain-button" onClick={() => notify('Share link copied')}>
            Share opportunity
          </button>
          <hr/>
          <b>Company snapshot</b>
          <p>{job.company} is hiring across product, engineering, and data teams.</p>
        </aside>
      </div>
      <section className="similar">
        <div className="section-heading">
          <h2>Similar opportunities</h2>
          <Link className="text-button" to="/jobs">Browse all →</Link>
        </div>
        <div className="feature-grid">
          {jobs.filter(x => x.id !== job.id).slice(0, 3).map(x => (
            <Link to={`/jobs/${x.id}`} className="mini-job" key={x.id}>
              <span>{x.logo}</span>
              <b>{x.title}</b>
              <small>{x.company} · {x.salary}</small>
            </Link>
          ))}
        </div>
      </section>
      <Toast message={toast}/>
    </main>
  ); 
}

