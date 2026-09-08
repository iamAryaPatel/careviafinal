import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfile() {
  const {
    user,
    profile,
    saveProfile,
    calculateProfileCompletion,
    isProfileComplete,
  } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [errors, setErrors] = useState({});
  const [educationDetails, setEducationDetails] = useState(
  
  profile?.education_details || [
    {
      highest_education: "Bachelor's Degree",
      degree: '',
      field_of_study: '',
      university: '',
      start_year: '',
      graduation_year: '',
      grade: '',
    },
  ]
);
const [preferredRoles, setPreferredRoles] = useState(
  profile?.preferred_roles_details || []
);

const [newRole, setNewRole] = useState('');
const [preferredLocations, setPreferredLocations] = useState(
  profile?.preferred_locations_details || []
);

const [newLocation, setNewLocation] = useState('');
const [newCountry, setNewCountry] = useState('');
const [newCity, setNewCity] = useState('');

const addCountry = () => {
  const country = newCountry.trim();
  if (!country) return;

  if (preferredLocations.some((item) => item.country === country)) {
    setNewCountry('');
    return;
  }

  setPreferredLocations((prev) => [
    ...prev,
    {
      country,
      cities: [],
    },
  ]);

  setNewCountry('');
};

const removeCountry = (index) => {
  setPreferredLocations((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

const addCity = (countryIndex) => {
  const city = newCity.trim();
  if (!city) return;

  setPreferredLocations((prev) =>
    prev.map((item, index) => {
      if (index !== countryIndex) return item;

      if (item.cities.includes(city)) return item;

      return {
        ...item,
        cities: [...item.cities, city],
      };
    })
  );

  setNewCity('');
};

const removeCity = (countryIndex, cityIndex) => {
  setPreferredLocations((prev) =>
    prev.map((item, index) => {
      if (index !== countryIndex) return item;

      return {
        ...item,
        cities: item.cities.filter((_, i) => i !== cityIndex),
      };
    })
  );
};
const addPreferredRole = () => {
  const role = newRole.trim();

  if (!role) return;

  if (preferredRoles.includes(role)) {
    setNewRole('');
    return;
  }

  setPreferredRoles((prev) => [...prev, role]);
  setNewRole('');
};

const removePreferredRole = (index) => {
  setPreferredRoles((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

const addEducation = () => {
  setEducationDetails((prev) => [
    ...prev,
    {
      highest_education: "Bachelor's Degree",
      degree: '',
      field_of_study: '',
      university: '',
      start_year: '',
      graduation_year: '',
      grade: '',
    },
  ]);
};

const removeEducation = (index) => {
  setEducationDetails((prev) => prev.filter((_, i) => i !== index));
};

const updateEducation = (index, field, value) => {
  setEducationDetails((prev) =>
    prev.map((education, i) =>
      i === index
        ? { ...education, [field]: value }
        : education
    )
  );
};

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',

    date_of_birth: profile?.date_of_birth || '',
    professional_headline: profile?.professional_headline || '',
    about_me: profile?.about_me || '',
    education: profile?.education || "Bachelor's Degree",
    degree: profile?.degree || '',
    university: profile?.university || '',
    graduation_year: profile?.graduation_year || '',
    experience_level: profile?.experience_level || 'Entry Level (0-1 yr)',
    skills: profile?.skills || '',
    preferred_roles: profile?.preferred_roles || '',
    preferred_locations: profile?.preferred_locations || '',
    work_preference: profile?.work_preference || 'Hybrid',
    resume_url: profile?.resume_url || '',
    linkedin_url: profile?.linkedin_url || '',
    github_url: profile?.github_url || '',
    portfolio_url: profile?.portfolio_url || '',
    expected_salary: profile?.expected_salary || '',
    avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || '',
  });
      useEffect(() => {
  if (profile) {
    setFormData((prev) => ({
      ...prev,
      full_name: profile.full_name || prev.full_name,
      email: profile.email || prev.email,
      phone: profile.phone || prev.phone,
      location: profile.location || prev.location,
      date_of_birth: profile.date_of_birth || prev.date_of_birth,
      professional_headline: profile.professional_headline || prev.professional_headline,
      about_me: profile.about_me || prev.about_me,
      education: profile.education || prev.education,
      degree: profile.degree || prev.degree,
      university: profile.university || prev.university,
      graduation_year: profile.graduation_year || prev.graduation_year,
      experience_level: profile.experience_level || prev.experience_level,
      skills: profile.skills || prev.skills,
      preferred_roles: profile.preferred_roles || prev.preferred_roles,
      preferred_locations: profile.preferred_locations || prev.preferred_locations,
      work_preference: profile.work_preference || prev.work_preference,
      resume_url: profile.resume_url || prev.resume_url,
      linkedin_url: profile.linkedin_url || prev.linkedin_url,
      github_url: profile.github_url || prev.github_url,
      portfolio_url: profile.portfolio_url || prev.portfolio_url,
      expected_salary: profile.expected_salary || prev.expected_salary,
      avatar_url: profile.avatar_url || prev.avatar_url,
    }));

    setEducationDetails(
      Array.isArray(profile.education_details) &&
        profile.education_details.length > 0
        ? profile.education_details
        : [
            {
              highest_education: "Bachelor's Degree",
              degree: '',
              field_of_study: '',
              university: '',
              start_year: '',
              graduation_year: '',
              grade: '',
            },
          ]
    );

    setPreferredRoles(
      Array.isArray(profile.preferred_roles_details)
        ? profile.preferred_roles_details
        : []
    );

    setPreferredLocations(
      Array.isArray(profile.preferred_locations_details)
        ? profile.preferred_locations_details
        : []
    );
  }
}, [profile]);

  const requiredFieldsList = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'location', label: 'Location' },
    { key: 'education', label: 'Highest Education' },
    { key: 'degree', label: 'Degree / Course' },
    { key: 'university', label: 'College / University' },
    { key: 'graduation_year', label: 'Graduation Year' },
    { key: 'experience_level', label: 'Experience Level' },
    { key: 'skills', label: 'Skills' },
    { key: 'preferred_roles', label: 'Preferred Job Role' },
    { key: 'preferred_locations', label: 'Preferred Job Location' },
    { key: 'work_preference', label: 'Work Preference' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
  const newErrors = {};

  requiredFieldsList.forEach(({ key, label }) => {
    let value = formData[key];

    // Preferred roles are stored in preferredRoles array
    if (key === 'preferred_roles') {
      value = preferredRoles.join(', ');
    }

    // Preferred locations are stored in preferredLocations array
    if (key === 'preferred_locations') {
      value = preferredLocations
        .map((item) => item.country)
        .join(', ');
    }

    if (!value || String(value).trim() === '') {
      newErrors[key] = `${label} is required`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const currentCompletion = calculateProfileCompletion({
  ...formData,
  preferred_roles: preferredRoles.join(', '),
  preferred_locations: preferredLocations
    .map((item) => item.country)
    .join(', '),
});

const isComplete = isProfileComplete({
  ...formData,
  preferred_roles: preferredRoles.join(', '),
  preferred_locations: preferredLocations
    .map((item) => item.country)
    .join(', '),
});

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    setToast('Please fill out all required profile fields before proceeding.');
    window.scrollTo({ top: 120, behavior: 'smooth' });
    return;
  }

  setSaving(true);

  try {
    await saveProfile({
      ...formData,
      preferred_roles: preferredRoles.join(', '),
      preferred_locations: preferredLocations
        .map((item) => item.country)
        .join(', '),
      education_details: educationDetails,
      preferred_roles_details: preferredRoles,
      preferred_locations_details: preferredLocations,
    });

    setToast('Profile saved successfully! Redirecting to workspace…');
    setTimeout(() => navigate('/dashboard'), 750);
  } catch (err) {
    setToast(err.message || 'Failed to save profile');
  } finally {
    setSaving(false);
  }
};

return (
    <main
      className="shell profile-onboarding"
      style={{
        paddingTop: '100px',
        paddingBottom: '80px',
        maxWidth: '840px',
        margin: '0 auto',
      }}
    >
      <div className="onboarding-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
          <i /> Welcome to Carvia
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Complete Your Career Profile
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto 24px' }}>
          Fill in your required profile details so recruiters and recommendations can match you with the right opportunities.
        </p>

        {/* Dynamic Completion Progress Indicator */}
        <div
          className="progress-card"
          style={{
            background: 'var(--panel, #12141a)',
            border: '1px solid var(--line, #252836)',
            borderRadius: '16px',
            padding: '20px 28px',
            maxWidth: '580px',
            margin: '0 auto',
            textAlign: 'left',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Profile Completion</span>
            <span style={{ fontWeight: 700, color: isComplete ? 'var(--success, #34d399)' : 'var(--accent, #6C8EFF)' }}>
              {currentCompletion}% Complete {isComplete && '✓'}
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'var(--soft, #1a1d26)', borderRadius: '6px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${currentCompletion}%`,
                height: '100%',
                background: isComplete
                  ? 'linear-gradient(90deg, #34d399, #38bdf8)'
                  : 'linear-gradient(90deg, #6C8EFF, #38bdf8)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <small style={{ color: 'var(--muted)', fontSize: '0.825rem', marginTop: '8px', display: 'block' }}>
            12 required fields · {isComplete ? 'All required fields completed!' : 'All 12 required fields must be filled before continuing.'}
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="form-panel"
        style={{
          background: 'var(--panel, #12141a)',
          padding: '36px',
          borderRadius: '20px',
          border: '1px solid var(--line, #252836)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {Object.keys(errors).length > 0 && (
          <div
            style={{
              background: 'var(--danger-transparent, rgba(248, 113, 113, 0.12))',
              border: '1px solid var(--danger, #f87171)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '28px',
              color: 'var(--danger, #f87171)',
              fontSize: '0.9rem',
            }}
          >
            <strong>Please complete the required fields:</strong>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION 1: Personal Details */}
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
          1. Personal Details
        </h2>
        <div className="two-inputs">
          <label style={{ position: 'relative' }}>
            Full Name <span style={{ color: 'var(--danger, #f87171)' }}>*</span>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              style={{ borderColor: errors.full_name ? 'var(--danger, #f87171)' : undefined }}
            />
            {errors.full_name && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.full_name}</small>}
          </label>
          <label>
            Email Address
            <input
              type="email"
              disabled
              value={formData.email}
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </label>
        </div>
        <div className="two-inputs">
          <div className="two-inputs">
  <label>
    Professional Headline
    <input
      type="text"
      name="professional_headline"
      value={formData.professional_headline}
      onChange={handleChange}
      placeholder="e.g. AI Engineer | Full Stack Developer"
    />
  </label>

  <label>
    Date of Birth
    <input
      type="date"
      name="date_of_birth"
      value={formData.date_of_birth}
      onChange={handleChange}
    />
  </label>
</div>
<label style={{ display: 'block', marginTop: '20px' }}>
  About Me
  <textarea
    name="about_me"
    value={formData.about_me}
    onChange={handleChange}
    placeholder="Tell recruiters about yourself, your skills, experience and career goals..."
    rows="5"
    style={{
      width: '100%',
      resize: 'vertical',
      padding: '14px',
      borderRadius: '12px',
      background: 'var(--bg)',
      color: 'var(--text)',
      border: '1px solid var(--line)',
      fontFamily: 'inherit',
      fontSize: '0.95rem',
      boxSizing: 'border-box',
    }}
  />
</label>
          <label>
            Phone Number <span style={{ color: 'var(--danger, #f87171)' }}>*</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 019-2834"
              style={{ borderColor: errors.phone ? 'var(--danger, #f87171)' : undefined }}
            />
            {errors.phone && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.phone}</small>}
          </label>
          <label>
            Location <span style={{ color: 'var(--danger, #f87171)' }}>*</span>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State / Country (e.g. Bengaluru, India)"
              style={{ borderColor: errors.location ? 'var(--danger, #f87171)' : undefined }}
            />
            {errors.location && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.location}</small>}
          </label>
        </div>

      {/* SECTION 2: Education */}
<h2
  style={{
    fontSize: '1.2rem',
    marginTop: '32px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--line)',
    paddingBottom: '10px',
  }}
>
  2. Education
</h2>

{educationDetails.map((education, index) => (
  <div
    key={index}
    style={{
      border: '1px solid var(--line)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      background: 'var(--bg)',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1rem' }}>
        Education {index + 1}
      </h3>

      {educationDetails.length > 1 && (
        <button
          type="button"
          onClick={() => removeEducation(index)}
          style={{
            border: '1px solid var(--danger, #f87171)',
            color: 'var(--danger, #f87171)',
            background: 'transparent',
            borderRadius: '8px',
            padding: '7px 12px',
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      )}
    </div>

    <div className="two-inputs">
      <label>
        Highest Education *
        <select
          value={education.highest_education}
          onChange={(e) =>
            updateEducation(index, 'highest_education', e.target.value)
          }
          style={{
            width: '100%',
            minHeight: '48px',
            borderRadius: '12px',
            background: 'var(--bg)',
            color: 'var(--text)',
            border: '1px solid var(--line)',
            padding: '0 14px',
          }}
        >
          <option value="High School">High School</option>
          <option value="Associate Degree">Associate Degree</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="Doctorate / Ph.D.">Doctorate / Ph.D.</option>
          <option value="Other Certification">Other Certification</option>
        </select>
      </label>

      <label>
        Degree / Course *
        <input
          type="text"
          value={education.degree}
          onChange={(e) =>
            updateEducation(index, 'degree', e.target.value)
          }
          placeholder="e.g. B.Tech"
        />
      </label>
    </div>

    <div className="two-inputs">
      <label>
        Field of Study
        <input
          type="text"
          value={education.field_of_study}
          onChange={(e) =>
            updateEducation(index, 'field_of_study', e.target.value)
          }
          placeholder="e.g. Computer Science"
        />
      </label>

      <label>
        College / University *
        <input
          type="text"
          value={education.university}
          onChange={(e) =>
            updateEducation(index, 'university', e.target.value)
          }
          placeholder="e.g. XYZ University"
        />
      </label>
    </div>

    <div className="two-inputs">
      <label>
        Start Year
        <input
          type="number"
          value={education.start_year}
          onChange={(e) =>
            updateEducation(index, 'start_year', e.target.value)
          }
          placeholder="e.g. 2023"
        />
      </label>

      <label>
        Graduation Year *
        <input
          type="number"
          value={education.graduation_year}
          onChange={(e) =>
            updateEducation(index, 'graduation_year', e.target.value)
          }
          placeholder="e.g. 2027"
        />
      </label>
    </div>

    <label>
      CGPA / Percentage
      <input
        type="text"
        value={education.grade}
        onChange={(e) =>
          updateEducation(index, 'grade', e.target.value)
        }
        placeholder="e.g. 8.5 CGPA or 85%"
      />
    </label>
  </div>
))}

<button
  type="button"
  onClick={addEducation}
  style={{
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: '1px dashed var(--accent, #6C8EFF)',
    background: 'transparent',
    color: 'var(--accent, #6C8EFF)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    marginBottom: '10px',
  }}
>
  + Add Another Education
</button>

        {/* SECTION 3: Experience & Work Preferences */}
        <h2 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
          3. Experience & Job Preferences
        </h2>
        <div className="two-inputs">
          <label>
            Experience Level <span style={{ color: 'var(--danger, #f87171)' }}>*</span>
            <select
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              style={{
                width: '100%',
                minHeight: '48px',
                borderRadius: '12px',
                background: 'var(--bg)',
                color: 'var(--text)',
                border: errors.experience_level ? '1px solid var(--danger, #f87171)' : '1px solid var(--line)',
                padding: '0 14px',
              }}
            >
              <option value="Fresher / Entry Level (0-1 yr)">Fresher / Entry Level (0-1 yr)</option>
              <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
              <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
              <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
              <option value="Lead / Manager (8+ yrs)">Lead / Manager (8+ yrs)</option>
            </select>
            {errors.experience_level && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.experience_level}</small>}
          </label>
          <label>
            Work Preference <span style={{ color: 'var(--danger, #f87171)' }}>*</span>
            <select
              name="work_preference"
              value={formData.work_preference}
              onChange={handleChange}
              style={{
                width: '100%',
                minHeight: '48px',
                borderRadius: '12px',
                background: 'var(--bg)',
                color: 'var(--text)',
                border: errors.work_preference ? '1px solid var(--danger, #f87171)' : '1px solid var(--line)',
                padding: '0 14px',
              }}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
            {errors.work_preference && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.work_preference}</small>}
          </label>
        </div>
        <label>
          Skills <span style={{ color: 'var(--danger, #f87171)' }}>*</span> (Comma separated)
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, TypeScript, Node.js, Python, Figma"
            style={{ borderColor: errors.skills ? 'var(--danger, #f87171)' : undefined }}
          />
          {errors.skills && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.skills}</small>}
        </label>
        <div 
        className="two-inputs">
        <label>
  Preferred Job Roles <span style={{ color: 'var(--danger, #f87171)' }}>*</span>

  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '10px',
    }}
  >
    {preferredRoles.map((role, index) => (
      <span
        key={index}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 12px',
          borderRadius: '20px',
          background: 'var(--soft, #1a1d26)',
          border: '1px solid var(--line)',
        }}
      >
        {role}

        <button
          type="button"
          onClick={() => removePreferredRole(index)}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--danger, #f87171)',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 700,
          }}
        >
          ×
        </button>
      </span>
    ))}
  </div>

  <div style={{ display: 'flex', gap: '8px' }}>
    <input
      type="text"
      value={newRole}
      onChange={(e) => setNewRole(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addPreferredRole();
        }
      }}
      placeholder="e.g. AI Engineer"
    />

    <button
      type="button"
      onClick={addPreferredRole}
      style={{
        padding: '0 16px',
        borderRadius: '10px',
        border: '1px solid var(--accent, #6C8EFF)',
        background: 'transparent',
        color: 'var(--accent, #6C8EFF)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      + Add Role
    </button>
  </div>

  {errors.preferred_roles && (
    <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>
      {errors.preferred_roles}
    </small>
  )}
</label>
  <div>
  <label>
    Preferred Job Locations{' '}
    <span style={{ color: 'var(--danger, #f87171)' }}>*</span>
  </label>

  {preferredLocations.map((location, countryIndex) => (
    <div
      key={countryIndex}
      style={{
        border: '1px solid var(--border, #334155)',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '12px',
      }}
    >
      {/* Country */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <strong>🌍 {location.country}</strong>

        <button
          type="button"
          onClick={() => removeCountry(countryIndex)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--danger, #f87171)',
            cursor: 'pointer',
          }}
        >
          Remove Country
        </button>
      </div>

      {/* Cities */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        {location.cities.map((city, cityIndex) => (
          <span
            key={cityIndex}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              background: 'var(--surface-2, #1e293b)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🏙️ {city}

            <button
              type="button"
              onClick={() =>
                removeCity(countryIndex, cityIndex)
              }
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--danger, #f87171)',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add City */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Enter city e.g. Bengaluru"
        />

        <button
          type="button"
          onClick={() => addCity(countryIndex)}
        >
          + Add City
        </button>
      </div>
    </div>
  ))}

  {/* Add Country */}
  <div
    style={{
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
    }}
  >
    <input
      value={newCountry}
      onChange={(e) => setNewCountry(e.target.value)}
      placeholder="Enter country e.g. India"
    />

    <button
      type="button"
      onClick={addCountry}
    >
      + Add Country
    </button>
  </div>

  {errors.preferred_locations && (
    <small
      style={{
        color: 'var(--danger)',
        fontSize: '0.8rem',
      }}
    >
      {errors.preferred_locations}
    </small>
  )}
</div>
</div>

        {/* SECTION 4: Optional Information */}
        <h2 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
          4. Links & Resume <small style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 400 }}>(Optional)</small>
        </h2>
        <div className="two-inputs">
          <label>
            Resume Link / URL
            <input
              name="resume_url"
              value={formData.resume_url}
              onChange={handleChange}
              placeholder="https://drive.google.com/your-resume.pdf"
            />
          </label>
          <label>
            Expected Salary
            <input
              name="expected_salary"
              value={formData.expected_salary}
              onChange={handleChange}
              placeholder="e.g. $90,000 / yr or ₹15 LPA"
            />
          </label>
        </div>
        <div className="two-inputs">
          <label>
            LinkedIn URL
            <input
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </label>
          <label>
            GitHub URL
            <input
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </label>
        </div>
        <div className="two-inputs">
          <label>
            Portfolio URL
            <input
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </label>
          <label>
            Profile Picture URL
            <input
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </label>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            type="submit"
            className="primary-button"
            style={{ flex: 1, padding: '14px', fontSize: '1rem' }}
            disabled={saving}
          >
            {saving ? 'Saving Profile…' : 'Complete Profile & Enter Workspace →'}
          </button>
        </div>
      </form>
      <Toast message={toast} />
    </main>
  );
}
