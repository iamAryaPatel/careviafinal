import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const suggestions = [
  {
    title: "Find jobs for me",
    text: "Find jobs matching my profile",
    prompt: "Find the best jobs for my profile."
  },
  {
    title: "Check my skill gap",
    text: "See what skills I should improve",
    prompt: "Check my current skill gap and tell me what skills I should improve."
  },
  {
    title: "Skills for a role",
    text: "What do I need for AI Engineer?",
    prompt: "What skills do I need to become an AI Engineer?"
  },
  {
    title: "Improve my career",
    text: "Give me practical career advice",
    prompt: "Give me practical advice to improve my career."
  }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I’m here to help with your job search and career decisions. Tell me what you’re looking for, or choose an option below."
    }
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const message = text.trim();

    if (!message || typing) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: message
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Temporary response.
    // We will connect this to the Carvia AI backend next.
    setTimeout(() => {
      let reply =
        "I can help you with job searches, required skills, skill gaps and career decisions. Tell me your target role and experience level, and I’ll guide you from there.";

      const lower = message.toLowerCase();

      if (lower.includes("ai engineer")) {
        reply =
          "For an AI Engineer role, focus on Python, SQL, machine learning fundamentals, APIs and Git. Depending on the role, FastAPI, Docker, RAG and cloud deployment can also make your profile stronger.";
      } else if (
        lower.includes("frontend") ||
        lower.includes("front end")
      ) {
        reply =
          "For frontend development, build strong fundamentals in HTML, CSS and JavaScript first. React, responsive design, REST APIs, Git and TypeScript are useful next steps.";
      } else if (
        lower.includes("skill gap") ||
        lower.includes("skills")
      ) {
        reply =
          "I can identify your skill gap using your Carvia profile. The next version will compare your current skills with the requirements of your target role and highlight the most important areas to improve.";
      } else if (
        lower.includes("job") ||
        lower.includes("career")
      ) {
        reply =
          "Absolutely. Tell me the role you want, your experience level and preferred location. I can then help you understand which opportunities and skills are the best fit.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: reply
        }
      ]);

      setTyping(false);
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <main className="shell ai-page">
      <style>{`
        .ai-page {
          min-height: calc(100vh - 80px);
          padding-top: 32px;
          padding-bottom: 48px;
        }

        .ai-layout {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          gap: 24px;
        }

        .ai-sidebar {
          align-self: start;
          position: sticky;
          top: 24px;
        }

        .ai-sidebar-card {
          background: #fff;
          border: 1px solid rgba(20, 30, 45, 0.09);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 8px 30px rgba(20, 30, 45, 0.05);
        }

        .ai-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .ai-brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #111827;
          color: white;
          font-size: 18px;
          font-weight: 700;
        }

        .ai-brand-text b {
          display: block;
          font-size: 15px;
        }

        .ai-brand-text span {
          display: block;
          margin-top: 2px;
          font-size: 12px;
          color: #7b8492;
        }

        .ai-nav-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #929aa6;
          margin: 0 0 10px;
        }

        .ai-side-link {
          display: block;
          padding: 10px 11px;
          border-radius: 10px;
          color: #4b5563;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .ai-side-link:hover {
          background: #f5f6f8;
          color: #111827;
        }

        .ai-side-note {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #eceef1;
          font-size: 12px;
          line-height: 1.6;
          color: #7b8492;
        }

        .ai-chat {
          min-height: 680px;
          background: #fff;
          border: 1px solid rgba(20, 30, 45, 0.09);
          border-radius: 22px;
          box-shadow: 0 12px 40px rgba(20, 30, 45, 0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .ai-chat-header {
          min-height: 76px;
          padding: 18px 24px;
          border-bottom: 1px solid #eceef1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #36a269;
          box-shadow: 0 0 0 4px rgba(54, 162, 105, 0.10);
        }

        .ai-header-title b {
          display: block;
          font-size: 16px;
        }

        .ai-header-title span {
          display: block;
          margin-top: 3px;
          font-size: 12px;
          color: #7b8492;
        }

        .ai-header-action {
          text-decoration: none;
          font-size: 13px;
          color: #596273;
        }

        .ai-messages {
          flex: 1;
          padding: 28px 30px;
          overflow-y: auto;
          background: #fcfcfd;
        }

        .ai-message-row {
          display: flex;
          margin-bottom: 18px;
        }

        .ai-message-row.user {
          justify-content: flex-end;
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          margin-right: 10px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #111827;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
        }

        .ai-bubble {
          max-width: min(680px, 82%);
          padding: 13px 16px;
          border-radius: 15px;
          background: #fff;
          border: 1px solid #e8eaee;
          color: #303846;
          font-size: 14px;
          line-height: 1.65;
          box-shadow: 0 3px 12px rgba(20, 30, 45, 0.03);
        }

        .ai-message-row.user .ai-bubble {
          background: #111827;
          color: #fff;
          border-color: #111827;
          border-bottom-right-radius: 5px;
        }

        .ai-message-row.assistant .ai-bubble {
          border-bottom-left-radius: 5px;
        }

        .ai-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 15px 17px;
          width: fit-content;
          border-radius: 15px;
          background: #fff;
          border: 1px solid #e8eaee;
        }

        .ai-typing i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #7b8492;
          animation: aiPulse 1.1s infinite ease-in-out;
        }

        .ai-typing i:nth-child(2) {
          animation-delay: .15s;
        }

        .ai-typing i:nth-child(3) {
          animation-delay: .3s;
        }

        @keyframes aiPulse {
          0%, 70%, 100% {
            opacity: .3;
            transform: translateY(0);
          }
          35% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        .ai-suggestions {
          padding: 0 30px 22px;
          background: #fcfcfd;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .ai-suggestion {
          text-align: left;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 13px;
          padding: 12px 14px;
          cursor: pointer;
          transition: .18s ease;
        }

        .ai-suggestion:hover {
          border-color: #cfd4dc;
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(20, 30, 45, .05);
        }

        .ai-suggestion b {
          display: block;
          color: #252b36;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .ai-suggestion span {
          color: #858d99;
          font-size: 11px;
        }

        .ai-composer {
          padding: 18px 24px 22px;
          border-top: 1px solid #eceef1;
          background: #fff;
        }

        .ai-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 8px 7px 15px;
          border: 1px solid #dfe3e8;
          border-radius: 15px;
          background: #fff;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .ai-input-wrap:focus-within {
          border-color: #aeb6c2;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, .05);
        }

        .ai-input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #202631;
          font: inherit;
          font-size: 14px;
        }

        .ai-input::placeholder {
          color: #9aa1ac;
        }

        .ai-send {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 11px;
          background: #111827;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }

        .ai-send:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .ai-disclaimer {
          margin: 9px 3px 0;
          color: #a0a6b0;
          font-size: 10px;
        }

        @media (max-width: 850px) {
          .ai-layout {
            grid-template-columns: 1fr;
          }

          .ai-sidebar {
            display: none;
          }

          .ai-page {
            padding: 16px 10px 30px;
          }

          .ai-chat {
            min-height: calc(100vh - 120px);
          }

          .ai-messages {
            padding: 22px 16px;
          }

          .ai-suggestions {
            padding: 0 16px 16px;
            grid-template-columns: 1fr;
          }

          .ai-composer {
            padding: 14px 16px 18px;
          }
        }
      `}</style>

      <div className="ai-layout">

        {/* Left navigation */}
        <aside className="ai-sidebar">
          <div className="ai-sidebar-card">

            <div className="ai-brand">
              <div className="ai-brand-mark">C</div>
              <div className="ai-brand-text">
                <b>Carvia Assistant</b>
                <span>Career workspace</span>
              </div>
            </div>

            <p className="ai-nav-title">Explore</p>

            <Link to="/jobs" className="ai-side-link">
              Find jobs
            </Link>

            <Link to="/profile" className="ai-side-link">
              My profile
            </Link>

            <Link to="/complete-profile" className="ai-side-link">
              Complete profile
            </Link>

            <div className="ai-side-note">
              The assistant uses your career information to make job and skill recommendations more relevant.
            </div>

          </div>
        </aside>

        {/* Chat */}
        <section className="ai-chat">

          <header className="ai-chat-header">
            <div className="ai-header-left">
              <span className="ai-status-dot" />

              <div className="ai-header-title">
                <b>Career Assistant</b>
                <span>Job search & career guidance</span>
              </div>
            </div>

            <Link to="/jobs" className="ai-header-action">
              Browse jobs →
            </Link>
          </header>

          <div className="ai-messages">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message-row ${message.role}`}
              >

                {message.role === "assistant" && (
                  <div className="ai-avatar">C</div>
                )}

                <div className="ai-bubble">
                  {message.text}
                </div>

              </div>
            ))}

            {typing && (
              <div className="ai-message-row assistant">
                <div className="ai-avatar">C</div>

                <div className="ai-typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Suggested actions */}
          {messages.length === 1 && (
            <div className="ai-suggestions">
              {suggestions.map((item) => (
                <button
                  key={item.title}
                  className="ai-suggestion"
                  onClick={() => sendMessage(item.prompt)}
                >
                  <b>{item.title}</b>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form className="ai-composer" onSubmit={handleSubmit}>
            <div className="ai-input-wrap">

              <input
                className="ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about jobs, skills or your career..."
                disabled={typing}
              />

              <button
                type="submit"
                className="ai-send"
                disabled={!input.trim() || typing}
                aria-label="Send message"
              >
                ↑
              </button>

            </div>

            <p className="ai-disclaimer">
              Carvia Assistant is designed for job search and career guidance.
            </p>
          </form>

        </section>
      </div>
    </main>
  );
}