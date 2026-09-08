import React, { useState, useEffect } from 'react';
import { goalService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { Target, Plus, DollarSign, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

const GoalsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [depositGoal, setDepositGoal] = useState(null);

  const [depositAmount, setDepositAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: new Date().toISOString().split('T')[0],
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalService.getAll();
      setGoals(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: new Date().toISOString().split('T')[0],
    });
    setIsGoalModalOpen(true);
  };

  const openEditModal = (g) => {
    setEditingGoal(g);
    setFormData({
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      targetDate: g.targetDate,
    });
    setIsGoalModalOpen(true);
  };

  const openDepositModal = (g) => {
    setDepositGoal(g);
    setDepositAmount('');
    setIsDepositModalOpen(true);
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0),
        targetDate: formData.targetDate,
      };

      if (editingGoal) {
        await goalService.update(editingGoal.id, payload);
        showSuccess('Goal updated!');
      } else {
        await goalService.create(payload);
        showSuccess('Savings goal created!');
      }
      setIsGoalModalOpen(false);
      fetchGoals();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save goal.');
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositGoal || !depositAmount) return;
    try {
      await goalService.addDeposit(depositGoal.id, parseFloat(depositAmount));
      showSuccess(`Added deposit to ${depositGoal.name}!`);
      setIsDepositModalOpen(false);
      fetchGoals();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add deposit.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this savings goal?')) {
      try {
        await goalService.delete(id);
        showSuccess('Goal deleted!');
        fetchGoals();
      } catch (err) {
        showError('Failed to delete goal.');
      }
    }
  };

  const currencySymbol = user?.currency || '$';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Financial Savings Goals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Set target savings milestones for major purchases, emergency funds, or investments.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> <span>Create New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>Loading savings goals...</div>
      ) : goals.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {goals.map((g) => {
            const isCompleted = g.status === 'COMPLETED';

            return (
              <div key={g.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{g.name}</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Target Date: {g.targetDate}</span>
                  </div>
                  <span className={`badge ${isCompleted ? 'badge-ok' : 'badge-info'}`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: '700' }}>
                      {currencySymbol}{parseFloat(g.currentAmount).toLocaleString()} / {currencySymbol}{parseFloat(g.targetAmount).toLocaleString()}
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{g.progressPercentage}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, g.progressPercentage)}%`,
                        backgroundColor: isCompleted ? 'var(--status-success)' : 'var(--primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => openDepositModal(g)} className="btn btn-primary btn-sm" disabled={isCompleted}>
                    <DollarSign size={14} /> <span>Add Deposit</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => openEditModal(g)} className="btn btn-secondary btn-sm" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(g.id)} className="btn btn-danger btn-sm" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Target size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Financial Goals Set Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Start building your savings by setting up your first goal!
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> <span>Create Your First Goal</span>
          </button>
        </div>
      )}

      {/* Goal Modal */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}>
        <form onSubmit={handleSubmitGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. House Down Payment, Vacation"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 5000.00"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Saved Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {editingGoal ? 'Update Goal' : 'Save Goal'}
          </button>
        </form>
      </Modal>

      {/* Deposit Modal */}
      <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title={`Add Deposit to "${depositGoal?.name}"`}>
        <form onSubmit={handleDeposit}>
          <div className="form-group">
            <label className="form-label">Deposit Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 250.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Deposit Funds
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
