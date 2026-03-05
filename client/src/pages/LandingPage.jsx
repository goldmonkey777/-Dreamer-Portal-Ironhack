import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ───────── inline styles (keeps the app zero-config, no extra CSS file) ───────── */
const palette = {
  bg: '#0b0e17',
  surface: '#151929',
  card: '#1a1f35',
  accent: '#7c5cfc',
  accentHover: '#6a48e8',
  accentGlow: 'rgba(124,92,252,.25)',
  text: '#e2e4ed',
  muted: '#8e92a4',
  border: '#262b42',
  white: '#fff',
};

const s = {
  /* ─── global page ─── */
  page: {
    background: palette.bg,
    color: palette.text,
    minHeight: '100vh',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  container: { maxWidth: 1080, margin: '0 auto', padding: '0 24px' },

  /* ─── nav ─── */
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 0', borderBottom: `1px solid ${palette.border}`,
  },
  logo: { fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: palette.white, textDecoration: 'none' },
  logoAccent: { color: palette.accent },
  navLinks: { display: 'flex', gap: 12, alignItems: 'center' },
  navLink: { color: palette.muted, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color .2s' },

  /* ─── hero ─── */
  hero: { textAlign: 'center', padding: '80px 0 64px' },
  badge: {
    display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: palette.accent, background: palette.accentGlow,
    padding: '6px 16px', borderRadius: 20, marginBottom: 24,
  },
  h1: {
    fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1,
    letterSpacing: '-0.03em', color: palette.white, marginBottom: 20, maxWidth: 720, margin: '0 auto 20px',
  },
  heroSub: { fontSize: 18, color: palette.muted, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 },
  ctas: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: palette.accent, color: palette.white, padding: '14px 32px',
    borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none',
    transition: 'background .2s, transform .15s', border: 'none', cursor: 'pointer',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'transparent', color: palette.muted, padding: '14px 32px',
    borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none',
    border: `1.5px solid ${palette.border}`, transition: 'border-color .2s, color .2s',
  },

  /* ─── how it works ─── */
  sectionTitle: { textAlign: 'center', fontSize: 28, fontWeight: 700, color: palette.white, marginBottom: 8 },
  sectionSub: { textAlign: 'center', color: palette.muted, marginBottom: 48, fontSize: 15 },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 80 },
  stepCard: {
    background: palette.card, borderRadius: 14, padding: '32px 24px',
    border: `1px solid ${palette.border}`, position: 'relative', overflow: 'hidden',
  },
  stepNumber: {
    fontSize: 48, fontWeight: 800, color: palette.accentGlow, position: 'absolute',
    top: 16, right: 20, lineHeight: 1, opacity: 0.5,
  },
  stepIcon: { fontSize: 32, marginBottom: 16 },
  stepTitle: { fontSize: 18, fontWeight: 700, color: palette.white, marginBottom: 8 },
  stepDesc: { color: palette.muted, fontSize: 14, lineHeight: 1.6 },

  /* ─── features ─── */
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 80 },
  featureCard: {
    background: palette.surface, borderRadius: 14, padding: '28px 24px',
    border: `1px solid ${palette.border}`, transition: 'border-color .2s',
  },
  featureIcon: { fontSize: 28, marginBottom: 12 },
  featureTitle: { fontSize: 16, fontWeight: 700, color: palette.white, marginBottom: 6 },
  featureDesc: { color: palette.muted, fontSize: 14, lineHeight: 1.5 },

  /* ─── app preview mock ─── */
  previewWrap: {
    background: palette.surface, borderRadius: 18, border: `1px solid ${palette.border}`,
    padding: '32px 28px', maxWidth: 560, margin: '0 auto 80px', position: 'relative',
    boxShadow: `0 0 60px ${palette.accentGlow}`,
  },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  previewCycle: { fontSize: 14, fontWeight: 600, color: palette.accent, background: palette.accentGlow, padding: '4px 12px', borderRadius: 8 },
  previewDots: { display: 'flex', gap: 6 },
  dot: (c) => ({ width: 10, height: 10, borderRadius: '50%', background: c }),
  previewDreamCard: {
    background: palette.card, borderRadius: 12, padding: '20px 18px',
    border: `1px solid ${palette.border}`, marginBottom: 14,
  },
  previewDreamTitle: { fontSize: 15, fontWeight: 600, color: palette.white, marginBottom: 6 },
  previewDreamBody: { color: palette.muted, fontSize: 13, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 },
  previewMeta: { display: 'flex', gap: 12, fontSize: 12, color: palette.muted },
  previewTag: { background: palette.accentGlow, color: palette.accent, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 },
  previewAction: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: palette.card, borderRadius: 10, padding: '12px 14px',
    border: `1px solid ${palette.border}`,
  },
  previewActionArrow: { color: palette.accent, fontWeight: 700, fontSize: 16 },
  previewActionText: { color: palette.text, fontSize: 13 },

  /* ─── footer ─── */
  footer: {
    textAlign: 'center', padding: '32px 0', borderTop: `1px solid ${palette.border}`,
    color: palette.muted, fontSize: 13, marginTop: 20,
  },
};

/* ───────── component ───────── */
export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* ── NAV ── */}
        <nav style={s.nav}>
          <Link to="/" style={s.logo}>
            Dreamer<span style={s.logoAccent}>Portal</span>
          </Link>
          <div style={s.navLinks}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={s.btnPrimary}>My Cycles</Link>
            ) : (
              <>
                <Link to="/login" style={s.navLink}>Login</Link>
                <Link to="/signup" style={{ ...s.btnPrimary, padding: '10px 22px', fontSize: 14 }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={s.hero}>
          <span style={s.badge}>Dream → Insight → Action</span>
          <h1 style={s.h1}>Turn your dreams into clarity&nbsp;and&nbsp;action</h1>
          <p style={s.heroSub}>
            DreamerPortal organises your symbolic dream records into a simple flow:
            <strong> Cycle → Dream → Action</strong>. Capture the unconscious and convert
            it into concrete steps.
          </p>
          <div style={s.ctas}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={s.btnPrimary}>Open Dashboard →</Link>
            ) : (
              <>
                <Link to="/signup" style={s.btnPrimary}>Start Journaling →</Link>
                <Link to="/login" style={s.btnSecondary}>I already have an account</Link>
              </>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <h2 style={s.sectionTitle}>How it works</h2>
        <p style={s.sectionSub}>Three steps from dream to real-world action</p>
        <div style={s.steps}>
          <div style={s.stepCard}>
            <span style={s.stepNumber}>1</span>
            <div style={s.stepIcon}>🌀</div>
            <h3 style={s.stepTitle}>Create a Dream Cycle</h3>
            <p style={s.stepDesc}>
              Choose a life theme or creative project — relationships, career,
              spiritual growth — and group related dreams together.
            </p>
          </div>
          <div style={s.stepCard}>
            <span style={s.stepNumber}>2</span>
            <div style={s.stepIcon}>🌙</div>
            <h3 style={s.stepTitle}>Capture Dreams</h3>
            <p style={s.stepDesc}>
              Record dream entries with mood tags, lucidity level, and optional
              images. Build a rich archive of your inner world.
            </p>
          </div>
          <div style={s.stepCard}>
            <span style={s.stepNumber}>3</span>
            <div style={s.stepIcon}>⚡</div>
            <h3 style={s.stepTitle}>Turn Insight into Action</h3>
            <p style={s.stepDesc}>
              Convert symbolic patterns into tasks and goals. Track progress and
              turn recurring themes into real-world momentum.
            </p>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <h2 style={s.sectionTitle}>Features</h2>
        <p style={s.sectionSub}>Everything you need to decode your dream life</p>
        <div style={s.features}>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>📖</div>
            <h3 style={s.featureTitle}>Dream Journal</h3>
            <p style={s.featureDesc}>
              Record symbolic dreams with mood, lucidity level, and image
              attachments. Never lose a dream again.
            </p>
          </div>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>🔍</div>
            <h3 style={s.featureTitle}>Insight Tracking</h3>
            <p style={s.featureDesc}>
              Filter by mood and lucidity. Identify recurring patterns and
              symbols across your dream cycles.
            </p>
          </div>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>🚀</div>
            <h3 style={s.featureTitle}>Action Engine</h3>
            <p style={s.featureDesc}>
              Transform dream insights into concrete, trackable tasks. Move from
              reflection to real-world progress.
            </p>
          </div>
        </div>

        {/* ── APP PREVIEW MOCK ── */}
        <h2 style={s.sectionTitle}>See it in action</h2>
        <p style={s.sectionSub}>A glimpse inside DreamerPortal</p>
        <div style={s.previewWrap}>
          <div style={s.previewHeader}>
            <span style={s.previewCycle}>Cycle: Creative Life</span>
            <div style={s.previewDots}>
              <span style={s.dot(palette.accent)} />
              <span style={s.dot('#34d399')} />
              <span style={s.dot(palette.border)} />
            </div>
          </div>

          <div style={s.previewDreamCard}>
            <h4 style={s.previewDreamTitle}>Dream Entry</h4>
            <p style={s.previewDreamBody}>
              "I was flying over a golden city. The buildings were made of light,
              and I could feel a deep sense of freedom..."
            </p>
            <div style={s.previewMeta}>
              <span style={s.previewTag}>mood: wonder</span>
              <span style={s.previewTag}>lucidity: 3/5</span>
              <span style={{ color: palette.muted }}>📎 image attached</span>
            </div>
          </div>

          <div style={s.previewAction}>
            <span style={s.previewActionArrow}>→</span>
            <div>
              <div style={{ ...s.previewActionText, fontWeight: 600 }}>Suggested Action</div>
              <div style={s.previewActionText}>Start sketching ideas from this dream.</div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={s.footer}>
          DreamerPortal &copy; {new Date().getFullYear()} &middot; Built for Ironhack Web Dev Bootcamp
        </footer>
      </div>
    </div>
  );
};
