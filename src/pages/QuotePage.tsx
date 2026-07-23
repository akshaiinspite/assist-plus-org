import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export const QuotePage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.quote-hero-animate', 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
      );

      gsap.fromTo('.quote-card-animate', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.25, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section className="quote-page-section" ref={pageRef}>
      {/* HERO BANNER */}
      <div className="quote-hero-banner">
        <div className="quote-hero-overlay"></div>
        <div className="container quote-hero-container">
          <Link to="/" className="back-link quote-hero-animate">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <div className="quote-badge quote-hero-animate">
            <i className="fas fa-shield-heart"></i> CQC COMPLIANT &amp; DBS CHECKED
          </div>
          <h1 className="quote-hero-title quote-hero-animate">
            Request a Personalised <span className="about-highlight">Staffing Quote</span>
          </h1>
          <p className="quote-hero-subtitle quote-hero-animate">
            Partner with Assist Plus Care UK for reliable healthcare workforce solutions. Fill out the quick request form below or contact our 24/7 desk directly.
          </p>
        </div>
      </div>

      <div className="container quote-main-container">
        {/* PRICE MATCH GUARANTEE CARD */}
        <div className="quote-price-card quote-card-animate">
          <div className="quote-price-badge-row">
            <span className="quote-price-tag"><i className="fas fa-tags"></i> TRANSPARENT PRICING</span>
            <span className="quote-price-guarantee"><i className="fas fa-circle-check"></i> Price Match Guarantee</span>
          </div>
          <h2>Competitive &amp; Transparent Rates</h2>
          <p>
            Assist Plus Care UK offers competitive rates tailored to support care providers. 
            <strong> If you receive a lower written quote from another healthcare staffing provider, we guarantee to match it</strong> — delivering maximum value without compromising clinical standards.
          </p>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div className="quote-content-grid quote-card-animate">
          {/* LEFT SIDEBAR: CONTACT & COVERAGE CARDS */}
          <div className="quote-sidebar">
            {/* CONTACT DETAILS CARD */}
            <div className="quote-sidebar-box">
              <div className="quote-box-header">
                <div className="quote-box-icon"><i className="fas fa-address-book"></i></div>
                <h3>Contact Information</h3>
              </div>

              <div className="quote-info-item">
                <div className="quote-info-icon"><i className="fas fa-location-dot"></i></div>
                <div>
                  <h4>Office Address</h4>
                  <p>48 Mortise House, 11 Chailey Place, Hayes, UB1 3HW</p>
                </div>
              </div>

              <div className="quote-info-item">
                <div className="quote-info-icon"><i className="fas fa-phone"></i></div>
                <div>
                  <h4>Phone Numbers (24/7 Support)</h4>
                  <p>Office Desk: <a href="tel:02036526052">020 3652 6052</a></p>
                  <p>On-Call Helpline: <a href="tel:07448295850">+44 07448 295850</a></p>
                </div>
              </div>

              <div className="quote-info-item">
                <div className="quote-info-icon"><i className="fas fa-envelope"></i></div>
                <div>
                  <h4>Email Address</h4>
                  <p><a href="mailto:admin@assistpluscare.co.uk">admin@assistpluscare.co.uk</a></p>
                </div>
              </div>
            </div>

            {/* COVERAGE & HOURS CARD */}
            <div className="quote-sidebar-box">
              <div className="quote-box-header">
                <div className="quote-box-icon"><i className="fas fa-clock"></i></div>
                <h3>Coverage &amp; Operations</h3>
              </div>

              <div className="quote-info-item">
                <div className="quote-info-icon"><i className="fas fa-globe"></i></div>
                <div>
                  <h4>Coverage Area</h4>
                  <p>Full UK &amp; Ireland Coverage</p>
                </div>
              </div>

              <div className="quote-info-item">
                <div className="quote-info-icon"><i className="fas fa-headset"></i></div>
                <div>
                  <h4>Operating Hours</h4>
                  <p>24/7 Round-the-Clock Emergency Cover &amp; Staffing Assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CLEAN FORM CARD */}
          <div className="quote-form-card">
            {isSubmitted ? (
              <div className="quote-success-box" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', marginBottom: '1.5rem' }}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem' }}>Request Submitted Successfully!</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '460px', margin: '0 auto 2rem' }}>
                  Thank you for reaching out to Assist Plus Care UK. Our staffing coordinator will review your requirements and get back to you within 30 minutes.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>
                    Submit Another Request
                  </button>
                  <a href="tel:02036526052" className="btn btn-outline">
                    <i className="fas fa-phone"></i> Call 020 3652 6052
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="quote-form-header">
                  <h3>Request Staffing Quote</h3>
                  <p>Complete your requirements below for a prompt, tailored proposal.</p>
                </div>

                <form className="quote-form" onSubmit={handleSubmit}>
                  <div className="quote-form-row">
                    <div className="quote-input-group">
                      <label htmlFor="quote-name">Full Name / Organisation *</label>
                      <input type="text" id="quote-name" placeholder="e.g. John Smith / St Jude Care" required />
                    </div>
                    <div className="quote-input-group">
                      <label htmlFor="quote-email">Email Address *</label>
                      <input type="email" id="quote-email" placeholder="name@organisation.com" required />
                    </div>
                  </div>

                  <div className="quote-form-row">
                    <div className="quote-input-group">
                      <label htmlFor="quote-phone">Phone Number *</label>
                      <input type="tel" id="quote-phone" placeholder="020 3652 6052" required />
                    </div>
                    <div className="quote-input-group">
                      <label htmlFor="quote-service">Staffing Requirement *</label>
                      <select id="quote-service" required defaultValue="">
                        <option value="" disabled>Select Staffing Requirement</option>
                        <option>Registered Nurses (RN)</option>
                        <option>Mental Health Nurses (RMN)</option>
                        <option>Healthcare Assistants (HCAs)</option>
                        <option>Support Workers</option>
                        <option>Live in Carers</option>
                        <option>Specialist Nursing Services</option>
                        <option>Temporary Staffing &amp; Bulk Bookings</option>
                        <option>24/7 Emergency Cover</option>
                      </select>
                    </div>
                  </div>

                  <div className="quote-input-group">
                    <label htmlFor="quote-message">Describe Your Staffing Needs *</label>
                    <textarea 
                      id="quote-message" 
                      rows={5} 
                      placeholder="Provide details on role type, estimated shifts, start date, location, and specific care skills required..." 
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-accent btn-glow quote-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Quote Request <i className="fas fa-paper-plane"></i>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
