import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const QuotePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! Your message has been sent successfully. We will get back to you shortly.');
  };

  return (
    <section className="quote-page">
      <div className="quote-hero">
        <div className="container">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <h1>We’re Here to Support Your Staffing Needs</h1>
          <p>Whether you need long term staffing or urgent cover, our team is ready to help 24/7 across the UK and Ireland.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        {/* PRICING & PRICE MATCH GUARANTEE BANNER */}
        <div className="pricing-banner-card" style={{
          background: 'linear-gradient(135deg, #0e2226, #1c6f6b)',
          borderRadius: '20px',
          padding: '30px 40px',
          color: '#ffffff',
          marginBottom: '50px',
          boxShadow: '0 12px 35px rgba(28, 111, 107, 0.25)',
          border: '1px solid rgba(124, 227, 219, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ background: '#7ce3db', color: '#0e2226', padding: '4px 14px', borderRadius: '50px', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}>
              <i className="fas fa-tags"></i> TRANSPARENT PRICING
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 14px', borderRadius: '50px', fontWeight: '700', fontSize: '0.8rem' }}>
              <i className="fas fa-check-circle"></i> Price Match Guarantee
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', color: '#fff' }}>Competitive &amp; Transparent Rates</h2>
          <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.65', marginBottom: '12px' }}>
            Assist Plus Care UK offers competitive and transparent pricing designed to support care providers without compromising quality. 
            <strong> If you receive a lower quote from another agency, we will match it</strong> — ensuring you receive the best value without sacrificing care standards.
          </p>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
            * Pricing varies based on staff type, shift length, location, and specialist requirements. Fill in the form below or call us directly for a personalised quote.
          </span>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div>
                <h4>Our Address</h4>
                <p>48 Mortise House, 11 Chailey Place, Hayes, UB1 3HW</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
              <div>
                <h4>Phone Numbers (24/7 Support)</h4>
                <p>
                  <a href="tel:02036526052">020 3652 6052</a><br />
                  <a href="tel:07448295850">+44 07448 295850</a>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div>
                <h4>Email Address</h4>
                <p><a href="mailto:admin@assistpluscare.co.uk">admin@assistpluscare.co.uk</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-globe"></i></div>
              <div>
                <h4>Coverage Area</h4>
                <p>Full UK &amp; Ireland Coverage</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-clock"></i></div>
              <div>
                <h4>Operating Hours</h4>
                <p>24/7 Round-the-Clock Emergency Cover &amp; Staffing Assistance</p>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h3>Request Your Care Plan or Staffing Quote</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input type="text" placeholder="Full Name / Organisation" id="quote-name" required />
                <input type="email" placeholder="Email Address" id="quote-email" required />
              </div>
              <div className="form-row">
                <input type="tel" placeholder="Phone Number" id="quote-phone" required />
                <select id="quote-service" required defaultValue="">
                  <option value="" disabled>Select Staffing Requirement</option>
                  <option>Registered Nurses (NHS Experienced)</option>
                  <option>Mental Health Nurses</option>
                  <option>Healthcare Assistants (HCAs)</option>
                  <option>Support Workers</option>
                  <option>Live in Carers</option>
                  <option>Specialist Nursing Services (Stoma/Palliative/Diabetes)</option>
                  <option>Temporary Staffing &amp; Bulk Bookings</option>
                  <option>24/7 Emergency Cover</option>
                </select>
              </div>
              <textarea placeholder="Describe your staffing or care requirements..." rows={5} id="quote-message" required></textarea>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Request Personalised Quote <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
