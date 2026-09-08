import { useState } from 'react';

const categories = {
  "🤖 AI & Machine Learning": [
    "What skills are required for an AI Engineer?",
    "What is the AI Engineer roadmap?",
    "How can I become an AI Engineer?",
    "What Python skills are needed for AI?",
    "What mathematics is required for AI?",
    "What Machine Learning topics should I learn?",
    "What ML algorithms should I learn?",
    "What is Deep Learning?",
    "What is NLP?",
    "What is Computer Vision?",
    "What is Generative AI?",
    "What is an LLM?",
    "What is RAG?",
    "What are embeddings?",
    "What is prompt engineering?",
    "Should I learn TensorFlow or PyTorch?",
    "What AI projects should I build?",
    "How can I prepare for an AI interview?",
    "What AI certifications are useful?",
    "Can I get an AI job as a fresher?"
  ],

  "📊 Data Engineering": [
    "What is the Data Engineer roadmap?",
    "How can I become a Data Engineer?",
    "What skills are required for Data Engineering?",
    "How important is SQL for Data Engineering?",
    "How much Python is needed for Data Engineering?",
    "What databases should I learn?",
    "What is ETL?",
    "What is ELT?",
    "What is a data pipeline?",
    "What is Apache Spark?",
    "What is data warehousing?",
    "What is PostgreSQL?",
    "Should I learn AWS for Data Engineering?",
    "Should I learn Azure for Data Engineering?",
    "What cloud skills are needed?",
    "What Data Engineering projects should I build?",
    "How can I prepare for a Data Engineer interview?",
    "Data Engineer vs Data Scientist?",
    "What SQL topics should I learn?",
    "Can I become a Data Engineer as a fresher?"
  ],

  "💻 Software Development": [
    "How can I become a Software Developer?",
    "What is the Software Developer roadmap?",
    "What frontend skills should I learn?",
    "What backend skills should I learn?",
    "What is Full Stack Development?",
    "Should I learn HTML and CSS?",
    "How important is JavaScript?",
    "Should I learn React?",
    "Should I learn Node.js?",
    "What is an API?",
    "What is REST API?",
    "What is FastAPI?",
    "How important is Git and GitHub?",
    "What DSA topics should I learn?",
    "What projects should I build?",
    "How can I prepare for coding interviews?",
    "How can I get my first developer job?",
    "Frontend vs Backend development?",
    "React vs Angular?",
    "Can I become a developer as a fresher?"
  ],

  "🐍 Python & Programming": [
    "How can I improve my Python?",
    "What Python topics should I learn?",
    "What Python projects should I build?",
    "How much Python is enough for a job?",
    "What is Object Oriented Programming?",
    "What are Python functions?",
    "What are Python modules?",
    "What is exception handling?",
    "What is a virtual environment?",
    "What are Python libraries?",
    "What is FastAPI?",
    "What is Flask?",
    "What is an API?",
    "What is JSON?",
    "How can I practice Python?",
    "What Python interview questions should I prepare?",
    "What Python skills are needed for AI?",
    "What Python skills are needed for Data Engineering?",
    "Python vs JavaScript?",
    "How can I build a Python portfolio?"
  ],

  "🗄️ SQL & Databases": [
    "How can I learn SQL?",
    "What SQL topics are important for jobs?",
    "What are SQL joins?",
    "What is a primary key?",
    "What is a foreign key?",
    "What is database normalization?",
    "What is PostgreSQL?",
    "PostgreSQL vs MySQL?",
    "What is a database index?",
    "What is a SQL view?",
    "What is a stored procedure?",
    "What is a transaction?",
    "What is GROUP BY in SQL?",
    "What is a subquery?",
    "What is a CTE?",
    "What SQL projects should I build?",
    "How can I prepare for SQL interviews?",
    "What SQL questions are asked in interviews?",
    "How much SQL should I learn?",
    "SQL roadmap for beginners?"
  ],

  "📄 Resume": [
    "How can I make a good resume?",
    "What should I include in my resume?",
    "How can I make my resume ATS friendly?",
    "What is an ATS?",
    "How long should my resume be?",
    "What projects should I include?",
    "How should I describe my projects?",
    "Should I include certifications?",
    "What skills should I mention?",
    "How should I write my professional summary?",
    "How can I improve my resume?",
    "What mistakes should I avoid in my resume?",
    "Should a fresher have a one page resume?",
    "How should I list my education?",
    "How should I list technical skills?",
    "How should I write project achievements?",
    "Should I include GitHub?",
    "Should I include LinkedIn?",
    "How can I make my resume stand out?",
    "How often should I update my resume?"
  ],

  "🎯 Job Search": [
    "How can I get my first job?",
    "How can I find entry-level jobs?",
    "How can I find internships?",
    "How can I find remote jobs?",
    "How should I search for jobs?",
    "How many jobs should I apply to?",
    "How can I improve my job matches?",
    "What should I do after applying?",
    "When should I follow up with recruiters?",
    "How can I find jobs without experience?",
    "How can I get a job as a fresher?",
    "How can I transition into AI?",
    "How can I transition into Data Engineering?",
    "How can I transition from developer to AI Engineer?",
    "How can I find jobs based on my skills?",
    "How can I use LinkedIn for job search?",
    "How should I contact recruiters?",
    "How can I improve my chances of getting shortlisted?",
    "How many applications should I send each week?",
    "What should I do if I keep getting rejected?"
  ],

  "🎤 Interview Preparation": [
    "How should I prepare for interviews?",
    "How should I answer Tell me about yourself?",
    "What AI interview questions should I prepare?",
    "What Python interview questions should I prepare?",
    "What SQL interview questions should I prepare?",
    "What Data Engineering interview questions should I prepare?",
    "What Software Development interview questions should I prepare?",
    "How should I explain my project?",
    "How should I explain my strengths?",
    "How should I answer weakness questions?",
    "How should I handle HR interviews?",
    "What should I do before an interview?",
    "What should I do after an interview?",
    "How can I improve my communication skills?",
    "How can I reduce interview anxiety?",
    "What technical topics should I revise?",
    "How should I prepare for coding rounds?",
    "What questions should I ask the interviewer?",
    "What are common interview mistakes?",
    "How can I improve my interview performance?"
  ],

  "🚀 Projects & Portfolio": [
    "What AI projects should I build?",
    "What beginner AI projects can I build?",
    "What advanced AI projects can I build?",
    "What Machine Learning projects should I build?",
    "What Data Engineering projects should I build?",
    "What Python projects should I build?",
    "What Full Stack projects should I build?",
    "What projects look good on a resume?",
    "How many projects should I have?",
    "How can I make my project stand out?",
    "How should I document my project?",
    "How should I upload my project to GitHub?",
    "What project should I build as a fresher?",
    "What project can demonstrate SQL skills?",
    "What project can demonstrate API skills?",
    "What project can demonstrate React skills?",
    "What project can demonstrate AI skills?",
    "How can I create a strong portfolio?",
    "What should my GitHub profile contain?",
    "How can I explain my project in an interview?"
  ],

  "🎓 Career & Fresher": [
    "Which career path is best for me?",
    "Should I choose AI or Data Engineering?",
    "AI Engineer vs Software Developer?",
    "Data Engineer vs Data Scientist?",
    "Should I learn AI as a fresher?",
    "Can I get an AI job without experience?",
    "Can I get a job without experience?",
    "Can I get a job without a degree?",
    "How can I get experience as a fresher?",
    "How can I build a strong portfolio?",
    "What should I learn in 3 months?",
    "What should I learn in 6 months?",
    "What should I learn before applying for jobs?",
    "How can I choose the right career?",
    "How can I switch careers?",
    "Should I focus on one technology?",
    "How many technologies should I learn?",
    "Should I learn cloud technology?",
    "What skills are most valuable for freshers?",
    "How can I become job ready?"
  ]
};

const answers = {
  "What skills are required for an AI Engineer?":
    "AI Engineers generally need Python, SQL, Machine Learning fundamentals, data handling, APIs, Git, model deployment and basic cloud knowledge. For advanced roles, learn Deep Learning, Generative AI and RAG.",

  "What is the AI Engineer roadmap?":
    "Start with Python and SQL, then learn statistics and Machine Learning. Continue with Deep Learning, APIs, Git, deployment, Generative AI and RAG. Build 3–4 practical projects and prepare for interviews.",

  "How can I become an AI Engineer?":
    "Build your foundation in Python, SQL and Machine Learning. Then learn Deep Learning, APIs, deployment and modern Generative AI concepts. Create practical projects and publish them on GitHub.",

  "What Python skills are needed for AI?":
    "Focus on functions, OOP, data structures, NumPy, Pandas, APIs, exception handling, virtual environments and writing clean Python code.",

  "What is Generative AI?":
    "Generative AI refers to systems that generate new content such as text, images, audio or code. Important topics include LLMs, prompting, embeddings, RAG and model evaluation.",

  "What is RAG?":
    "RAG means Retrieval-Augmented Generation. It retrieves relevant information from a knowledge source and uses that information to generate a more grounded response.",

  "How can I become a Data Engineer?":
    "Start with SQL and Python. Then learn databases, ETL/ELT, data pipelines, data warehousing, Spark and cloud platforms. Build pipeline projects to demonstrate your skills.",

  "What is ETL?":
    "ETL stands for Extract, Transform and Load. Data is collected from sources, transformed into a useful format and then loaded into a target system such as a database or warehouse.",

  "What is a data pipeline?":
    "A data pipeline is a process that moves data from one or more sources through transformation and processing steps into a destination where it can be analyzed or used.",

  "How can I become a Software Developer?":
    "Choose a development path, learn the fundamentals, practice coding and build projects. For web development, start with HTML, CSS and JavaScript, then learn React and a backend technology such as Node.js.",

  "Should I learn React?":
    "React is useful if you want to work in modern frontend development. Learn JavaScript fundamentals first, then components, props, state, hooks, routing and API integration.",

  "How can I improve my Python?":
    "Practice Python every day through small programs and projects. Focus on functions, OOP, data structures, error handling, APIs and commonly used libraries.",

  "How can I learn SQL?":
    "Start with SELECT, WHERE, ORDER BY and GROUP BY. Then learn joins, subqueries, CTEs, window functions, indexes and query optimization. Practice with real datasets.",

  "How can I make my resume ATS friendly?":
    "Use a simple structure, standard section headings, relevant keywords and readable formatting. Avoid unnecessary graphics, tables and complicated layouts.",

  "What is an ATS?":
    "ATS stands for Applicant Tracking System. Recruiters use ATS software to organize applications and identify resumes containing relevant information and keywords.",

  "How can I get my first job?":
    "Build job-ready skills, create 2–4 strong projects, prepare your resume and GitHub, apply consistently and practice interviews. Focus on roles that match your current skills.",

  "How can I find internships?":
    "Search for internships using job portals, company career pages and professional networks. Keep your resume focused on skills and projects, and apply consistently.",

  "How should I prepare for interviews?":
    "Review the skills listed in the job description, revise fundamentals, practice technical questions and prepare a clear explanation of your projects. Also prepare common HR questions.",

  "How should I answer Tell me about yourself?":
    "Give a short professional introduction: your education, relevant technical skills, important projects, experience if any, and the type of role you are targeting.",

  "What AI projects should I build?":
    "Build projects that solve practical problems. Examples include a medical information chatbot, job recommendation system, document Q&A system, resume analyzer or RAG-based knowledge assistant.",

  "How many projects should I have?":
    "For a fresher, 2–4 strong projects are usually better than many unfinished projects. Choose projects that demonstrate different skills relevant to your target role.",

  "Which career path is best for me?":
    "Choose based on your interests and strengths. AI suits people interested in intelligent systems and ML, Data Engineering suits people who enjoy data pipelines and databases, while Software Development suits people who enjoy building applications."
};

function getAnswer(question) {
  if (answers[question]) return answers[question];

  const lower = question.toLowerCase();

  if (lower.includes('resume')) {
    return "Keep your resume concise, job-focused and easy to read. Highlight relevant skills, measurable project work, GitHub and technologies related to the role you want.";
  }

  if (lower.includes('interview')) {
    return "Prepare the fundamentals related to your target role, practice technical questions and be ready to clearly explain your projects and contributions.";
  }

  if (lower.includes('project')) {
    return "Choose a practical project related to your target role. Make sure it has a clear README, clean code, useful features and a clear explanation of the technologies you used.";
  }

  if (lower.includes('python')) {
    return "Focus on Python fundamentals, functions, OOP, data structures, error handling, APIs and practical libraries. Regular project-based practice is the best way to improve.";
  }

  if (lower.includes('sql') || lower.includes('database')) {
    return "Learn SQL fundamentals first, followed by joins, aggregation, subqueries, CTEs, window functions, indexes and query optimization. Practice with real datasets.";
  }

  return "This is a useful career topic. Focus on practical skills, build relevant projects and keep your learning aligned with the type of job you want.";
}

export default function AIAssistant() {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswer(getAnswer(question));
  };

  const handleReset = () => {
    setSelectedQuestion('');
    setAnswer('');
  };

  return (
    <main className="shell">
      <section
        className="dashboard-panel"
        style={{
          padding: '28px',
          maxWidth: '1000px',
          margin: '30px auto'
        }}
      >
        <div className="eyebrow">
          <i /> Career Assistant
        </div>

        <h1 style={{ marginTop: '8px' }}>
          Career guidance for your next move
        </h1>

        <p style={{ color: 'var(--muted, #94a3b8)' }}>
          Select a question below to get career guidance.
        </p>

        {selectedQuestion && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
              borderRadius: '14px',
              border: '1px solid var(--line, #263244)',
              background: 'var(--card-bg, rgba(255,255,255,0.03))'
            }}
          >
            <small style={{ color: 'var(--muted, #94a3b8)' }}>
              Your question
            </small>

            <h3 style={{ margin: '8px 0 16px' }}>
              {selectedQuestion}
            </h3>

            <p style={{ lineHeight: 1.7 }}>
              {answer}
            </p>

            <button
              className="secondary-button"
              onClick={handleReset}
              style={{ marginTop: '12px' }}
            >
              ← Browse questions
            </button>
          </div>
        )}

        <div style={{ marginTop: '28px' }}>
          {Object.entries(categories).map(([category, questions]) => (
            <div
              key={category}
              style={{
                marginBottom: '30px'
              }}
            >
              <h2 style={{ marginBottom: '14px' }}>
                {category}
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '10px'
                }}
              >
                {questions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleQuestion(question)}
                    style={{
                      textAlign: 'left',
                      padding: '13px 15px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #263244)',
                      background: 'var(--card-bg, rgba(255,255,255,0.03))',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      lineHeight: 1.4
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}