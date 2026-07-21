import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Headshot from "@/components/Headshot";

export default function Home() {
  return (
    <>
      <Nav />

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Notre Dame · ACT prep &amp; college admissions</div>
            <h1 className="headline">
              Get the score.
              <br />
              Get the <em>letter.</em>
            </h1>
            <p className="hero-sub">
              I&apos;m Dominic Munaretto, a student at the University of Notre Dame. I tutor high
              schoolers in every subject, with a focus on ACT prep, college essays, and the
              application process — the parts that actually move the needle on admissions.
            </p>
            <div className="hero-actions">
              <Link href="/#contact" className="btn-primary">
                Book a free consult
              </Link>
              <Link href="/booking" className="btn-ghost">
                See what I offer →
              </Link>
            </div>
          </div>
          <div className="grade-panel">
            <div className="grade-card">
              <div className="circle-mark">✓</div>
              <span className="note n1">let&apos;s talk</span>
              <div className="grade-row">
                <span className="grade-label">Format</span>
                <span className="grade-num">1:1</span>
              </div>
              <div className="line"></div>
              <div className="grade-row">
                <span className="grade-label">Subjects covered</span>
                <span className="grade-num">All</span>
              </div>
              <div className="line"></div>
              <div className="grade-row">
                <span className="grade-label">First consult</span>
                <span className="grade-num">Free</span>
              </div>
              <span className="note n2">✓ no pressure</span>
            </div>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section id="services">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">What I offer</div>
            <h2 className="section-title">
              Tutoring built around what colleges actually look at
            </h2>
            <p className="section-desc">
              Every high school subject is on the table — but most of my work centers on the two
              things that move admissions outcomes most: test scores and the application itself.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card featured">
              <div className="service-tag">Most requested</div>
              <div className="service-name">ACT Test Prep</div>
              <div className="service-desc">
                Section-by-section strategy, timed practice tests, and targeted review built around
                your score report — not a generic curriculum.
              </div>
            </div>
            <div className="service-card featured">
              <div className="service-tag">Most requested</div>
              <div className="service-name">College Essays</div>
              <div className="service-desc">
                From blank page to final draft. Brainstorming, structure, voice, and line edits on
                the personal statement and supplements.
              </div>
            </div>
            <div className="service-card">
              <div className="service-tag">Applications</div>
              <div className="service-name">College Applications</div>
              <div className="service-desc">
                Building a balanced school list, keeping deadlines straight, and making sure every
                part of the Common App is actually finished.
              </div>
            </div>
            <div className="service-card">
              <div className="service-tag">All subjects</div>
              <div className="service-name">High School Subjects</div>
              <div className="service-desc">
                Math, science, English, history, and language coursework for any grade level —
                homework help through exam prep.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="results-band" id="results">
        <div className="wrap">
          <div className="results-grid">
            <div className="result-item">
              <div className="result-num">1:1</div>
              <div className="result-label">Every session, fully personalized</div>
            </div>
            <div className="result-item">
              <div className="result-num">Free</div>
              <div className="result-label">No-cost first consult, no pressure to continue</div>
            </div>
            <div className="result-item">
              <div className="result-num">ND</div>
              <div className="result-label">
                Current Notre Dame student, tutoring since high school
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="wrap about-grid">
          <Headshot />
          <div className="about-copy">
            <div className="kicker">About your tutor</div>
            <h2 className="section-title">Hi, I&apos;m Dominic.</h2>
            <p>
              I&apos;m currently a student at the{" "}
              <strong>University of Notre Dame</strong>. I started tutoring in high school and have
              kept working with students ever since — through the ACT, through their essays, and
              through the whole college application process.
            </p>
            <p>
              I know what admissions officers are actually looking for, because I was on the other
              side of that process recently myself. I bring that perspective into every session,
              whether we&apos;re breaking down a science subtest or rewriting a personal statement
              for the third time.
            </p>
            <div className="badge-row">
              <span className="badge">All high school grade levels</span>
              <span className="badge">All subjects</span>
              <span className="badge">ACT specialist</span>
              <span className="badge">Essay &amp; application coaching</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">From families I&apos;ve worked with</div>
            <h2 className="section-title">Results, in their words</h2>
          </div>
          <div className="test-grid">
            <div className="test-card">
              <div className="test-quote">
                &quot;Our son&apos;s composite jumped six points after two months. More than that, he
                actually understood why he was missing questions.&quot;
              </div>
              <div className="test-name">Parent of a junior</div>
              <div className="test-meta">ACT Prep</div>
            </div>
            <div className="test-card">
              <div className="test-quote">
                &quot;Dominic helped me find an essay topic I actually cared about, then made me a
                much better writer than I was before.&quot;
              </div>
              <div className="test-name">High school senior</div>
              <div className="test-meta">College Essays</div>
            </div>
            <div className="test-card">
              <div className="test-quote">
                &quot;He kept our whole application timeline organized when we couldn&apos;t. Every
                deadline was hit, no scrambling.&quot;
              </div>
              <div className="test-name">Parent of a senior</div>
              <div className="test-meta">College Applications</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="wrap contact-grid">
          <div>
            <div className="kicker">Get started</div>
            <h2 className="section-title">Book a free consult</h2>
            <p className="section-desc">
              Tell me a bit about your student and what you&apos;re working toward — test scores,
              essays, applications, or a specific subject. I&apos;ll follow up within a day to set up
              a first session.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
