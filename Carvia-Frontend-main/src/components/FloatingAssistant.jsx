import { useState } from 'react';

/*
  Carvia Career Assistant
  -----------------------
  Predefined questions and answers only.
  No AI API, no Qwen, no Hugging Face.
*/

const questionBank = {
  'What skills are required for an AI Engineer?': {
    answer:
      'For an entry-level AI Engineer role, focus on Python, SQL, Machine Learning, Data Structures & Algorithms, APIs, Git/GitHub and basic cloud knowledge. Strong fundamentals plus 2–3 practical projects can make your profile much stronger.',
    followUps: [
      'How important is Python for AI?',
      'What AI projects should I build?',
      'How should I prepare for an AI interview?',
    ],
  },

  'Which career path is best for me?': {
    answer:
      'The right path depends on the type of work you enjoy. If you like Machine Learning and intelligent applications, explore AI/ML. If you enjoy databases, pipelines and data systems, consider Data Engineering. If you like both, an AI Data Engineering path can combine the two.',
    followUps: [
      'Should I choose AI or Data Engineering?',
      'What skills should I learn first?',
      'How can I choose a career path?',
    ],
  },

  'Should I choose AI or Data Engineering?': {
    answer:
      'Choose AI if you enjoy Machine Learning, models and intelligent applications. Choose Data Engineering if you prefer SQL, databases, ETL pipelines and data infrastructure. If you are interested in both, start with Python and SQL and explore both areas through projects.',
    followUps: [
      'What skills are required for Data Engineering?',
      'Which field is better for freshers?',
      'What skills should I learn first?',
    ],
  },

  'How can I get my first AI job?': {
    answer:
      'Start with Python, SQL and Machine Learning fundamentals. Build 2–3 practical projects, publish them on GitHub, create a focused resume and apply consistently to internships and entry-level roles. Most importantly, be able to explain every project you mention.',
    followUps: [
      'What projects should I build?',
      'How can I improve my resume?',
      'How should I prepare for an AI interview?',
    ],
  },

  'How important is Python for AI?': {
    answer:
      'Python is one of the most useful languages for AI. Learn functions, OOP, data structures, NumPy, Pandas, APIs, file handling and debugging. After that, move into Machine Learning libraries and real projects.',
    followUps: [
      'What Python topics should I learn?',
      'How much Python is needed for an AI job?',
      'What AI project can I build with Python?',
    ],
  },

  'What Python topics should I learn?': {
    answer:
      'Start with variables, conditions, loops, functions, lists, tuples, dictionaries, sets, file handling and exceptions. Then learn OOP, modules, APIs, NumPy and Pandas. Practice by building small programs instead of only watching tutorials.',
    followUps: [
      'How important is Python for AI?',
      'What AI project can I build with Python?',
      'What Python questions should I practice?',
    ],
  },

  'How much Python is needed for an AI job?': {
    answer:
      'You do not need to know every Python feature. You should be comfortable writing functions, using data structures, working with files and APIs, handling errors and using libraries such as NumPy and Pandas. You should also be able to debug your own code.',
    followUps: [
      'What Python topics should I learn?',
      'What Python questions should I practice?',
      'How important is Python for AI?',
    ],
  },

  'What AI project can I build with Python?': {
    answer:
      'Good beginner projects include a resume analyzer, job recommendation system, medical information chatbot, sentiment analysis application, document search system or AI-powered job tracker. Choose one real problem and build it end-to-end.',
    followUps: [
      'What AI projects should I build?',
      'How can I make my project stand out?',
      'What should I put on GitHub?',
    ],
  },

  'How important is SQL for AI and Data jobs?': {
    answer:
      'SQL is extremely useful for both AI and Data roles because professionals frequently work with databases and datasets. Learn SELECT, JOINs, GROUP BY, subqueries, CTEs, aggregate functions and window functions.',
    followUps: [
      'What SQL topics should I practice?',
      'What is the difference between SQL and Python?',
      'What skills are required for Data Engineering?',
    ],
  },

  'What SQL topics should I practice?': {
    answer:
      'Focus on SELECT, WHERE, ORDER BY, GROUP BY, JOINs, aggregate functions, subqueries, CTEs and window functions. After learning the syntax, practice solving real data problems using realistic datasets.',
    followUps: [
      'How important is SQL for AI and Data jobs?',
      'What is the difference between SQL and Python?',
      'What Data Engineering skills should I learn?',
    ],
  },

  'What is the difference between SQL and Python?': {
    answer:
      'SQL is mainly used to query and manipulate structured data stored in databases. Python is a general-purpose programming language used for applications, automation, data processing and AI. In many Data and AI jobs, you will use both together.',
    followUps: [
      'How important is SQL for AI and Data jobs?',
      'What Python topics should I learn?',
      'What skills are required for Data Engineering?',
    ],
  },

  'What skills are required for Data Engineering?': {
    answer:
      'Important Data Engineering skills include SQL, Python, databases, ETL/ELT, data pipelines, APIs, Git and cloud fundamentals. Later you can explore Airflow, Spark and cloud data warehouse technologies.',
    followUps: [
      'Is Python required for Data Engineering?',
      'What Data Engineering project should I build?',
      'Should I learn AWS or Azure?',
    ],
  },

  'What Data Engineering skills should I learn?': {
    answer:
      'Start with SQL, Python, databases, ETL/ELT, data pipelines, APIs and Git. After you are comfortable with the fundamentals, learn a workflow tool such as Airflow, a processing framework such as Spark and basic cloud services.',
    followUps: [
      'What skills are required for Data Engineering?',
      'Is Python required for Data Engineering?',
      'What Data Engineering project should I build?',
    ],
  },

  'Is Python required for Data Engineering?': {
    answer:
      'Python is highly useful in Data Engineering for automation, data processing, APIs and pipeline development. SQL is equally important because Data Engineers work heavily with databases and data warehouses.',
    followUps: [
      'What skills are required for Data Engineering?',
      'What Python topics should I learn?',
      'What Data Engineering project should I build?',
    ],
  },

  'What Data Engineering project should I build?': {
    answer:
      'Build an end-to-end pipeline that collects data from an API, cleans and transforms it, stores it in a database and produces useful analytics. Adding scheduling, logging and error handling makes the project stronger.',
    followUps: [
      'What skills are required for Data Engineering?',
      'Is Python required for Data Engineering?',
      'Should I learn AWS or Azure?',
    ],
  },

  'Should I learn AWS or Azure?': {
    answer:
      'For a beginner, you do not need to learn every cloud platform. Pick one platform and understand core concepts such as storage, compute, databases, networking and deployment. AWS and Azure both have useful services for AI and Data Engineering.',
    followUps: [
      'What skills are required for Data Engineering?',
      'What Data Engineering project should I build?',
      'How can I get my first AI job?',
    ],
  },

  'What AI projects should I build?': {
    answer:
      'Build projects that solve real problems. Good examples include a medical chatbot, resume analyzer, job recommendation system, document Q&A application, sentiment analysis system or AI-powered search application. Focus on architecture, implementation and your contribution.',
    followUps: [
      'How many projects should I have?',
      'How can I make my project stand out?',
      'What should I put on GitHub?',
    ],
  },

  'What projects should I build?': {
    answer:
      'Choose projects based on the job you want. For AI, consider a chatbot, recommendation system, document Q&A or resume analyzer. For Data Engineering, build an API-to-database pipeline or ETL project. The important part is showing real technical work.',
    followUps: [
      'What AI projects should I build?',
      'What Data Engineering project should I build?',
      'How can I make my project stand out?',
    ],
  },

  'How many projects should I have?': {
    answer:
      'For a fresher, 2–4 strong projects are usually enough. Quality is more important than quantity. Pick projects that match your target role and make sure you understand every part of the implementation.',
    followUps: [
      'How can I make my project stand out?',
      'How many projects should I mention?',
      'What should I put on GitHub?',
    ],
  },

  'How can I make my project stand out?': {
    answer:
      'Solve a real problem instead of copying a basic tutorial. Explain the problem, architecture, technologies, your contribution, challenges and results. A clean README, screenshots and a working demo can also make the project more convincing.',
    followUps: [
      'What should I put on GitHub?',
      'How many projects should I have?',
      'What AI projects should I build?',
    ],
  },

  'What should I put on GitHub?': {
    answer:
      'Keep your best projects on GitHub with clean code and a useful README. Include the project purpose, technologies, setup instructions, screenshots, architecture and your contribution. Avoid filling your profile with unfinished or copied projects.',
    followUps: [
      'How important is GitHub for getting an AI job?',
      'What should I put in my README?',
      'How many projects should I upload?',
    ],
  },

  'What should I put in my README?': {
    answer:
      'A good README should contain the project overview, problem statement, features, technologies, architecture, installation steps, usage instructions, screenshots and future improvements. For AI projects, also explain the model or data pipeline you used.',
    followUps: [
      'How important is GitHub for getting an AI job?',
      'How can I make my project stand out?',
      'What should I put on GitHub?',
    ],
  },

  'How many projects should I upload?': {
    answer:
      'You do not need dozens of repositories. Keep around 3–5 strong and relevant projects visible. It is better to have a few complete projects with good documentation than many unfinished repositories.',
    followUps: [
      'How can I make my project stand out?',
      'What should I put in my README?',
      'How many projects should I have?',
    ],
  },

  'How important is GitHub for getting an AI job?': {
    answer:
      'GitHub can strengthen your portfolio because it provides evidence of your practical work. Recruiters and interviewers can see your code, documentation and projects. It is especially useful when you have limited professional experience.',
    followUps: [
      'What should I put on GitHub?',
      'What should I put in my README?',
      'How can I make my project stand out?',
    ],
  },

  'How can I improve my resume?': {
    answer:
      'Keep your resume focused and easy to scan. Highlight relevant technical skills, 2–3 strong projects, internships or experience, education and relevant certifications. For each project, explain what you built, technologies used and the result.',
    followUps: [
      'What should I put in an AI resume?',
      'How many projects should I mention?',
      'Should I include certifications?',
    ],
  },

  'What should I put in an AI resume?': {
    answer:
      'Highlight Python, SQL, Machine Learning and other skills relevant to the target role. Include 2–3 strong projects and explain the problem, technologies, your contribution and results. Keep unrelated information limited.',
    followUps: [
      'How can I improve my resume?',
      'How many projects should I mention?',
      'Should I include certifications?',
    ],
  },

  'How many projects should I mention?': {
    answer:
      'For a fresher resume, 2–3 relevant projects are generally enough. Select projects that match the role and that you can confidently explain during an interview.',
    followUps: [
      'How can I improve my resume?',
      'How can I make my project stand out?',
      'What should I put on GitHub?',
    ],
  },

  'Should I include certifications?': {
    answer:
      'Relevant certifications can support your profile, but they should not replace practical skills. A strong combination is fundamentals, projects, GitHub work and a few relevant certifications.',
    followUps: [
      'How can I improve my resume?',
      'What skills should I learn first?',
      'How many projects should I mention?',
    ],
  },

  'How should I prepare for an AI interview?': {
    answer:
      'Prepare Python, SQL, Machine Learning fundamentals, problem-solving and your projects. You should be able to explain your project from beginning to end, including the data, approach, technologies, challenges and results.',
    followUps: [
      'What Python questions should I practice?',
      'What ML questions should I prepare?',
      'How should I explain my project?',
    ],
  },

  'How do I prepare for an AI interview?': {
    answer:
      'Prepare Python, SQL, Machine Learning fundamentals, problem-solving and project discussions. Practice explaining why you selected an approach, what went wrong and how you solved technical problems.',
    followUps: [
      'What Python questions should I practice?',
      'What ML questions should I prepare?',
      'How should I explain my project?',
    ],
  },

  'What Python questions should I practice?': {
    answer:
      'Practice questions on functions, lists, dictionaries, sets, OOP, exception handling, file handling, APIs, comprehensions and basic problem-solving. Also practice writing and debugging small programs.',
    followUps: [
      'How important is Python for AI?',
      'What Python topics should I learn?',
      'How should I prepare for an AI interview?',
    ],
  },

  'What ML questions should I prepare?': {
    answer:
      'Prepare supervised vs unsupervised learning, regression, classification, overfitting, underfitting, train-test split, cross-validation, evaluation metrics, feature engineering and model selection.',
    followUps: [
      'How should I prepare for an AI interview?',
      'How should I explain my project?',
      'What is Machine Learning?',
    ],
  },

  'How should I explain my project?': {
    answer:
      'Use this structure: problem → data → approach → technology → your contribution → challenges → result. Focus on explaining your decisions instead of simply listing technologies.',
    followUps: [
      'How should I prepare for an AI interview?',
      'How can I make my project stand out?',
      'What should I put on GitHub?',
    ],
  },

  'How can I find an AI internship?': {
    answer:
      'Build a focused resume and portfolio, apply through multiple job platforms, use LinkedIn professionally and target internships matching your current skills. Consistent applications are important because internship requirements vary.',
    followUps: [
      'What skills do AI interns need?',
      'How can I improve my resume?',
      'What projects should I build?',
    ],
  },

  'What skills do AI interns need?': {
    answer:
      'Most beginner AI internships value Python, basic Machine Learning, SQL, data handling and problem-solving. Git/GitHub and a couple of practical projects can also strengthen your profile.',
    followUps: [
      'What skills are required for an AI Engineer?',
      'What AI projects should I build?',
      'How can I find an AI internship?',
    ],
  },

  'What is Machine Learning?': {
    answer:
      'Machine Learning is a branch of AI where systems learn patterns from data and use those patterns to make predictions or decisions. Common types include supervised, unsupervised and reinforcement learning.',
    followUps: [
      'What ML questions should I prepare?',
      'How important is mathematics for AI?',
      'What AI projects should I build?',
    ],
  },

  'How important is mathematics for AI?': {
    answer:
      'You do not need advanced mathematics to start building AI projects. Begin with statistics, probability and basic linear algebra. As you move deeper into Machine Learning or research, stronger mathematical understanding becomes more valuable.',
    followUps: [
      'What should I learn before Machine Learning?',
      'How do I start learning AI?',
      'What is Machine Learning?',
    ],
  },

  'What should I learn before Machine Learning?': {
    answer:
      'Start with Python, basic statistics, probability, data handling and some linear algebra. You should also understand basic programming logic before moving into Machine Learning algorithms.',
    followUps: [
      'What Python topics should I learn?',
      'What is Machine Learning?',
      'How important is mathematics for AI?',
    ],
  },

  'How do I start learning AI?': {
    answer:
      'Start with Python and programming fundamentals. Then learn basic mathematics, data analysis and Machine Learning. After that, build projects and explore areas such as Generative AI, NLP, computer vision or RAG.',
    followUps: [
      'What skills should I learn first?',
      'What AI projects should I build?',
      'How important is mathematics for AI?',
    ],
  },

  'What Machine Learning topics should I learn?': {
    answer:
      'Learn supervised and unsupervised learning, regression, classification, clustering, feature engineering, model evaluation, overfitting, underfitting and basic model selection. Practice each concept with small datasets.',
    followUps: [
      'What ML questions should I prepare?',
      'What is Machine Learning?',
      'What AI projects should I build?',
    ],
  },

  'What is Generative AI?': {
    answer:
      'Generative AI refers to systems that can create new content such as text, images, audio or code. Common career areas include LLM applications, chatbots, document assistants, RAG systems and AI-powered applications.',
    followUps: [
      'What is an LLM?',
      'What is RAG?',
      'How do I start learning LLMs?',
    ],
  },

  'What is an LLM?': {
    answer:
      'An LLM, or Large Language Model, is a machine learning model trained on large amounts of text to understand and generate natural-language content. LLMs are commonly used for chatbots, summarization and question answering.',
    followUps: [
      'What is RAG?',
      'What is Generative AI?',
      'How do I start learning LLMs?',
    ],
  },

  'How do I start learning LLMs?': {
    answer:
      'Start with Python and basic Machine Learning concepts. Then learn LLM fundamentals, prompting, embeddings, vector databases and RAG. Building a small document Q&A application is a useful way to understand the workflow.',
    followUps: [
      'What is an LLM?',
      'What is RAG?',
      'What is Generative AI?',
    ],
  },

  'What is RAG?': {
    answer:
      'RAG stands for Retrieval-Augmented Generation. It retrieves relevant information from a knowledge source and provides that information to a language model before generating an answer. It is commonly used for document Q&A and knowledge assistants.',
    followUps: [
      'What is an LLM?',
      'What is Generative AI?',
      'How do I start learning LLMs?',
    ],
  },

  'What AI project can use RAG?': {
    answer:
      'A document Q&A assistant is a good RAG project. You can upload PDFs or documents, split them into chunks, create embeddings, retrieve relevant sections and generate an answer based on those sections.',
    followUps: [
      'What is RAG?',
      'What skills are needed for RAG?',
      'How do I start learning LLMs?',
    ],
  },

  'What skills are needed for RAG?': {
    answer:
      'Useful RAG skills include Python, APIs, embeddings, vector databases, document processing, retrieval techniques and basic LLM concepts. You should also understand how to evaluate whether retrieved information is relevant.',
    followUps: [
      'What is RAG?',
      'What is an LLM?',
      'What AI project can use RAG?',
    ],
  },

  'Which AI skills should I learn?': {
    answer:
      'Focus first on Python, SQL, data handling and Machine Learning fundamentals. Then add Git/GitHub, APIs and one specialization such as Generative AI, RAG, NLP or computer vision.',
    followUps: [
      'What skills are required for an AI Engineer?',
      'What Python topics should I learn?',
      'What AI projects should I build?',
    ],
  },

  'What skills should I learn first?': {
    answer:
      'For an AI-focused career, start with Python and SQL. Then learn statistics, Machine Learning fundamentals, Git/GitHub and APIs. After that, explore Generative AI, RAG, NLP or computer vision.',
    followUps: [
      'What skills are required for an AI Engineer?',
      'What Python topics should I learn?',
      'How important is SQL for AI and Data jobs?',
    ],
  },

  'How can I choose a career path?': {
    answer:
      'Think about the type of work you enjoy. If you like models and intelligent applications, explore AI/ML. If you enjoy databases and pipelines, explore Data Engineering. Building small projects in both areas can help you decide.',
    followUps: [
      'Which career path is best for me?',
      'Should I choose AI or Data Engineering?',
      'What skills should I learn first?',
    ],
  },

  'Which field is better for freshers?': {
    answer:
      'There is no single best field for every fresher. Your chances improve when your skills match the role and you can demonstrate them through projects. Pick one primary direction and build strong fundamentals around it.',
    followUps: [
      'Should I choose AI or Data Engineering?',
      'What skills should I learn first?',
      'How can I get my first AI job?',
    ],
  },

  'Should I get AI certifications?': {
    answer:
      'Certifications can support your profile, but they should not replace practical skills. For an entry-level candidate, fundamentals, projects and GitHub work are generally more important than collecting many certificates.',
    followUps: [
      'Should I include certifications?',
      'What skills should I learn first?',
      'How can I improve my resume?',
    ],
  },
};

const starterQuestions = [
  // 🤖 AI & Machine Learning
  'What skills are required for an AI Engineer?',
  'What is Machine Learning?',
  'What is Deep Learning?',
  'What is Artificial Intelligence?',
  'What is Generative AI?',
  'What is NLP?',
  'What is Computer Vision?',
  'What is a Neural Network?',
  'What is a Transformer model?',
  'What is RAG?',
  'What is an LLM?',
  'What is supervised learning?',
  'What is unsupervised learning?',
  'What is reinforcement learning?',
  'What is overfitting?',
  'What is underfitting?',
  'How do I start learning AI?',
  'Which Python libraries should I learn for AI?',
  'What projects should I build for AI?',
  'How can I become an AI Engineer?',

  // 📊 Data Engineering
  'What is Data Engineering?',
  'What does a Data Engineer do?',
  'What skills are required for Data Engineering?',
  'What is a data pipeline?',
  'What is ETL?',
  'What is ELT?',
  'What is Apache Spark?',
  'What is Apache Kafka?',
  'What is Airflow?',
  'What is data warehousing?',
  'What is a data lake?',
  'What is a data warehouse?',
  'What is batch processing?',
  'What is real-time processing?',
  'What is data cleaning?',
  'What is data integration?',
  'What is data transformation?',
  'What is database normalization?',
  'What projects should I build for Data Engineering?',
  'How can I become a Data Engineer?',

  // 💻 Software Development
  'What skills are required for a Software Developer?',
  'What is software development?',
  'What is frontend development?',
  'What is backend development?',
  'What is full-stack development?',
  'What is an API?',
  'What is REST API?',
  'What is FastAPI?',
  'What is Node.js?',
  'What is React?',
  'What is JavaScript?',
  'What is HTML?',
  'What is CSS?',
  'What is Git?',
  'What is GitHub?',
  'What is debugging?',
  'What is software testing?',
  'What projects should I build for software development?',
  'How can I improve my coding skills?',
  'How can I become a Software Developer?',

  // 🐍 Python & Programming
  'Why should I learn Python?',
  'What are Python variables?',
  'What are Python data types?',
  'What is a Python list?',
  'What is a Python tuple?',
  'What is a Python dictionary?',
  'What is a Python set?',
  'What is a Python function?',
  'What is a Python class?',
  'What is Object-Oriented Programming?',
  'What is inheritance?',
  'What is polymorphism?',
  'What is encapsulation?',
  'What is exception handling?',
  'What is a Python module?',
  'What is a Python package?',
  'What is a virtual environment?',
  'What Python libraries should I learn?',
  'What Python projects should I build?',
  'How can I improve my Python skills?',

  // 🗄️ SQL & Databases
  'What is SQL?',
  'What is a database?',
  'What is PostgreSQL?',
  'What is MySQL?',
  'What is MongoDB?',
  'What is NoSQL?',
  'What is a primary key?',
  'What is a foreign key?',
  'What is a SQL JOIN?',
  'What is INNER JOIN?',
  'What is LEFT JOIN?',
  'What is GROUP BY?',
  'What is ORDER BY?',
  'What is a SQL subquery?',
  'What is database normalization?',
  'What is an index in SQL?',
  'What is CRUD?',
  'How can I improve my SQL skills?',
  'What SQL projects should I build?',
  'How important is SQL for an AI Engineer?',

  // 📄 Resume
  'How can I improve my resume?',
  'What should an AI Engineer resume contain?',
  'What should a fresher resume contain?',
  'How long should my resume be?',
  'What skills should I mention on my resume?',
  'How should I write my professional summary?',
  'How should I describe my projects?',
  'How many projects should I put on my resume?',
  'Should I add GitHub to my resume?',
  'Should I add LinkedIn to my resume?',
  'How can I make my resume ATS friendly?',
  'What is an ATS?',
  'What keywords should I use in an AI resume?',
  'What mistakes should I avoid in my resume?',
  'How should I write internship experience?',
  'How should I write project experience?',
  'Should I include certifications?',
  'Should a fresher include hobbies?',
  'How can I make my resume stand out?',
  'How can I improve my resume for AI jobs?',

  // 🎯 Job Search
  'How can I get my first AI job?',
  'How can I find internships?',
  'How can I find a fresher job?',
  'How should I apply for jobs?',
  'How many jobs should I apply for each week?',
  'How can I get an AI internship?',
  'How can I get a Software Developer job?',
  'How can I get a Data Engineer job?',
  'How can I get a Python Developer job?',
  'How can I get a Backend Developer job?',
  'How can I get a Frontend Developer job?',
  'How can I find remote jobs?',
  'How can I improve my job search?',
  'How important is GitHub for getting a job?',
  'How important are projects for getting a job?',
  'Should I apply even if I do not match every requirement?',
  'How should I contact recruiters?',
  'How should I follow up with recruiters?',
  'What should I do after applying for a job?',
  'How can I get my first tech job?',

  // 🎤 Interview
  'How should I prepare for an AI interview?',
  'How should I prepare for a technical interview?',
  'What Python questions are asked in interviews?',
  'What SQL questions are asked in interviews?',
  'What machine learning questions are asked?',
  'What data engineering questions are asked?',
  'What software development questions are asked?',
  'What is a technical interview?',
  'How should I explain my project in an interview?',
  'How should I introduce myself in an interview?',
  'How should I answer Tell me about yourself?',
  'What are common HR interview questions?',
  'How should I answer What are your strengths?',
  'How should I answer What are your weaknesses?',
  'How should I explain a difficult bug I solved?',
  'How should I discuss my internship?',
  'How should I discuss my projects?',
  'What should I do before an interview?',
  'How can I reduce interview anxiety?',
  'How can I improve my interview skills?',

  // 🚀 Projects & Portfolio
  'What projects should I build?',
  'What AI projects should I build?',
  'What Python projects should I build?',
  'What SQL projects should I build?',
  'What Data Engineering projects should I build?',
  'What full-stack projects should I build?',
  'What beginner AI project should I build?',
  'What intermediate AI project should I build?',
  'What advanced AI project should I build?',
  'How many projects should I have?',
  'How should I document my project?',
  'How should I write a GitHub README?',
  'How can I make my GitHub profile better?',
  'How can I create a good portfolio?',
  'Should I deploy my projects?',
  'What makes a project impressive?',
  'How should I explain my project?',
  'What project should I build as a fresher?',
  'How can I improve my portfolio?',
  'How can projects help me get a job?',

  // 🎓 Career & Fresher
  'Which career path is best for me?',
  'Should I choose AI or Data Engineering?',
  'Should I choose AI or Software Development?',
  'Should I learn AI as a fresher?',
  'What should I learn first?',
  'What skills should I learn in 2026?',
  'How long does it take to become job ready?',
  'How can I become job ready?',
  'How can I improve my career?',
  'What should I do after learning Python?',
  'What should I learn after SQL?',
  'Should I learn Python or JavaScript?',
  'Should I learn AI or web development?',
  'How can I get my first internship?',
  'How can I build a strong technical profile?',
  'What should I do in my final year?',
  'How should a fresher prepare for placements?',
  'How can I stay consistent while learning?',
  'What mistakes should freshers avoid?',
  'What is the best roadmap for a tech career?'
];

const findConversation = (question) => {
  const conversation = questionBank[question];

  if (!conversation) {
    return null;
  }

  return {
    question,
    answer: conversation.answer,
    followUps: conversation.followUps,
  };
};

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const handleQuestion = (question) => {
    const conversation = findConversation(question);

    if (!conversation) {
      setMessages((previous) => [
        ...previous,
        {
          type: 'user',
          text: question,
        },
        {
          type: 'assistant',
          text:
            'I currently use predefined career questions. Please choose one of the suggested questions below so I can give you a detailed answer.',
          followUps: starterQuestions,
        },
      ]);

      setSelectedQuestion('');
      return;
    }

    setSelectedQuestion('');

    setMessages((previous) => [
      ...previous,
      {
        type: 'user',
        text: conversation.question,
      },
      {
        type: 'assistant',
        text: conversation.answer,
        followUps: conversation.followUps,
      },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const question = selectedQuestion.trim();

    if (!question) return;

    handleQuestion(question);
  };

  return (
    <>
      <button
        type="button"
        className="floating-ai-button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Open Career Assistant"
      >
        <span>✦</span>
      </button>

      {open && (
        <div className="floating-ai-panel">
          <div className="floating-ai-header">
            <div>
              <span className="assistant-status">
                <i />
                Career Assistant
              </span>

              <h3>How can I help?</h3>
            </div>

            <button
              type="button"
              className="assistant-close"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>

          <div className="floating-ai-body">
            {messages.length === 0 ? (
              <>
                <p className="assistant-welcome">
                  Get practical guidance on jobs, skills, projects and your
                  career path.
                </p>

                <div className="starter-questions">
                  {starterQuestions.map((question) => (
                    <button
                      type="button"
                      key={question}
                      onClick={() => handleQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="assistant-messages">
                {messages.map((message, index) => (
                  <div
                    key={`${message.type}-${index}`}
                    className={`assistant-message ${message.type}`}
                  >
                    <p>{message.text}</p>

                    {message.followUps &&
                      message.followUps.length > 0 && (
                        <div className="assistant-followups">
                          <span>You may also want to know</span>

                          {message.followUps.map((question) => (
                            <button
                              type="button"
                              key={question}
                              onClick={() => handleQuestion(question)}
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}