import React from 'react';
import '../styles/DownloadButton.css';
import resume from '../assets/Naman_Sanadhya_Resume.pdf';

const DownloadButton = () => {
  return (
    <a 
      href={resume} 
      download="Naman_Sanadhya_Resume.pdf" 
      className="floating-download-button"
    >
      Download My Resume
    </a>
  );
};

export default DownloadButton;
