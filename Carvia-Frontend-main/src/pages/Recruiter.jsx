import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import Toast from '../components/Toast';

const candidateVisibility = {
  Public: true,
  'Recruiters only': true,
  Private: false,
};
const emptyForm = {
  title: '',
  company: '',
  category: '',
  description: '',
  responsibilities: '',
  qualifications: '',
  skills: '',
  location: '',
  workplace_type: 'On-site',
  employment_type: 'Full-time',
  experience_level: 'Fresher',
  openings: '1',
  salary: '',
  preferred_education: '',
  application_deadline: '',
  apply_url: '',
  recruiter_email: '',
  company_website: '',
  benefits: '',
};

export default function Recruiter() {
  const [toast, setToast] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [candidates, setCandidates] = useState([]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  // Load recruiter's jobs
  const loadJobs = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setJobs([]);
      return;
    }

    const { data, error } = await supabase
      .from('recruiter_jobs')
      .select('*')
      .eq('recruiter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load recruiter jobs:', error);
      notify('Failed to load your jobs');
      return;
    }

    setJobs(data || []);
  } catch (error) {
    console.error(error);
    notify('Something went wrong');
  }
};

const loadCandidates = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        professional_headline,
        experience_level,
        skills,
        location,
        profile_visibility,
        show_email,
        show_phone,
        allow_recruiter_contact
      `)
      .in('profile_visibility', ['Public', 'Recruiters only'])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to load candidates:', error);
      notify('Failed to load candidates');
      return;
    }

    setCandidates(data || []);
  } catch (error) {
    console.error(error);
    notify('Failed to load candidates');
  }
};

useEffect(() => {
  loadJobs();
  loadCandidates();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.company.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.apply_url.trim()
    ) {
      notify('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        notify('Please login as a recruiter first');
        return;
      }

    const { data, error } = await supabase
  .from('recruiter_jobs')
  .insert([
    {
      recruiter_id: user.id,

      title: form.title.trim(),
      company: form.company.trim(),
      category: form.category.trim(),

      description: form.description.trim(),
      responsibilities: form.responsibilities.trim(),
      qualifications: form.qualifications.trim(),
      skills: form.skills.trim(),

      location: form.location.trim(),
      workplace_type: form.workplace_type,
      employment_type: form.employment_type,
      experience_level: form.experience_level,

      openings: Number(form.openings) || 1,
      salary: form.salary.trim(),
      preferred_education: form.preferred_education.trim(),

      application_deadline:
        form.application_deadline || null,

      apply_url: form.apply_url.trim(),
      recruiter_email: form.recruiter_email.trim(),
      company_website: form.company_website.trim(),
      benefits: form.benefits.trim(),

      is_active: true,
    },
  ])
        .select()
        .single();

      if (error) {
        console.error('Job posting error:', error);
        notify(error.message || 'Failed to post job');
        return;
      }

      setJobs((previous) => [data, ...previous]);

      setForm(emptyForm);
      setShowForm(false);

      notify('Job posted successfully!');
    } catch (error) {
      console.error(error);
      notify('Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  const formatPostedDate = (date) => {
    if (!date) return 'Recently';

    const created = new Date(date);
    const now = new Date();

    const difference = now.getTime() - created.getTime();
    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);

    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;

    return created.toLocaleDateString();
  };

  return (
    <main className="shell dashboard recruiter">
      <header className="dashboard-head">
        <div>
          <div className="eyebrow">
            <i /> Recruiter console
          </div>

          <h1>Hiring, without the busywork.</h1>

          <p>
            Manage listings, candidates, and your recruiting pipeline in one
            focused workspace.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          Post a job +
        </button>
      </header>
 
      {/* STATS */}
      <div className="recruiter-stats">
        <div>
          <b>{jobs.filter((job) => job.is_active).length}</b>
          <span>Live jobs</span>
        </div>

        <div>
          <b>86</b>
          <span>New candidates</span>
        </div>

        <div>
          <b>24</b>
          <span>Shortlisted</span>
        </div>

        <div>
          <b>09</b>
          <span>Interviews this week</span>
        </div>
      </div>

      {/* ACTIVE LISTINGS */}
      <section className="dashboard-panel listing-table">
        <div className="panel-head">
          <h2>Active listings</h2>

          <button onClick={loadJobs}>
            Refresh
          </button>
        </div>

        {jobs.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <h3 style={{ marginBottom: '8px', color: '#e5e7eb' }}>
              No jobs posted yet
            </h3>

            <p style={{ marginBottom: '20px' }}>
              Click “Post a job +” to create your first job listing.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              Post your first job +
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <div className="listing-row" key={job.id}>
              <div>
                <b>{job.title}</b>

                <small>
                  {job.company} · {formatPostedDate(job.created_at)}
                </small>
              </div>

              <span
                className={
                  job.is_active
                    ? 'status-live'
                    : 'status-draft'
                }
              >
                {job.is_active ? 'Live' : 'Draft'}
              </span>

              <span>
                {job.workplace_type}
              </span>

              <button
                onClick={() =>
                  notify(`${job.title} is live`)
                }
              >
                Manage →
              </button>
            </div>
          ))
        )}
      </section>

      {/* OTHER DASHBOARD CONTENT */}
      <div className="dash-grid">
        <div className="dashboard-panel">
          <div className="panel-head">
            <h2>Candidate quality</h2>
            <button onClick={() => notify('Candidate pipeline opened')}>
              View pipeline
            </button>
          </div>

        <div className="candidate-list">
  {candidates.length === 0 ? (
    <div className="empty-state">
      <b>No visible candidates yet</b>
      <p>Candidates who make their profiles visible will appear here.</p>
    </div>
  ) : (
    candidates.map((candidate) => (
      <div className="candidate-card" key={candidate.id}>
        <div>
          <h3>{candidate.full_name || 'Candidate'}</h3>

          <p>
            {candidate.professional_headline ||
              candidate.experience_level ||
              'Job Seeker'}
          </p>

          <p>
            📍 {candidate.location || 'Location not provided'}
          </p>

          <p>
            🛠️ {candidate.skills || 'Skills not provided'}
          </p>
        </div>

        <div>
          {candidate.allow_recruiter_contact && (
            <span className="candidate-badge">
              Open to contact
            </span>
          )}
        </div>
      </div>
    ))
  )}
</div> 
</div> 

        <div className="dashboard-panel">
          <div className="panel-head">
            <h2>Source performance</h2>

            <button
              onClick={() =>
                notify('Source details opened')
              }
            >
              Details
            </button>
          </div>

          <div className="source-stat">
            <span>LinkedIn</span>
            <i style={{ width: '82%' }} />
            <b>41</b>
          </div>

          <div className="source-stat">
            <span>Direct</span>
            <i style={{ width: '61%' }} />
            <b>30</b>
          </div>

          <div className="source-stat">
            <span>Referrals</span>
            <i style={{ width: '42%' }} />
            <b>19</b>
          </div>
        </div>
      </div>

      {/* POST JOB MODAL */}
      {showForm && (
        <div
  onClick={() => !saving && setShowForm(false)}
  style={{
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    background: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 20px',
    overflowY: 'auto',
  }}
>

        <div
  onClick={(e) => e.stopPropagation()}
  style={{
    width: '100%',
    maxWidth: '720px',
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    background: '#11141b',
    border: '1px solid #2b3442',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 25px 80px rgba(0,0,0,0.45)',
    color: '#f8fafc',
  }}
>
            {/* FORM HEADER */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#60a5fa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6px',
                  }}
                >
                  Create listing
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: '28px',
                  }}
                >
                  Post a new job
                </h2>

                <p
                  style={{
                    margin: '7px 0 0',
                    color: '#94a3b8',
                    fontSize: '14px',
                  }}
                >
                  Add the details candidates need to apply.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => setShowForm(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  background: '#1a1f29',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ×
              </button>
            </div>

           {/* FORM */}
<form
  onSubmit={handleSubmit}
  className="recruiter-post-job-form"
>
  {/* JOB INFORMATION */}
  <div style={{ marginBottom: '28px' }}>
    <h3 style={{
      margin: '0 0 16px',
      fontSize: '16px',
      color: '#60a5fa'
    }}>
      Job Information
    </h3>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px'
    }}>

      {/* JOB TITLE */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Job Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. AI Engineer"
          required
        />
      </div>

      {/* COMPANY */}
      <div>
        <label>Company Name *</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="e.g. Carvia Technologies"
          required
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label>Job Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="AI / Machine Learning">
            AI / Machine Learning
          </option>
          <option value="Software Development">
            Software Development
          </option>
          <option value="Data Science">
            Data Science
          </option>
          <option value="Data Engineering">
            Data Engineering
          </option>
          <option value="Web Development">
            Web Development
          </option>
          <option value="UI / UX Design">
            UI / UX Design
          </option>
          <option value="Cyber Security">
            Cyber Security
          </option>
          <option value="Marketing">
            Marketing
          </option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* DESCRIPTION */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Job Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the role and what the candidate will work on..."
          rows={5}
          required
        />
      </div>

      {/* RESPONSIBILITIES */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Responsibilities</label>
        <textarea
          name="responsibilities"
          value={form.responsibilities}
          onChange={handleChange}
          placeholder={
            "• Build and maintain applications\n" +
            "• Collaborate with engineering teams\n" +
            "• Develop and improve features"
          }
          rows={5}
        />
      </div>

      {/* QUALIFICATIONS */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Required Qualifications</label>
        <textarea
          name="qualifications"
          value={form.qualifications}
          onChange={handleChange}
          placeholder={
            "e.g. B.Tech / B.E. in Computer Science\n" +
            "Strong programming fundamentals\n" +
            "Good problem-solving skills"
          }
          rows={4}
        />
      </div>

      {/* SKILLS */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Required Skills</label>
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Python, SQL, React, Machine Learning"
        />
      </div>

    </div>
  </div>


  {/* WORK DETAILS */}
  <div style={{ marginBottom: '28px' }}>
    <h3 style={{
      margin: '0 0 16px',
      fontSize: '16px',
      color: '#60a5fa'
    }}>
      Work Details
    </h3>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px'
    }}>

      {/* LOCATION */}
      <div>
        <label>Location *</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Bengaluru, India"
          required
        />
      </div>

      {/* WORK MODE */}
      <div>
        <label>Work Mode *</label>
        <select
          name="workplace_type"
          value={form.workplace_type}
          onChange={handleChange}
        >
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* EMPLOYMENT */}
      <div>
        <label>Employment Type</label>
        <select
          name="employment_type"
          value={form.employment_type}
          onChange={handleChange}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {/* EXPERIENCE */}
      <div>
        <label>Experience Level</label>
        <select
          name="experience_level"
          value={form.experience_level}
          onChange={handleChange}
        >
          <option value="Fresher">Fresher</option>
          <option value="1–3 years">1–3 years</option>
          <option value="3–5 years">3–5 years</option>
          <option value="5+ years">5+ years</option>
        </select>
      </div>

      {/* OPENINGS */}
      <div>
        <label>Number of Openings</label>
        <input
          type="number"
          name="openings"
          value={form.openings}
          onChange={handleChange}
          min="1"
          placeholder="e.g. 2"
        />
      </div>

      {/* SALARY */}
      <div>
        <label>Salary / CTC</label>
        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="e.g. ₹6L - ₹10L"
        />
      </div>

      {/* EDUCATION */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Preferred Education</label>
        <input
          name="preferred_education"
          value={form.preferred_education}
          onChange={handleChange}
          placeholder="e.g. B.Tech / B.E. / MCA"
        />
      </div>

      {/* BENEFITS */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Benefits & Perks</label>
        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          placeholder="e.g. Health insurance, work from home, flexible hours"
          rows={3}
        />
      </div>

    </div>
  </div>


  {/* APPLICATION DETAILS */}
  <div style={{ marginBottom: '10px' }}>
    <h3 style={{
      margin: '0 0 16px',
      fontSize: '16px',
      color: '#60a5fa'
    }}>
      Application Details
    </h3>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px'
    }}>

      {/* DEADLINE */}
      <div>
        <label>Application Deadline</label>
        <input
          type="date"
          name="application_deadline"
          value={form.application_deadline}
          onChange={handleChange}
        />
      </div>

      {/* EMAIL */}
      <div>
        <label>Recruiter Email</label>
        <input
          type="email"
          name="recruiter_email"
          value={form.recruiter_email}
          onChange={handleChange}
          placeholder="hr@company.com"
        />
      </div>

      {/* APPLY URL */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Application URL *</label>
        <input
          type="url"
          name="apply_url"
          value={form.apply_url}
          onChange={handleChange}
          placeholder="https://company.com/careers/job"
          required
        />
      </div>

      {/* COMPANY WEBSITE */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Company Website</label>
        <input
          type="url"
          name="company_website"
          value={form.company_website}
          onChange={handleChange}
          placeholder="https://company.com"
        />
      </div>

    </div>
  </div>


  {/* BUTTONS */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid #27303d'
    }}
  >
    <button
      type="button"
      disabled={saving}
      onClick={() => setShowForm(false)}
      style={{
        padding: '11px 20px',
        borderRadius: '10px',
        border: '1px solid #334155',
        background: '#1a1f29',
        color: '#cbd5e1',
        cursor: 'pointer'
      }}
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={saving}
      className="primary-button"
      style={{
        minWidth: '140px'
      }}
    >
      {saving ? 'Posting...' : 'Post Job'}
    </button>
  </div>

</form>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </main>
  );
}