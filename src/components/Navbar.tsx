import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <img src="/logo (3).png" alt="Assist Plus Care" className="logo-img" />
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>HOME</Link>
          <Link to="/about" onClick={closeMobileMenu}>ABOUT US</Link>
          <Link to="/services" onClick={closeMobileMenu}>OUR SERVICES</Link>
          <Link to="/quote" className="btn btn-accent nav-cta-btn mobile-only" onClick={closeMobileMenu}>GET A QUOTE</Link>
        </nav>

        <div className="nav-right">
          <Link to="/quote" className="btn btn-accent nav-cta-btn desktop-only">GET A QUOTE</Link>
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
