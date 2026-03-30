import React from 'react';
import '../styles/DownloadButton.css';

const DownloadButton = ({ href }) => {
  if (!href) {
    return null;
  }

  const fileName = href.split('/').pop() || 'resume.pdf';

  return (
    <a href={href} download={fileName} className="floating-download-button">
      Download My Resume
    </a>
  );
};

export default DownloadButton;
