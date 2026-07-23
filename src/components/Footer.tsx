import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="footer-logo">
              <img src="/16__1_-removebg-preview.png" alt="Assist Plus Care" className="logo-img" />
            </Link>
            <p>Assist Plus Care UK is a trusted healthcare staffing provider supporting nursing homes, residential care homes, mental health units, supported living services, private hospitals, and hospice organisations across the UK &amp; Ireland. Established in 2024.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/quote">Careers / Join Our Team</Link></li>
              <li><Link to="/quote">Contact Us &amp; Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Staffing Solutions</h4>
            <ul>
              <li><Link to="/services">Registered Nurses (NHS)</Link></li>
              <li><Link to="/services">Mental Health Nurses</Link></li>
              <li><Link to="/services">Healthcare Assistants (HCAs)</Link></li>
              <li><Link to="/services">Support Workers</Link></li>
              <li><Link to="/services">Live in Carers</Link></li>
              <li><Link to="/quote">24/7 Emergency Cover</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <div className="footer-contact-details" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: '1.8' }}>
              <p><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> 48 Mortise House, 11 Chailey Place, Hayes, UB1 3HW</p>
              <p><i className="fas fa-phone-alt" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> <a href="tel:02036526052" style={{ color: '#fff' }}>020 3652 6052</a></p>
              <p><i className="fas fa-mobile-alt" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> <a href="tel:07448295850" style={{ color: '#fff' }}>+44 07448 295850</a></p>
              <p><i className="fas fa-envelope" style={{ color: 'var(--primary)', marginRight: '8px' }}></i> <a href="mailto:admin@assistpluscare.co.uk" style={{ color: '#fff' }}>admin@assistpluscare.co.uk</a></p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Assist Plus Care UK (Est. 2024). Building Teams to Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
