import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Target,
  ArrowRight,
  Sparkles,
  BarChart3,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoBadge}>
            <Wallet size={24} color="#ffffff" />
          </div>
          <span style={styles.brandName}>SmartBudgetTracker</span>
        </div>

        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#how-it-works" style={styles.navLink}>How It Works</a>
          <a href="#benefits" style={styles.navLink}>Benefits</a>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <Sparkles size={16} color="var(--primary)" />
            <span>Smart Personal Finance Platform</span>
          </div>
          <h1 style={styles.heroTitle}>
            Take Control of Your Money. <br />
            <span style={styles.heroGradient}>Build a Smarter Financial Future.</span>
          </h1>
          <p style={styles.heroDescription}>
            Track expenses, manage category budgets, monitor savings goals, and receive automated smart financial insights—all in one secure, modern platform.
          </p>

          <div style={styles.heroCtas}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              <span>Start Free Today</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>
              <span>Live Demo Login</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div style={styles.heroMockupContainer}>
          <div className="glass-card" style={styles.heroMockupCard}>
            <div style={styles.mockupHeader}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Net Financial Balance</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>$24,850.00</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge badge-ok">+14.2% this month</span>
              </div>
            </div>

            <div style={styles.mockupGrid}>
              <div style={{ ...styles.mockupKpi, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Income</span>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--status-success)' }}>+$6,500.00</h4>
              </div>
              <div style={{ ...styles.mockupKpi, backgroundColor: 'rgba(239, 68, 68, 0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Expenses</span>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--status-error)' }}>-$2,410.00</h4>
              </div>
              <div style={{ ...styles.mockupKpi, backgroundColor: 'rgba(99, 102, 241, 0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Savings</span>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--accent-indigo)' }}>$4,090.00</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Everything You Need to Master Your Money</h2>
          <p style={styles.sectionSub}>Comprehensive financial management built with enterprise security and speed.</p>
        </div>

        <div style={styles.grid3}>
          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <h3>Income & Expense Tracking</h3>
            <p>Categorize transactions, filter by date ranges, attach notes, and maintain a unified ledger.</p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, backgroundColor: 'rgba(59, 130, 246, 0.12)' }}>
              <PieChart size={24} color="#3b82f6" />
            </div>
            <h3>Smart Monthly Budgets</h3>
            <p>Set category spending limits with automated warning triggers before you exceed your budget.</p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, backgroundColor: 'rgba(139, 92, 246, 0.12)' }}>
              <Sparkles size={24} color="#8b5cf6" />
            </div>
            <h3>Rule-Based Financial Insights</h3>
            <p>Receive automatic alerts for deficit warnings, high category concentrations, and savings milestones.</p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, backgroundColor: 'rgba(245, 158, 11, 0.12)' }}>
              <BarChart3 size={24} color="#f59e0b" />
            </div>
            <h3>Reports & Analytics</h3>
            <p>Interactive chart breakdowns, monthly trends, and spending velocity analysis.</p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, backgroundColor: 'rgba(236, 72, 153, 0.12)' }}>
              <Target size={24} color="#ec4899" />
            </div>
            <h3>Savings & Financial Goals</h3>
            <p>Track progress toward major purchases, emergency funds, or investments with deposit milestones.</p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, backgroundColor: 'rgba(6, 182, 212, 0.12)' }}>
              <ShieldCheck size={24} color="#06b6d4" />
            </div>
            <h3>Enterprise JWT Security</h3>
            <p>Password hashing with BCrypt, stateless JWT authentication, and strict multi-user data isolation.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ ...styles.section, backgroundColor: 'var(--bg-secondary)' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How SmartBudgetTracker Works</h2>
          <p style={styles.sectionSub}>Start managing your finances in 3 simple steps.</p>
        </div>

        <div style={styles.stepsContainer}>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>1</div>
            <h3>Sign Up & Create Profile</h3>
            <p>Set up your account in seconds and choose your preferred currency symbol.</p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>2</div>
            <h3>Record Income & Expenses</h3>
            <p>Log transactions across default or custom categories with date-based tagging.</p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>3</div>
            <h3>Set Budgets & Track Goals</h3>
            <p>Monitor real-time progress, receive warning alerts, and build lasting financial habits.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div className="glass-card" style={styles.ctaCard}>
          <h2>Ready to Take Control of Your Financial Life?</h2>
          <p style={{ marginTop: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Join thousands of users building smarter spending habits today.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
            <span>Create Free Account</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wallet size={20} color="var(--primary)" />
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>SmartBudgetTracker</span>
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} SmartBudgetTracker. Production-Ready Full-Stack Web Application.
          </span>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 3rem',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
  },
  navLink: {
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '0.9375rem',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    padding: '5rem 3rem',
    maxWidth: '1280px',
    margin: '0 auto',
    alignItems: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.375rem 0.875rem',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: '700',
    fontSize: '0.8125rem',
    width: 'fit-content',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    lineHeight: '1.15',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroDescription: {
    fontSize: '1.125rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  heroCtas: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  heroMockupContainer: {
    position: 'relative',
  },
  heroMockupCard: {
    border: '1px solid var(--border-color)',
    padding: '2rem',
  },
  mockupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
  },
  mockupGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
  },
  mockupKpi: {
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  section: {
    padding: '5rem 3rem',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: '1.0625rem',
    color: 'var(--text-secondary)',
    marginTop: '0.5rem',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.75rem',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  stepCard: {
    textAlign: 'center',
    padding: '2rem',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem auto',
  },
  ctaSection: {
    padding: '4rem 3rem',
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
  },
  ctaCard: {
    padding: '3rem',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
    border: '1px solid var(--primary-light)',
  },
  footer: {
    padding: '2rem 3rem',
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export default LandingPage;
