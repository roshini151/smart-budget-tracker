import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  TrendingUp,
  CreditCard,
  PieChart,
  BarChart3,
  Target,
  User,
  Settings,
  LogOut,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { label: 'Income', path: '/income', icon: TrendingUp },
    { label: 'Expenses', path: '/expenses', icon: CreditCard },
    { label: 'Budget', path: '/budget', icon: PieChart },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Logo Header */}
      <div style={styles.logoSection}>
        <div style={styles.logoBadge}>
          <Wallet size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={styles.brandTitle}>SmartBudget</h2>
          <span style={styles.brandSub}>Tracker Pro</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={styles.navMenu}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Actions */}
      <div style={styles.footerSection}>
        <div style={styles.userProfileCard}>
          <div style={styles.userAvatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{user?.name || 'User'}</div>
            <div style={styles.userEmail}>{user?.email || 'user@example.com'}</div>
          </div>
          <button onClick={toggleTheme} style={styles.iconBtn} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem 1rem',
    zIndex: 100,
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 0.5rem 1.5rem 0.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: '1.125rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: 1.1,
  },
  brandSub: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--primary)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    margin: '1.5rem 0',
    flex: 1,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '0.9375rem',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: '700',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)',
  },
  userProfileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  iconBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '0.375rem',
    borderRadius: '8px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.625rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--status-error)',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
};

export default Sidebar;
