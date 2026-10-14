import React from 'react';
import '../styles/DownloadButton.css';
import { trackPortfolioEvent } from '../services/analytics';

const DownloadButton = ({ href, label = 'Download Resume' }) => {
  if (!href) {
    return null;
  }

  const fileName = href.split('/').pop() || 'resume.pdf';
  const isExternal = /^https?:\/\//i.test(href);

  const handleDownloadClick = async (event) => {
    event.preventDefault();

    await trackPortfolioEvent({
      eventType: 'resume_download',
      targetKey: 'resume',
      targetLabel: 'Resume PDF',
      source: 'download_button'
    });

    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <a
      href={href}
      download={fileName}
      className="floating-download-button"
      onClick={handleDownloadClick}
      aria-label="Download resume PDF"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>{label}</span>
    </a>
  );
};

export default DownloadButton;
