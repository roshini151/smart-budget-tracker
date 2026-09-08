import React, { useState, useEffect } from 'react';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, DollarSign, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const { showSuccess, showError } = useToast();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currency: '$',
    monthlyIncomePreference: '0',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      setProfileData(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        currency: res.data.currency || '$',
        monthlyIncomePreference: res.data.monthlyIncomePreference || '0',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile({
        name: formData.name,
        email: formData.email,
        currency: formData.currency,
        monthlyIncomePreference: parseFloat(formData.monthlyIncomePreference || 0),
      });
      showSuccess('Profile updated successfully!');
      refreshProfile();
      fetchProfile();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Financial Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Manage your personal details, preferred currency, and financial preferences.
        </p>
      </div>

      <div className="glass-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Currency Symbol</label>
              <select
                className="form-control"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="¥">JPY (¥)</option>
                <option value="C$">CAD (C$)</option>
                <option value="A$">AUD (A$)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Monthly Target Income ({formData.currency})</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g. 5000.00"
                value={formData.monthlyIncomePreference}
                onChange={(e) => setFormData({ ...formData, monthlyIncomePreference: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              <Save size={18} /> <span>Save Profile Changes</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
