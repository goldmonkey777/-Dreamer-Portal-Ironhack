import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';
export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const particles = Array.from({ length: 18 }, (_, index) => index);

  return (
    <main className="landing-shell">
      <div className="landing-stars" />
      <div className="landing-nebula" />

      <div className="landing-container">
        <nav className="landing-nav">
          <Link to="/" className="landing-logo">
            Dreamer<span>Portal</span>
          </Link>
          <div className="landing-nav-links">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-nav-link">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-small">
                  Enter portal
                </Link>
              </>
            )}
          </div>
        </nav>

        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">Dream → Insight → Action</span>
            <h1>Transform dreams into clarity and action.</h1>
            <p>
              DreamerPortal organizes your symbolic records in a simple flow: Cycle → Dream →
              Action. Capture the unconscious and turn it into meaningful steps.
            </p>
            <div className="hero-ctas">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Open my dream cycles
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary">
                    Start your first dream cycle
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    I already have an account
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="portal-ring portal-ring--outer" />
            <div className="portal-ring portal-ring--middle" />
            <div className="portal-ring portal-ring--inner" />
            <div className="portal-core" />
            <div className="hero-symbol hero-symbol--one">✶</div>
            <div className="hero-symbol hero-symbol--two">☾</div>
            <div className="hero-symbol hero-symbol--three">◌</div>
            {particles.map((particle) => (
              <span
                key={particle}
                className="hero-particle"
                style={{
                  '--x': `${(particle * 31) % 100}%`,
                  '--delay': `${particle * 0.45}s`,
                  '--duration': `${7 + (particle % 5)}s`,
                }}
              />
            ))}
          </div>
        </section>

        <section className="content-section">
          <header className="section-header">
            <h2>How it works</h2>
            <p>Three calm steps from inner symbol to outer movement.</p>
          </header>

          <div className="steps-grid">
            <article className="mystic-card step-card">
              <div className="step-icon">◉</div>
              <h3>Create a Dream Cycle</h3>
              <p>
                Choose a theme in your life or a creative journey you want to explore.
              </p>
            </article>

            <article className="mystic-card step-card">
              <div className="step-icon">☾</div>
              <h3>Capture Dreams</h3>
              <p>Record dreams with mood, lucidity, and images.</p>
            </article>

            <article className="mystic-card step-card">
              <div className="step-icon">✦</div>
              <h3>Turn Insight into Action</h3>
              <p>Convert symbolic patterns into tasks and real-world movement.</p>
            </article>
          </div>
        </section>

        <section className="content-section">
          <header className="section-header">
            <h2>Dream visualization</h2>
            <p>A magical journal page, inside your digital sanctuary.</p>
          </header>

          <article className="mystic-card dream-card">
            <div className="dream-row">
              <span className="dream-label">Dream</span>
              <p className="dream-quote">“I was flying above a golden city at sunset.”</p>
            </div>

            <div className="dream-meta-grid">
              <div>
                <span className="dream-label">Mood</span>
                <p>Wonder</p>
              </div>
              <div>
                <span className="dream-label">Lucidity</span>
                <p>3 / 5</p>
              </div>
            </div>

            <div className="dream-action">
              <span className="dream-label">Suggested action</span>
              <p>“Sketch ideas inspired by this dream.”</p>
            </div>
          </article>
        </section>

        <section className="content-section content-section--last">
          <header className="section-header">
            <h2>Enter your inner world</h2>
            <p>DreamerPortal is where symbols, ideas, and meaning become something real.</p>
          </header>

          <div className="hero-ctas hero-ctas--bottom">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Return to my cycles
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary">
                  Start your first dream cycle
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </section>

        <footer className="landing-footer">
          DreamerPortal &copy; {new Date().getFullYear()} · Built for Ironhack Web Dev Bootcamp
        </footer>
      </div>
    </main>
  );
};
