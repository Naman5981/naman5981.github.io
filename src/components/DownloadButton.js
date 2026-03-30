import React from 'react';
import '../styles/DownloadButton.css';
import { trackPortfolioEvent } from '../services/analytics';

const DownloadButton = ({ href }) => {
  if (!href) {
    return null;
  }

  const fileName = href.split('/').pop() || 'resume.pdf';

  return (
    <a
      href={href}
      download={fileName}
      className="floating-download-button"
      onClick={() =>
        trackPortfolioEvent({
          eventType: 'resume_download',
          targetKey: 'resume',
          targetLabel: 'Resume PDF',
          source: 'download_button'
        })
      }
    >
      Download My Resume
    </a>
  );
};

export default DownloadButton;
