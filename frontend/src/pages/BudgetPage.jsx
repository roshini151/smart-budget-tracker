import React, { useState, useEffect } from 'react';
import { budgetService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { PieChart, Plus, AlertTriangle, CheckCircle2, AlertCircle, Edit2, Trash2 } from 'lucide-react';

const BudgetPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Month & Year Selector
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    budgetMonth: new Date().getMonth() + 1,
    budgetYear: new Date().getFullYear(),
  });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getAll(selectedMonth, selectedYear);
      setBudgets(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.filter(c => c.type === 'EXPENSE'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const openCreateModal = () => {
    setEditingBudget(null);
    setFormData({
      categoryId: categories[0]?.id || '',
      amount: '',
      budgetMonth: selectedMonth,
      budgetYear: selectedYear,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBudget(b);
    setFormData({
      categoryId: b.category?.id || '',
      amount: b.amount,
      budgetMonth: b.budgetMonth,
      budgetYear: b.budgetYear,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        budgetMonth: parseInt(formData.budgetMonth),
        budgetYear: parseInt(formData.budgetYear),
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.id, payload);
        showSuccess('Budget updated successfully!');
      } else {
        await budgetService.create(payload);
        showSuccess('Category budget created!');
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save budget.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this budget?')) {
      try {
        await budgetService.delete(id);
        showSuccess('Budget removed!');
        fetchBudgets();
      } catch (e) {
        showError('Failed to remove budget.');
      }
    }
  };

  const currencySymbol = user?.currency || '$';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Budget Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Set category limits and track actual spending to prevent budget overruns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Period Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '130px' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2026, m - 1, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="form-control"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '90px' }}
            />
          </div>

          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Budget Cards Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>Loading budget plans...</div>
      ) : budgets.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {budgets.map((b) => {
            const isExceeded = b.status === 'EXCEEDED';
            const isWarning = b.status === 'WARNING';
            const progressColor = isExceeded ? 'var(--status-error)' : isWarning ? 'var(--status-warning)' : 'var(--primary)';

            return (
              <div key={b.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge" style={{ backgroundColor: `${b.category?.color || '#3b82f6'}15`, color: b.category?.color || 'var(--text-primary)' }}>
                      {b.category?.name}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>
                      {currencySymbol}{parseFloat(b.amount).toFixed(2)}
                    </h3>
                  </div>

                  <span className={`badge ${isExceeded ? 'badge-exceeded' : isWarning ? 'badge-warning' : 'badge-ok'}`}>
                    {b.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                    <span>Spent: {currencySymbol}{parseFloat(b.spentAmount).toFixed(2)} ({b.percentageUsed}%)</span>
                    <span>Rem: {currencySymbol}{parseFloat(b.remainingAmount).toFixed(2)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, b.percentageUsed)}%`,
                        backgroundColor: progressColor,
                      }}
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => openEditModal(b)} className="btn btn-secondary btn-sm">
                    <Edit2 size={14} /> <span>Edit</span>
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="btn btn-danger btn-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <PieChart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Budgets Defined for {new Date(2026, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' })} {selectedYear}</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Set category limits to keep your spending under control.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> <span>Set First Category Budget</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBudget ? 'Edit Budget' : 'Create Category Budget'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Budget Limit ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 600.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Month</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-control"
                value={formData.budgetMonth}
                onChange={(e) => setFormData({ ...formData, budgetMonth: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="number"
                min="2020"
                max="2100"
                className="form-control"
                value={formData.budgetYear}
                onChange={(e) => setFormData({ ...formData, budgetYear: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {editingBudget ? 'Update Budget' : 'Save Budget'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetPage;
