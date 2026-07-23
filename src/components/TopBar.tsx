import React from 'react';
import { Link } from 'react-router-dom';

export const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div className="top-bar-left">
          <a href="tel:02036526052" className="top-contact-item">
            <i className="fas fa-phone-alt top-icon"></i>
            <span>020 3652 6052</span>
          </a>
          <span className="top-dot">•</span>
          <a href="tel:07448295850" className="top-contact-item">
            <i className="fas fa-mobile-alt top-icon"></i>
            <span>+44 07448 295850</span>
          </a>
          <span className="top-dot">•</span>
          <a href="mailto:admin@assistpluscare.co.uk" className="top-contact-item">
            <i className="fas fa-envelope top-icon"></i>
            <span>admin@assistpluscare.co.uk</span>
          </a>
        </div>

        <div className="top-bar-right">
          <Link to="/quote" className="top-btn">
            <i className="fas fa-phone-volume"></i> Request a Callback
          </Link>
          <Link to="/quote" className="top-btn top-btn-outline">
            <i className="fas fa-file-download"></i> Request a Brochure
          </Link>
        </div>
      </div>
    </div>
  );
};
