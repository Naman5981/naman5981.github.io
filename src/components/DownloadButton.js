import React from 'react';
import '../styles/DownloadButton.css';
import { trackPortfolioEvent } from '../services/analytics';

const DownloadButton = ({ href }) => {
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
    >
      Download My Resume
    </a>
  );
};

export default DownloadButton;
