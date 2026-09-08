import './Loader.css';

export default function Loader({ text = 'Searching across job platforms...' }) {
  return (
    <div className="loader">
      <div className="loader__spinner" />
      <p className="loader__text">{text}</p>
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--company" />
            <div className="skeleton-line skeleton-line--location" />
            <div className="skeleton-line skeleton-line--btn" />
          </div>
        ))}
      </div>
    </div>
  );
}
