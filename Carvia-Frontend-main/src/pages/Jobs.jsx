/* eslint-disable no-unused-vars */
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobs as fallbackJobs } from '../data/mockJobs';
import { fetchJobs } from '../api/jobsApi';
import Toast from '../components/Toast';
import CompanyLogo from '../components/CompanyLogo';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AnimatedModal,
  AnimatedButton,
  SkeletonCard
} from '../components/MotionSystem';


/* =========================
   JOB CARD
========================= */

function JobCard({ job, saved, onSave, onQuick }) {
  const navigate = useNavigate();

  return (
    <motion.article
      className="job-card-v2"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
    >
      <div className="job-card-top">
        <CompanyLogo
          companyLogo={job.companyLogo}
          logo={job.logo}
          company={job.company}
        />

        <div>
          <span className="source-chip">
            {job.direct
              ? 'Direct company listing'
              : `Aggregated · ${job.source}`}
          </span>

          <motion.button
            whileTap={{ scale: 0.72, rotate: -12 }}
            className="save-button"
            onClick={() => onSave(job.id)}
            aria-label="Save job"
          >
            {saved ? '★' : '☆'}
          </motion.button>
        </div>
      </div>

      <button
        className="card-main"
        onClick={() =>
          navigate(`/jobs/${job.id}`, {
            state: { job }
          })
        }
      >
        <h3>{job.title}</h3>

        <p>{job.company}</p>

        <div className="job-meta">
          <span>{job.location}</span>
          <span>{job.mode}</span>
          <span>{job.experience}</span>
        </div>

        <div className="skill-row">
          {(job.skills || []).map((s) => (
            <i key={s}>{s}</i>
          ))}
        </div>
      </button>

      <div className="job-card-bottom">
        <b>{job.salary}</b>

        <span>
          {job.posted} · {job.score}% match
        </span>

        <button
          className="quick-view"
          onClick={() => onQuick(job)}
        >
          Quick view
        </button>
      </div>
    </motion.article>
  );
}


/* =========================
   FILTER HELPERS
========================= */

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .trim();


const matchesLocation = (job, selectedLocations) => {
  if (selectedLocations.length === 0) {
    return true;
  }

  const location = normalizeText(job.location);

  return selectedLocations.some((selected) => {
    const value = normalizeText(selected);

    if (value === 'remote') {
      return (
        location.includes('remote') ||
        normalizeText(job.mode).includes('remote') ||
        job.isRemote === true
      );
    }

    if (value === 'bengaluru') {
      return (
        location.includes('bengaluru') ||
        location.includes('bangalore')
      );
    }

    if (value === 'mumbai') {
      return location.includes('mumbai');
    }

    return location.includes(value);
  });
};


const matchesWorkMode = (job, selectedModes) => {
  if (selectedModes.length === 0) {
    return true;
  }

  const mode = normalizeText(job.mode);

  return selectedModes.some((selected) => {
    const value = normalizeText(selected);

    if (value === 'remote') {
      return mode.includes('remote');
    }

    if (value === 'hybrid') {
      return mode.includes('hybrid');
    }

    if (value === 'on-site') {
      return (
        mode.includes('on-site') ||
        mode.includes('onsite') ||
        mode.includes('on site')
      );
    }

    return mode.includes(value);
  });
};


const matchesExperience = (job, selectedExperience) => {
  if (selectedExperience.length === 0) {
    return true;
  }

  const experience = normalizeText(job.experience);

  return selectedExperience.some((selected) => {
    const value = normalizeText(selected);

    if (value === 'fresher') {
      return (
        experience.includes('fresher') ||
        experience.includes('entry') ||
        experience.includes('0-1') ||
        experience.includes('0–1') ||
        experience.includes('0 year') ||
        experience.includes('no experience')
      );
    }

    if (value === '1–3 years') {
      return (
        experience.includes('1-3') ||
        experience.includes('1–3') ||
        experience.includes('1 - 3') ||
        experience.includes('1 to 3')
      );
    }

    if (value === '3–5 years') {
      return (
        experience.includes('3-5') ||
        experience.includes('3–5') ||
        experience.includes('3 - 5') ||
        experience.includes('3 to 5')
      );
    }

    return experience.includes(value);
  });
};


/*
  Convert salary strings into numbers.

  Examples:
  ₹600000 - ₹1200000
  ₹6L - ₹12L
  600000 - 1200000

  Returns the LOWER salary when possible.
*/

const getMinimumSalary = (salary) => {
  if (!salary) {
    return null;
  }

  const text = String(salary)
    .toLowerCase()
    .replace(/,/g, '');

  if (
    text.includes('disclosed') ||
    text.includes('confidential') ||
    text.includes('not specified')
  ) {
    return null;
  }

  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*l/);

  if (lakhMatch) {
    return Number(lakhMatch[1]) * 100000;
  }

  const numbers = text.match(/\d+(?:\.\d+)?/g);

  if (!numbers || numbers.length === 0) {
    return null;
  }

  return Number(numbers[0]);
};


const matchesSalary = (job, selectedSalaries) => {
  if (selectedSalaries.length === 0) {
    return true;
  }

  const salary = getMinimumSalary(job.salary);

  /*
    If salary is not disclosed, don't show it when
    the user explicitly selected a salary filter.
  */
  if (salary === null) {
    return false;
  }

  return selectedSalaries.some((selected) => {
    if (selected === '₹6L+') {
      return salary >= 600000;
    }

    if (selected === '₹12L+') {
      return salary >= 1200000;
    }

    if (selected === '₹20L+') {
      return salary >= 2000000;
    }

    return true;
  });
};


/* =========================
   MAIN JOBS PAGE
========================= */

export default function Jobs() {
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(
    params.get('q') || ''
  );

  const [saved, setSaved] = useState([]);

  const [toast, setToast] = useState('');

  const [loading, setLoading] = useState(true);

  const [quick, setQuick] = useState(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [jobList, setJobList] = useState([]);

  /* =========================
     FILTER STATE
  ========================= */

  const [selectedLocations, setSelectedLocations] = useState([]);

  const [selectedModes, setSelectedModes] = useState([]);

  const [selectedExperience, setSelectedExperience] = useState([]);

  const [selectedSalaries, setSelectedSalaries] = useState([]);

  const [sortBy, setSortBy] = useState('Best match');


  /* =========================
     LOAD JOBS
  ========================= */

  const loadJobs = async (searchQuery) => {
    setLoading(true);

    try {
      const res = await fetchJobs(searchQuery);

      if (res.results && res.results.length > 0) {
        setJobList(res.results);
      } else if (!searchQuery) {
        setJobList(fallbackJobs);
      } else {
        setJobList([]);
      }
    } catch (err) {
      console.warn(
        'API fetch failed, fallback to mock jobs:',
        err
      );

      setJobList(fallbackJobs);
    } finally {
      setLoading(false);
    }
  };


  /* =========================
     SEARCH PARAMETER CHANGE
  ========================= */

  useEffect(() => {
    const currentQ = params.get('q') || '';

    setQ(currentQ);

    loadJobs(currentQ);
  }, [params]);


  /* =========================
     SEARCH
  ========================= */

  const search = (e) => {
    e.preventDefault();

    setParams(
      q
        ? { q }
        : {}
    );
  };


  /* =========================
     CHECKBOX HANDLER
  ========================= */

  const toggleFilter = (
    value,
    setter
  ) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter(
            (item) => item !== value
          )
        : [...previous, value]
    );
  };


  /* =========================
     CLEAR ALL FILTERS
  ========================= */

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedModes([]);
    setSelectedExperience([]);
    setSelectedSalaries([]);

    setQ('');
    setSortBy('Best match');

    setParams({});
  };


  /* =========================
     FILTER JOBS
  ========================= */

  const filteredJobs = useMemo(() => {
    let results = [...jobList];

    results = results.filter((job) =>
      matchesLocation(
        job,
        selectedLocations
      )
    );

    results = results.filter((job) =>
      matchesWorkMode(
        job,
        selectedModes
      )
    );

    results = results.filter((job) =>
      matchesExperience(
        job,
        selectedExperience
      )
    );

    results = results.filter((job) =>
      matchesSalary(
        job,
        selectedSalaries
      )
    );


    /* =========================
       SORTING
    ========================= */

    if (sortBy === 'Most recent') {
      results.sort((a, b) => {
        const dateA = new Date(
          a.postedAt || a.posted || 0
        ).getTime();

        const dateB = new Date(
          b.postedAt || b.posted || 0
        ).getTime();

        return dateB - dateA;
      });
    }


    if (sortBy === 'Highest salary') {
      results.sort((a, b) => {
        const salaryA =
          getMinimumSalary(a.salary) || 0;

        const salaryB =
          getMinimumSalary(b.salary) || 0;

        return salaryB - salaryA;
      });
    }


    if (sortBy === 'Best match') {
      results.sort(
        (a, b) =>
          (b.score || 0) -
          (a.score || 0)
      );
    }

    return results;
  }, [
    jobList,
    selectedLocations,
    selectedModes,
    selectedExperience,
    selectedSalaries,
    sortBy
  ]);


  /* =========================
     SAVE JOB
  ========================= */

  const save = (id) => {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter(
            (item) => item !== id
          )
        : [...previous, id]
    );

    setToast(
      saved.includes(id)
        ? 'Removed from saved jobs'
        : 'Saved to your workspace'
    );

    setTimeout(
      () => setToast(''),
      2200
    );
  };


  /* =========================
     UI
  ========================= */

  return (
    <main className="jobs-page shell">

      <header className="page-hero">

        <div className="eyebrow">
          Search / Compare / Decide
        </div>

        <h1>
          Explore opportunities
        </h1>

        <p>
          Fresh roles from multiple sources,
          normalized into one easy comparison.
        </p>

        <form
          className="jobs-search"
          onSubmit={search}
        >
          <input
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
            placeholder="Job title, skills, company…"
          />

          <AnimatedButton
            className="jobs-search-button"
            loading={loading}
          >
            Search jobs
          </AnimatedButton>
        </form>

      </header>


      <div className="jobs-layout">

        {/* MOBILE FILTER BUTTON */}

        <button
          className="filter-toggle-mobile"
          onClick={() =>
            setFiltersOpen(
              !filtersOpen
            )
          }
        >
          {filtersOpen
            ? '✕ Close filters'
            : '☰ Show filters'}
        </button>


        {/* =========================
            FILTER SIDEBAR
        ========================= */}

        <aside
          className={`filter-panel ${
            filtersOpen ? 'open' : ''
          }`}
        >

          <div className="filter-title">

            <b>
              Filters
            </b>

            <button
              onClick={
                clearAllFilters
              }
            >
              Clear all
            </button>

          </div>


          {/* LOCATION */}

          <div className="filter-group">

            <span>
              LOCATION
            </span>

            {[
              'Remote',
              'Bengaluru',
              'Mumbai'
            ].map((option) => (

              <motion.label
                layout
                key={option}
              >

                <input
                  type="checkbox"
                  checked={selectedLocations.includes(
                    option
                  )}
                  onChange={() =>
                    toggleFilter(
                      option,
                      setSelectedLocations
                    )
                  }
                />

                {option}

              </motion.label>

            ))}

          </div>


          {/* WORK MODE */}

          <div className="filter-group">

            <span>
              WORK MODE
            </span>

            {[
              'Remote',
              'Hybrid',
              'On-site'
            ].map((option) => (

              <motion.label
                layout
                key={option}
              >

                <input
                  type="checkbox"
                  checked={selectedModes.includes(
                    option
                  )}
                  onChange={() =>
                    toggleFilter(
                      option,
                      setSelectedModes
                    )
                  }
                />

                {option}

              </motion.label>

            ))}

          </div>


          {/* EXPERIENCE */}

          <div className="filter-group">

            <span>
              EXPERIENCE
            </span>

            {[
              'Fresher',
              '1–3 years',
              '3–5 years'
            ].map((option) => (

              <motion.label
                layout
                key={option}
              >

                <input
                  type="checkbox"
                  checked={selectedExperience.includes(
                    option
                  )}
                  onChange={() =>
                    toggleFilter(
                      option,
                      setSelectedExperience
                    )
                  }
                />

                {option}

              </motion.label>

            ))}

          </div>


          {/* SALARY */}

          <div className="filter-group">

            <span>
              SALARY
            </span>

            {[
              '₹6L+',
              '₹12L+',
              '₹20L+'
            ].map((option) => (

              <motion.label
                layout
                key={option}
              >

                <input
                  type="checkbox"
                  checked={selectedSalaries.includes(
                    option
                  )}
                  onChange={() =>
                    toggleFilter(
                      option,
                      setSelectedSalaries
                    )
                  }
                />

                {option}

              </motion.label>

            ))}

          </div>

        </aside>


        {/* =========================
            RESULTS
        ========================= */}

        <section className="results">

          <div className="results-bar">

            <span>
              {loading
                ? 'Updating results…'
                : `${filteredJobs.length} roles found`}
            </span>


            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
            >

              <option>
                Best match
              </option>

              <option>
                Most recent
              </option>

              <option>
                Highest salary
              </option>

            </select>

          </div>


          {loading ? (

            <div className="job-skeletons">

              {[1, 2, 3].map(
                (x) => (
                  <SkeletonCard
                    key={x}
                  />
                )
              )}

            </div>

          ) : (

            <motion.div
              className="job-list"
              layout
            >

              <AnimatePresence>

                {filteredJobs.map(
                  (job) => (

                    <JobCard
                      key={job.id}
                      job={job}
                      saved={saved.includes(
                        job.id
                      )}
                      onSave={save}
                      onQuick={setQuick}
                    />

                  )
                )}

              </AnimatePresence>


              {!filteredJobs.length && (

                <div className="empty-state">

                  <b>
                    No jobs match these filters.
                  </b>

                  <p>
                    Try removing one or more
                    filters or search for a
                    broader job title.
                  </p>

                  <button
                    onClick={
                      clearAllFilters
                    }
                    className="primary-button"
                  >
                    Clear filters
                  </button>

                </div>

              )}

            </motion.div>

          )}

        </section>

      </div>


      {/* =========================
          QUICK VIEW
      ========================= */}

      <AnimatedModal
        open={!!quick}
        title="Quick view"
        onClose={() =>
          setQuick(null)
        }
      >

        {quick && (

          <div className="quick-modal">

            <CompanyLogo
              companyLogo={
                quick.companyLogo
              }
              logo={quick.logo}
              company={quick.company}
            />

            <h3>
              {quick.title}
            </h3>

            <p>
              {quick.company} ·{' '}
              {quick.location}
            </p>

            <div className="skill-row">

              {(quick.skills || []).map(
                (x) => (
                  <i key={x}>
                    {x}
                  </i>
                )
              )}

            </div>


            {quick.url &&
              quick.url !== '#' && (

                <a
                  href={quick.url}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button"
                  style={{
                    display:
                      'inline-block',
                    textAlign:
                      'center',
                    margin:
                      '10px 0'
                  }}
                >
                  Apply on Original Site ↗
                </a>

              )}


            <AnimatedButton
              className="secondary-button"
              onClick={() => {
                setQuick(null);
                setToast(
                  'Job saved to your workspace'
                );
              }}
            >
              Save this role
            </AnimatedButton>

          </div>

        )}

      </AnimatedModal>


      <Toast message={toast} />

    </main>
  );
}