import { jobs, activity } from '../data/mockJobs';
import { Link } from 'react-router-dom';
import CompanyLogo from '../components/CompanyLogo';
import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Arya';

  return <main className="shell dashboard"><header className="dashboard-head"><div><div className="eyebrow"><i/> Candidate workspace</div><h1>Welcome back, {displayName.split(' ')[0]}.</h1><p>Here’s the signal worth acting on today.</p></div><Link className="primary-button" to="/jobs">Find new jobs →</Link></header><div className="progress-card"><div><span>Profile strength</span><b>72%</b><p>Add one project and a work preference to make your matches more precise.</p></div><div className="progress-track"><i/></div><Link to="/profile">Complete profile →</Link></div><Link to="/ai-assistant" className="career-assistant-card">
  <div className="career-assistant-content">
    <span className="assistant-label">Career Assistant</span>
    <h2>Get guidance for your next career move</h2>
    <p>
      Find relevant jobs, identify skill gaps, and get personalized career advice.
    </p>
    <span className="assistant-action">Talk to Career Assistant →</span>
  </div>

  <div className="assistant-icon">
    ✦
  </div>
</Link><section className="dash-grid"><div className="dashboard-panel recommendations"><div className="panel-head"><h2>Recommended for you</h2><Link to="/jobs">See all</Link></div>{jobs.slice(0,3).map(j=><Link className="dash-job" key={j.id} to={`/jobs/${j.id}`}><CompanyLogo companyLogo={j.companyLogo} logo={j.logo} company={j.company} /><div><b>{j.title}</b><small>{j.company} · {j.location}</small></div><strong>{j.score}%</strong></Link>)}</div><div className="dashboard-panel"><div className="panel-head"><h2>Application pulse</h2><button>View report</button></div><div className="funnel"><div><b>08</b><span>Saved</span></div><div><b>04</b><span>Applied</span></div><div><b>02</b><span>In review</span></div><div><b>01</b><span>Interviews</span></div></div><div className="chart-bars">{[35,52,43,75,55,90,64].map((x,i)=><i key={i} style={{height:`${x}%`}}/> )}</div></div><div className="dashboard-panel"><div className="panel-head"><h2>Resume status</h2><span className="status-live">Ready</span></div><div className="resume-mini"><span>PDF</span><div><b>{displayName.split(' ')[0]}_Resume.pdf</b><small>Updated 2 days ago · 324 KB</small></div></div><button className="secondary-button">Replace resume</button></div><div className="dashboard-panel"><div className="panel-head"><h2>Activity</h2><button>All notifications</button></div>{activity.map(([t,s,time])=><div className="activity" key={t}><i/><div><b>{t}</b><small>{s}</small></div><time>{time}</time></div>)}</div></section></main>;
}


