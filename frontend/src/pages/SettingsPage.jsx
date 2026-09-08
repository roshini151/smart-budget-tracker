import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Sun, Moon, Shield, Bell } from 'lucide-react';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Application Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Customize your workspace theme and review security preferences.
        </p>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem' }}>Appearance</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: '600' }}>Color Theme</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Switch between Light Mode and Premium Dark Mode
            </div>
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem' }}>Security & Authentication</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={20} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: '600' }}>Stateless JWT Session Active</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Authenticated as {user?.email} with BCrypt 256-bit password protection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
