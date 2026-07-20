import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Pricing() {
  return (
    <>
      <Nav />

      <header className="pricing-hero">
        <div className="wrap">
          <div className="eyebrow">Rates &amp; packages</div>
          <h1 className="headline" style={{ fontSize: "2.8rem" }}>
            Straightforward <em>pricing.</em>
          </h1>
          <p className="hero-sub">
            Every plan starts with a free consult so we can figure out what you actually need before
            anything is booked. Rates below are billed per session unless noted.
          </p>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-tier">Single Session</div>
              <div className="pricing-rate">Contact for rate</div>
              <div className="pricing-desc">
                One-off help with a specific subject, assignment, or test section — no commitment
                required.
              </div>
              <ul className="pricing-features">
                <li className="pricing-feature">Any high school subject</li>
                <li className="pricing-feature">60-minute session</li>
                <li className="pricing-feature">Book as needed</li>
              </ul>
              <Link href="/#contact" className="pricing-cta">
                Book a consult
              </Link>
            </div>

            <div className="pricing-card highlight">
              <div className="pricing-tier">ACT Prep Package</div>
              <div className="pricing-rate">Contact for rate</div>
              <div className="pricing-desc">
                A multi-session plan built around a full-length practice test and your actual score
                report.
              </div>
              <ul className="pricing-features">
                <li className="pricing-feature">Diagnostic practice test</li>
                <li className="pricing-feature">Section-by-section strategy</li>
                <li className="pricing-feature">Weekly sessions through test day</li>
              </ul>
              <Link href="/#contact" className="pricing-cta">
                Book a consult
              </Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-tier">Essays &amp; Applications</div>
              <div className="pricing-rate">Contact for rate</div>
              <div className="pricing-desc">
                End-to-end support on the personal statement, supplements, and keeping the whole
                application on track.
              </div>
              <ul className="pricing-features">
                <li className="pricing-feature">Brainstorming through final draft</li>
                <li className="pricing-feature">School list &amp; deadline tracking</li>
                <li className="pricing-feature">Common App review</li>
              </ul>
              <Link href="/#contact" className="pricing-cta">
                Book a consult
              </Link>
            </div>
          </div>

          <div className="pricing-note">
            <strong>Not sure which plan fits?</strong> Book a free consult and we&apos;ll figure out
            the right package together — no pressure, no obligation to continue.
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
