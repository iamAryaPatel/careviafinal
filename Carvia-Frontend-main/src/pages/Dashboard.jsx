import { jobs, activity } from '../data/mockJobs';
import { Link } from 'react-router-dom';
import CompanyLogo from '../components/CompanyLogo';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, profile } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Arya';

  const hasResume = Boolean(profile?.resume_url);

  return (
    <main className="shell dashboard">

      {/* Header */}
      <header className="dashboard-head">
        <div>
          <div className="eyebrow">
            <i /> Candidate workspace
          </div>

          <h1>
            Welcome back, {displayName.split(' ')[0]}.
          </h1>

          <p>Here’s the signal worth acting on today.</p>
        </div>

        <Link className="primary-button" to="/jobs">
          Find new jobs →
        </Link>
      </header>


      {/* Profile Progress */}
      <div className="progress-card">
        <div>
          <span>Profile strength</span>
          <b>72%</b>
          <p>
            Add one project and a work preference to make your matches more
            precise.
          </p>
        </div>

        <div className="progress-track">
          <i />
        </div>

        <Link to="/profile">
          Complete profile →
        </Link>
      </div>


      {/* Career Assistant */}
      <Link to="/ai-assistant" className="career-assistant-card">
        <div className="career-assistant-content">
          <span className="assistant-label">
            Career Assistant
          </span>

          <h2>
            Get guidance for your next career move
          </h2>

          <p>
            Find relevant jobs, identify skill gaps, and get personalized
            career advice.
          </p>

          <span className="assistant-action">
            Talk to Career Assistant →
          </span>
        </div>

        <div className="assistant-icon">
          ✦
        </div>
      </Link>


      {/* Dashboard Grid */}
      <section className="dash-grid">

        {/* Recommended Jobs */}
        <div className="dashboard-panel recommendations">
          <div className="panel-head">
            <h2>Recommended for you</h2>
            <Link to="/jobs">See all</Link>
          </div>

          {jobs.slice(0, 3).map((j) => (
            <Link
              className="dash-job"
              key={j.id}
              to={`/jobs/${j.id}`}
            >
              <CompanyLogo
                companyLogo={j.companyLogo}
                logo={j.logo}
                company={j.company}
              />

              <div>
                <b>{j.title}</b>
                <small>
                  {j.company} · {j.location}
                </small>
              </div>

              <strong>{j.score}%</strong>
            </Link>
          ))}
        </div>


        {/* Application Pulse */}
        <div className="dashboard-panel">
          <div className="panel-head">
            <h2>Application pulse</h2>
            <button>View report</button>
          </div>

          <div className="funnel">
            <div>
              <b>08</b>
              <span>Saved</span>
            </div>

            <div>
              <b>04</b>
              <span>Applied</span>
            </div>

            <div>
              <b>02</b>
              <span>In review</span>
            </div>

            <div>
              <b>01</b>
              <span>Interviews</span>
            </div>
          </div>

          <div className="chart-bars">
            {[35, 52, 43, 75, 55, 90, 64].map((x, i) => (
              <i
                key={i}
                style={{ height: `${x}%` }}
              />
            ))}
          </div>
        </div>


        {/* Resume Status */}
        <div className="dashboard-panel">
          <div className="panel-head">
            <h2>Resume status</h2>

            <span className="status-live">
              {hasResume ? 'Ready' : 'Not uploaded'}
            </span>
          </div>

          <div className="resume-mini">
            <span>PDF</span>

            <div>
              <b>
                {hasResume
                  ? `${displayName.split(' ')[0]}_Resume.pdf`
                  : 'No resume uploaded'}
              </b>

              <small>
                {hasResume
                  ? 'Resume uploaded and ready to use'
                  : 'Upload your resume to apply faster'}
              </small>
            </div>
          </div>

        {/* Resume Buttons */}
<div
  style={{
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap'
  }}
>
  <Link
    to="/profile"
    className="secondary-button"
  >
    👁 View Resume
  </Link>

  <Link
    to="/profile"
    className="secondary-button"
  >
    ↻ Replace Resume
  </Link>
</div>
        </div>


        {/* Activity */}
        <div className="dashboard-panel">
          <div className="panel-head">
            <h2>Activity</h2>
            <button>All notifications</button>
          </div>

          {activity.map(([t, s, time]) => (
            <div className="activity" key={t}>
              <i />

              <div>
                <b>{t}</b>
                <small>{s}</small>
              </div>

              <time>{time}</time>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}