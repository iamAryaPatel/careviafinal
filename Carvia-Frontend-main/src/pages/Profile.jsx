import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, profile, saveProfile, calculateProfileCompletion } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Carvia User';
  const initial = displayName.charAt(0).toUpperCase();

  const [tab, setTab] = useState('Profile');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

const [formData, setFormData] = useState({
  // Personal Information
  full_name: '',
  email: '',
  phone: '',
  location: '',
  date_of_birth: '',
  professional_headline: '',
  about_me: '',
  avatar_url: '',

  // Education
  education: '',
  degree: '',
  university: '',
  graduation_year: '',

  // Career
  experience_level: '',
  skills: '',
  preferred_roles: '',
  preferred_locations: '',
  work_preference: 'Hybrid',

  // Links
  resume_url: '',
  linkedin_url: '',
  github_url: '',
  portfolio_url: '',

  expected_salary: '',
  preferred_job_types: 'Full-time',
  preferred_salary_min: 0,
  preferred_salary_max: 0,
  preferred_work_mode: 'Hybrid',
  job_alerts_enabled: true,

  profile_visibility: 'Recruiters only',
  show_email: false,
  show_phone: false,
  allow_recruiter_contact: true,
});


  useEffect(() => {
    if (profile || user) {
    setFormData({
  // Personal Information
  full_name:
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    '',

  email: profile?.email || user?.email || '',
  phone: profile?.phone || '',
  location: profile?.location || '',
  date_of_birth: profile?.date_of_birth || '',
  professional_headline: profile?.professional_headline || '',
  about_me: profile?.about_me || '',

  avatar_url:
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    '',

  // Education
  education: profile?.education || '',
  degree: profile?.degree || '',
  university: profile?.university || '',
  graduation_year: profile?.graduation_year || '',

  // Career
  experience_level: profile?.experience_level || '',
  skills: profile?.skills || '',
  preferred_roles: profile?.preferred_roles || '',
  preferred_locations: profile?.preferred_locations || '',
  work_preference: profile?.work_preference || 'Hybrid',

  // Links
  resume_url: profile?.resume_url || '',
  linkedin_url: profile?.linkedin_url || '',
  github_url: profile?.github_url || '',
  portfolio_url: profile?.portfolio_url || '',

  expected_salary: profile?.expected_salary || '',

preferred_job_types:
  profile?.preferred_job_types || 'Full-time',

preferred_salary_min:
  profile?.preferred_salary_min || 0,

preferred_salary_max:
  profile?.preferred_salary_max || 0,

preferred_work_mode:
  profile?.preferred_work_mode || 'Hybrid',

job_alerts_enabled:
  profile?.job_alerts_enabled ?? true,

profile_visibility:
  profile?.profile_visibility || 'Recruiters only',

show_email:
  profile?.show_email ?? false,

show_phone:
  profile?.show_phone ?? false,

allow_recruiter_contact:
  profile?.allow_recruiter_contact ?? true,

});
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  if (!allowedTypes.includes(file.type)) {
    setToast('Only PDF, DOC, and DOCX files are allowed.');
    return;
  }

  // Maximum 5 MB
  if (file.size > 5 * 1024 * 1024) {
    setToast('Resume must be smaller than 5 MB.');
    return;
  }

  try {
    setToast('Uploading resume...');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setToast('Please login first.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/resume-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    const resumeUrl = data.publicUrl;

    setFormData((prev) => ({
      ...prev,
      resume_url: resumeUrl,
    }));

    // Save URL into profiles table
    await saveProfile({
      ...formData,
      resume_url: resumeUrl,
    });

    setToast('Resume uploaded successfully!');

  } catch (error) {
    console.error('Resume upload error:', error);
    setToast(error.message || 'Resume upload failed.');
  }
};

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile(formData);
      setToast('Profile updated successfully!');
      setTimeout(() => setToast(''), 2000);
    } catch (err) {
      setToast(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

    const getResumeFileName = () => {
    if (!formData.resume_url) return '';

    try {
      const url = new URL(formData.resume_url);
      const fileName = url.pathname.split('/').pop();
      return decodeURIComponent(fileName);
    } catch {
      return 'Uploaded Resume';
    }
  };

  const handleViewResume = () => {
    if (!formData.resume_url) {
      setToast('No resume uploaded yet.');
      return;
    }

    window.open(formData.resume_url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadResume = async () => {
    if (!formData.resume_url) {
      setToast('No resume uploaded yet.');
      return;
    }

    try {
      setToast('Preparing resume...');

      const response = await fetch(formData.resume_url);

      if (!response.ok) {
        throw new Error('Unable to download resume.');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = getResumeFileName() || 'resume';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);

      setToast('Resume downloaded successfully!');
    } catch (error) {
      console.error('Resume download error:', error);
      setToast('Download failed. Try View Resume instead.');
    }
  };

  const handleDeleteResume = async () => {
    if (!formData.resume_url) {
      setToast('No resume uploaded yet.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete your resume?'
    );

    if (!confirmed) return;

    try {
      setToast('Deleting resume...');

      const url = new URL(formData.resume_url);
      const marker = '/storage/v1/object/public/resumes/';

      if (url.pathname.includes(marker)) {
        const filePath = decodeURIComponent(
          url.pathname.split(marker)[1]
        );

        const { error: deleteError } = await supabase.storage
          .from('resumes')
          .remove([filePath]);

        if (deleteError) {
          throw deleteError;
        }
      }

      const updatedFormData = {
        ...formData,
        resume_url: '',
      };

      setFormData(updatedFormData);

      await saveProfile(updatedFormData);

      setToast('Resume deleted successfully!');
    } catch (error) {
      console.error('Resume delete error:', error);
      setToast(error.message || 'Failed to delete resume.');
    }
  };

  const completionPercentage = calculateProfileCompletion(formData);

  const skillsList = formData.skills
    ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : ['React', 'TypeScript', 'Node.js', 'UI/UX', 'SQL'];

  return (
    <main className="shell profile">
      <header className="profile-cover">
        <button className="cover-edit" onClick={() => setToast('Cover image selector opened')}>
          Edit cover
        </button>
        <div className="avatar" style={{ overflow: 'hidden', padding: 0 }}>
          {(formData.avatar_url || avatarUrl) ? (
            <img src={formData.avatar_url || avatarUrl} alt={displayName} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            initial
          )}
        </div>
      </header>

      <div className="profile-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>
            {displayName} <span>●</span>
          </h1>
          <p>{formData.experience_level || 'Member at Carvia Workspace'}</p>
          <small>
            {formData.location || user?.email || 'Global'} · Open to work
          </small>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          {/* Progress Completion Indicator */}
          <div
            style={{
              background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
              border: '1px solid var(--line, rgba(255, 255, 255, 0.1))',
              borderRadius: '10px',
              padding: '10px 16px',
              minWidth: '220px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
              <span>Profile Status</span>
              <span style={{ color: 'var(--accent, #6366f1)', fontWeight: 700 }}>Profile {completionPercentage}% complete</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          <button className="secondary-button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>

      <nav className="profile-tabs">
        {['Profile', 'Resume', 'Preferences', 'Visibility'].map((x) => (
          <button key={x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)}>
            {x}
          </button>
        ))}
      </nav>

      {tab === 'Profile' ? (
        <div className="profile-layout">
          <section className="form-panel">
            <h2>Personal Information</h2>

<div className="two-inputs">
  <label>
    Full Name
    <input
      name="full_name"
      value={formData.full_name}
      onChange={handleChange}
      placeholder="Your full name"
    />
  </label>

  <label>
    Professional Headline
    <input
      name="professional_headline"
      value={formData.professional_headline}
      onChange={handleChange}
      placeholder="AI Engineer | Full Stack Developer"
    />
  </label>
</div>

<div className="two-inputs">
  <label>
    Email Address
    <input
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="your@email.com"
    />
  </label>

  <label>
    Phone Number
    <input
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="+91 9876543210"
    />
  </label>
</div>

<div className="two-inputs">
  <label>
    Location
    <input
      name="location"
      value={formData.location}
      onChange={handleChange}
      placeholder="Delhi, India"
    />
  </label>

  <label>
    Date of Birth
    <input
      name="date_of_birth"
      type="date"
      value={formData.date_of_birth}
      onChange={handleChange}
    />
  </label>
</div>

<label>
  Profile Photo URL
  <input
    name="avatar_url"
    value={formData.avatar_url}
    onChange={handleChange}
    placeholder="https://example.com/profile.jpg"
  />
</label>

<label>
  About Me
  <textarea
    name="about_me"
    value={formData.about_me}
    onChange={handleChange}
    placeholder="Tell employers about yourself, your experience, skills and career goals..."
    rows="5"
  />
</label>
            
            <h2>Education</h2>
            <div className="two-inputs">
              <label>
                Highest Education
                <input name="education" value={formData.education} onChange={handleChange} placeholder="Bachelor's / Master's" />
              </label>
              <label>
                Degree
                <input name="degree" value={formData.degree} onChange={handleChange} placeholder="B.S. Computer Science" />
              </label>
            </div>
            <div className="two-inputs">
              <label>
                University / School
                <input name="university" value={formData.university} onChange={handleChange} placeholder="Stanford University" />
              </label>
              <label>
                Graduation Year
                <input name="graduation_year" value={formData.graduation_year} onChange={handleChange} placeholder="2024" />
              </label>
            </div>

            <h2>Career Preferences & Skills</h2>
            <div className="two-inputs">
              <label>
                Experience Level
                <input name="experience_level" value={formData.experience_level} onChange={handleChange} placeholder="Mid-Level (3-5 yrs)" />
              </label>
              <label>
                Work Preference
                <select
                  name="work_preference"
                  value={formData.work_preference}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg, #0f172a)', color: 'var(--text)', border: '1px solid var(--line)' }}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </label>
            </div>
            <div className="two-inputs">
              <label>
                Preferred Roles
                <input name="preferred_roles" value={formData.preferred_roles} onChange={handleChange} placeholder="Frontend Engineer, React Developer" />
              </label>
              <label>
                Preferred Locations
                <input name="preferred_locations" value={formData.preferred_locations} onChange={handleChange} placeholder="Remote, New York, London" />
              </label>
            </div>

            <label>
              Skills (comma separated)
              <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js, SQL" />
            </label>

            <div className="skill-row" style={{ marginTop: '12px' }}>
              {skillsList.map((x) => (
                <i key={x}>{x}</i>
              ))}
            </div>

            <h2>Links & Portfolio</h2>
            <div className="two-inputs">
              <label>
                Resume URL
                <input name="resume_url" value={formData.resume_url} onChange={handleChange} placeholder="https://drive.google.com/..." />
              </label>
              <label>
                LinkedIn URL
                <input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
              </label>
            </div>
            <div className="two-inputs">
              <label>
                GitHub URL
                <input name="github_url" value={formData.github_url} onChange={handleChange} placeholder="https://github.com/..." />
              </label>
              <label>
                Portfolio URL
                <input name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button className="primary-button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving Changes…' : 'Save Changes'}
              </button>
            </div>
          </section>
      <div
  className="dropzone"
  onClick={() => document.getElementById('resume-upload').click()}
>
  <span>↑</span>

  <b>
    {formData.resume_url
      ? 'Resume uploaded — click to replace'
      : 'Upload your Resume'}
  </b>

  <small>PDF, DOC or DOCX • Maximum 5 MB</small>

  <input
    id="resume-upload"
    type="file"
    
    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    onChange={handleResumeUpload}
    style={{ display: 'none' }}
  />
</div>
          <aside className="resume-panel">
            <div className="eyebrow">Resume intelligence</div>
            <h2>Your resume is active.</h2>
        
            <div className="ai-note">
              <b>Match readiness: {completionPercentage}%</b>
              <p>Complete your profile fields and add key technical skills to maximize your job match score.</p>
            </div>
          </aside>
        </div>
            ) : tab === 'Resume' ? (
        <section className="dashboard-panel" style={{ padding: '28px' }}>
          <div className="panel-head">
            <div>
              <div className="eyebrow">Resume Management</div>
              <h2 style={{ marginTop: '6px' }}>Your Resume</h2>
            </div>

            {formData.resume_url && (
              <span
                style={{
                  padding: '7px 12px',
                  borderRadius: '999px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: '#22c55e',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                ✓ Uploaded
              </span>
            )}
          </div>

          {formData.resume_url ? (
            <div
              style={{
                marginTop: '24px',
                padding: '22px',
                border: '1px solid var(--line, #263244)',
                borderRadius: '14px',
                background: 'var(--card-bg, rgba(255,255,255,0.03))',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(37, 99, 235, 0.12)',
                    fontSize: '24px',
                  }}
                >
                  📄
                </div>

                <div>
                  <h3 style={{ margin: 0 }}>
                    {getResumeFileName()}
                  </h3>

                  <p
                    style={{
                      margin: '5px 0 0',
                      color: 'var(--muted, #94a3b8)',
                      fontSize: '13px',
                    }}
                  >
                    Your resume is uploaded and ready to use.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  className="secondary-button"
                  onClick={handleViewResume}
                >
                  👁 View Resume
                </button>

                <button
                  className="secondary-button"
                  onClick={handleDownloadResume}
                >
                  ↓ Download
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                document.getElementById('resume-upload-tab').click()
              }
                >
                  ↻ Replace Resume
                </button>

                <button
                  className="secondary-button"
                  onClick={handleDeleteResume}
                  style={{
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: '24px',
                padding: '40px 24px',
                textAlign: 'center',
                border: '1px dashed var(--line, #334155)',
                borderRadius: '14px',
              }}
            >
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>
                📄
              </div>

              <h3>No resume uploaded yet</h3>

              <p
                style={{
                  color: 'var(--muted, #94a3b8)',
                  marginBottom: '20px',
                }}
              >
                Upload your latest resume to keep it ready for job
                applications.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  document.getElementById('resume-upload-tab').click()
                }
              >
                ↑ Upload Resume
              </button>
            </div>
          )}

          {/* Hidden upload input */}
          <input
            id="resume-upload-tab"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleResumeUpload}
            style={{ display: 'none' }}
          />
        </section>
      ) : tab === 'Preferences' ? (
  <section className="dashboard-panel" style={{ padding: '28px' }}>
    <div className="panel-head">
      <div>
        <div className="eyebrow">Career Preferences</div>
        <h2 style={{ marginTop: '6px' }}>Job Preferences</h2>
        <p style={{ color: 'var(--muted, #94a3b8)' }}>
          Set your preferred job type, salary range and work mode.
        </p>
      </div>
    </div>

    <div className="two-inputs" style={{ marginTop: '24px' }}>
      <label>
        Preferred Job Type
        <select
          name="preferred_job_types"
          value={formData.preferred_job_types}
          onChange={handleChange}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
        </select>
      </label>

      <label>
        Preferred Work Mode
        <select
          name="preferred_work_mode"
          value={formData.preferred_work_mode}
          onChange={handleChange}
        >
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </label>
    </div>

    <div className="two-inputs" style={{ marginTop: '18px' }}>
      <label>
        Minimum Salary (₹)
        <input
          type="number"
          name="preferred_salary_min"
          value={formData.preferred_salary_min}
          onChange={handleChange}
          placeholder="300000"
          min="0"
        />
      </label>

      <label>
        Maximum Salary (₹)
        <input
          type="number"
          name="preferred_salary_max"
          value={formData.preferred_salary_max}
          onChange={handleChange}
          placeholder="1200000"
          min="0"
        />
      </label>
    </div>

    <div
      style={{
        marginTop: '24px',
        padding: '18px',
        border: '1px solid var(--line, #263244)',
        borderRadius: '12px',
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          name="job_alerts_enabled"
          checked={formData.job_alerts_enabled}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              job_alerts_enabled: e.target.checked,
            }))
          }
          style={{ width: '18px', height: '18px' }}
        />

        <span>
          <strong>Job Alerts</strong>
          <br />
          <small style={{ color: 'var(--muted, #94a3b8)' }}>
            Receive alerts for jobs matching your preferences.
          </small>
        </span>
      </label>
    </div>

    <div style={{ marginTop: '24px' }}>
      <button
        className="primary-button"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save Preferences'}
      </button>
    </div>
  </section>
) : tab === 'Visibility' ? (
  <section className="dashboard-panel" style={{ padding: '28px' }}>
    <div className="panel-head">
      <div>
        <div className="eyebrow">Privacy & Visibility</div>
        <h2 style={{ marginTop: '6px' }}>Profile Visibility</h2>
        <p style={{ color: 'var(--muted, #94a3b8)' }}>
          Control who can see your profile and contact information.
        </p>
      </div>
    </div>

    <div style={{ marginTop: '24px' }}>
      <label>
        Profile Visibility
        <select
          name="profile_visibility"
          value={formData.profile_visibility}
          onChange={handleChange}
        >
          <option value="Recruiters only">Recruiters only</option>
          <option value="Everyone">Everyone</option>
          <option value="Private">Private</option>
        </select>
      </label>
    </div>

    <div className="visibility-option">
  <label
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '14px',
      width: '100%',
      margin: 0,
      cursor: 'pointer',
    }}
  >
    <input
      type="checkbox"
      checked={formData.show_email}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          show_email: e.target.checked,
        }))
      }
      style={{
        width: '18px',
        height: '18px',
        flexShrink: 0,
        margin: 0,
      }}
    />

    <span>
      <strong>Show my email address</strong>
      <small>Allow recruiters to see your email address.</small>
    </span>
  </label>
</div>

<div className="visibility-option">
  <label
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '14px',
      width: '100%',
      margin: 0,
      cursor: 'pointer',
    }}
  >
    <input
      type="checkbox"
      checked={formData.show_phone}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          show_phone: e.target.checked,
        }))
      }
      style={{
        width: '18px',
        height: '18px',
        flexShrink: 0,
        margin: 0,
      }}
    />

    <span>
      <strong>Show my phone number</strong>
      <small>Allow recruiters to see your phone number.</small>
    </span>
  </label>
</div>

<div className="visibility-option">
  <label
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '14px',
      width: '100%',
      margin: 0,
      cursor: 'pointer',
    }}
  >
    <input
      type="checkbox"
      checked={formData.allow_recruiter_contact}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          allow_recruiter_contact: e.target.checked,
        }))
      }
      style={{
        width: '18px',
        height: '18px',
        flexShrink: 0,
        margin: 0,
      }}
    />

    <span>
      <strong>Allow recruiters to contact me</strong>
      <small>Allow recruiters to contact you about suitable jobs.</small>
    </span>
  </label>
</div>

<div style={{ marginTop: '24px' }}>
  <button
    className="primary-button"
    onClick={handleSave}
    disabled={saving}
  >
    {saving ? 'Saving…' : 'Save Visibility Settings'}
  </button>
</div>
</section>
) : (
  <div className="empty-state">
    <b>{tab} settings</b>
    <p>
      This section is saved and managed within your Carvia account settings.
    </p>
  </div>
)}
</main>
);
}
