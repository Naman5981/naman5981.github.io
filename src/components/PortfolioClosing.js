import React, { useState } from 'react';
import ResumeModal from './ResumeModal';
import { trackPortfolioEvent } from '../services/analytics';
import { useClipboard } from '../hooks/useClipboard';

const PortfolioClosing = ({ resumePath, email }) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { isCopied, copyText } = useClipboard(2200);

  const handlePreviewResume = () => {
    trackPortfolioEvent({
      eventType: 'resume_preview',
      targetKey: 'resume',
      targetLabel: 'Resume Modal Preview',
      source: 'footer_closing_cta'
    });
    setIsResumeOpen(true);
  };

  const handleDownloadResume = () => {
    trackPortfolioEvent({
      eventType: 'resume_download',
      targetKey: 'resume',
      targetLabel: 'Resume PDF',
      source: 'footer_closing_download'
    });
  };

  const handleCopyEmail = (event) => {
    event.preventDefault();
    if (email) {
      copyText(email);
    }
  };

  const isExternalUrl = (url) => /^https?:\/\//i.test(url);

  return (
    <section className="portfolio-closing-shell" data-reveal>
      <div className="portfolio-closing-copy">
        <span className="eyebrow">Next Step</span>
        <h2>Want the complete backend story?</h2>
        <p>
          If the work here feels relevant, the resume is the quickest way to get the full picture.
        </p>
      </div>

      <div className="portfolio-closing-actions">
        {resumePath ? (
          <>
            <button
              type="button"
              className="portfolio-closing-cta"
              onClick={handlePreviewResume}
              aria-label="Preview resume in browser"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }} aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Preview Resume
            </button>
            <a
              className="portfolio-closing-secondary-btn"
              href={resumePath}
              download={resumePath.split('/').pop() || 'resume.pdf'}
              target={isExternalUrl(resumePath) ? '_blank' : undefined}
              rel={isExternalUrl(resumePath) ? 'noopener noreferrer' : undefined}
              onClick={handleDownloadResume}
              aria-label="Download resume PDF"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }} aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </a>
          </>
        ) : null}
        {email ? (
          <button
            type="button"
            className={`portfolio-closing-copy-btn ${isCopied ? 'is-copied' : ''}`}
            onClick={handleCopyEmail}
            title="Copy email to clipboard"
          >
            {isCopied ? '✓ Email Copied!' : `Copy Email (${email})`}
          </button>
        ) : null}
      </div>

      {isResumeOpen && resumePath && (
        <React.Suspense fallback={null}>
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
            resumeUrl={resumePath}
          />
        </React.Suspense>
      )}
    </section>
  );
};

export default PortfolioClosing;
