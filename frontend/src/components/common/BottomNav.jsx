import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, PieChart, BarChart3, Target } from 'lucide-react';

const BottomNav = () => {
  const items = [
    { label: 'Dash', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Txns', path: '/transactions', icon: ArrowRightLeft },
    { label: 'Budget', path: '/budget', icon: PieChart },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Goals', path: '/goals', icon: Target },
  ];

  return (
    <div style={styles.bottomBar}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
            })}
          >
            <Icon size={20} />
            <span style={{ fontSize: '0.6875rem' }}>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

const styles = {
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 99,
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  linkActive: {
    color: 'var(--primary)',
  },
};

export default BottomNav;
