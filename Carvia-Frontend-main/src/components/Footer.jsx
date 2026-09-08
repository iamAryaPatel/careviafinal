export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div>
          <div className="footer__brand">
            <span className="footer__logo">cv</span>
            Carvia
          </div>
          <p className="footer__text">A calmer way to navigate a noisy job market.</p>
        </div>
        <div className="footer__links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer__link">
            GitHub
          </a>
          <span className="footer__link">
            © {new Date().getFullYear()} Carvia
          </span>
        </div>
      </div>
    </footer>
  );
}
