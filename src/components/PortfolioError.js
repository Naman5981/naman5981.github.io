import React from 'react';
import '../styles/PortfolioError.css';

const PortfolioError = () => {
  return (
    <main className="portfolio-error-page">
      <div className="portfolio-error-shell">
        <section className="portfolio-error-visual" aria-hidden="true">
          <div className="portfolio-error-bubble bubble-large" />
          <div className="portfolio-error-bubble bubble-medium" />
          <div className="portfolio-error-bubble bubble-small" />
          <div className="portfolio-error-bubble bubble-yellow" />
          <div className="portfolio-error-bubble bubble-white-left" />
          <div className="portfolio-error-bubble bubble-white-right" />
          <div className="portfolio-error-bubble bubble-cyan" />
          <div className="portfolio-error-head">
            <div className="portfolio-error-hair" />
            <div className="portfolio-error-face">
              <span className="error-eye left">x</span>
              <span className="error-eye right">x</span>
              <span className="error-nose" />
              <span className="error-mouth" />
            </div>
          </div>
        </section>

        <section className="portfolio-error-copy">
          <nav className="portfolio-error-nav" aria-label="Error page">
            <span>Home</span>
            <span>About</span>
            <span>Contact</span>
          </nav>

          <div className="portfolio-error-message">
            <p className="portfolio-error-code">404.</p>
            <h1>Oooooooops!</h1>
            <p>
              Supabase data could not be loaded for this deployment. The page is up, but the
              portfolio data source is not responding the way it should.
            </p>
            <button type="button" className="portfolio-error-button">
              It&apos;s not you, it&apos;s me.
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PortfolioError;
