import { Shield, Clock, Star, Award } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="section trust-section">
      <div className="container">
        <div className="trust-grid">
          <div className="trust-item">
            <Shield className="trust-icon" />
            <h3 className="trust-title">Vetted Professionals</h3>
            <p className="trust-desc">Every technician passes a rigorous background check and skills assessment.</p>
          </div>
          <div className="trust-item">
            <Clock className="trust-icon" />
            <h3 className="trust-title">On-Time Guarantee</h3>
            <p className="trust-desc">We respect your time. If we're late, you get a discount on your service.</p>
          </div>
          <div className="trust-item">
            <Star className="trust-icon" />
            <h3 className="trust-title">Quality Assured</h3>
            <p className="trust-desc">Our work is backed by a 100% satisfaction guarantee for 30 days.</p>
          </div>
          <div className="trust-item">
            <Award className="trust-icon" />
            <h3 className="trust-title">Top Rated</h3>
            <p className="trust-desc">Join thousands of happy customers who rate our service 4.9/5 stars.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
