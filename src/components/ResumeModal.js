import React, { useEffect, useState } from 'react';
import '../styles/ResumeModal.css';
import { trackPortfolioEvent } from '../services/analytics';

const ResumeModal = ({ isOpen, onClose, resumeUrl, fileName = 'Naman_Sanadhya_Resume.pdf' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      return undefined;
    }

    trackPortfolioEvent({
      eventType: 'resume_preview',
      targetKey: 'resume_modal',
      targetLabel: 'Resume Modal Preview',
      source: 'resume_preview_button'
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !resumeUrl) {
    return null;
  }

  const handleDownload = () => {
    trackPortfolioEvent({
      eventType: 'resume_download',
      targetKey: 'resume',
      targetLabel: 'Resume PDF',
      source: 'resume_modal_download'
    });
  };

  return (
    <div className="resume-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Resume Preview">
      <div className="resume-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="resume-modal-header">
          <div className="resume-modal-title-group">
            <span className="resume-modal-badge">Resume</span>
            <h3>Naman Sanadhya — Backend Engineer</h3>
          </div>
          <div className="resume-modal-actions">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-modal-btn secondary"
              title="Open full PDF in a new tab"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Full Screen</span>
            </a>
            <a
              href={resumeUrl}
              download={fileName}
              onClick={handleDownload}
              className="resume-modal-btn primary"
              title="Download PDF to device"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PDF</span>
            </a>
            <button
              type="button"
              className="resume-modal-close"
              onClick={onClose}
              aria-label="Close resume preview (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="resume-modal-body">
          {isLoading && (
            <div className="resume-modal-loader" aria-live="polite">
              <div className="resume-modal-spinner" />
              <span>Loading Resume Preview...</span>
            </div>
          )}
          <iframe
            src={`${resumeUrl}#toolbar=0&navpanes=0`}
            title="Naman Sanadhya Resume Preview"
            className="resume-modal-iframe"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
