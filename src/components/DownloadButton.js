import React from 'react';
import './DownloadButton.css';

const DownloadButton = () => {
  const handleDownload = () => {
    // Use the relative path based on your project's structure
    window.open(`${process.env.PUBLIC_URL}/src/assets/Naman_Sanadhya_Resume.pdf`, '_blank');
  };

  return (
    <button className="floating-button" onClick={handleDownload}>
      Download Resume
    </button>
  );
};

export default DownloadButton;
