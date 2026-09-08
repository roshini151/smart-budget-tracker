import React, { useState, useEffect } from 'react';
import { incomeService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { TrendingUp, Plus, Edit2, Trash2, Search } from 'lucide-react';

const IncomePage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    incomeDate: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
    categoryId: '',
  });

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await incomeService.getAll();
      setIncomes(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.filter(c => c.type === 'INCOME'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingIncome(null);
    setFormData({
      amount: '',
      source: '',
      incomeDate: new Date().toISOString().split('T')[0],
      description: '',
      notes: '',
      categoryId: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (inc) => {
    setEditingIncome(inc);
    setFormData({
      amount: inc.amount,
      source: inc.source,
      incomeDate: inc.incomeDate,
      description: inc.description || '',
      notes: inc.notes || '',
      categoryId: inc.category?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      if (editingIncome) {
        await incomeService.update(editingIncome.id, payload);
        showSuccess('Income record updated!');
      } else {
        await incomeService.create(payload);
        showSuccess('New income recorded!');
      }
      setIsModalOpen(false);
      fetchIncomes();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save income.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await incomeService.delete(id);
        showSuccess('Income record deleted!');
        fetchIncomes();
      } catch (err) {
        showError('Failed to delete income.');
      }
    }
  };

  const currencySymbol = user?.currency || '$';
  const totalIncomeSum = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Income Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Record and manage all revenue streams, salary, investments, and side income.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> <span>Record Income</span>
        </button>
      </div>

      {/* KPI Card */}
      <div className="glass-card kpi-card" style={{ maxWidth: '340px' }}>
        <div className="kpi-header">
          <span className="kpi-title">Total Income Recorded</span>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: 'var(--status-success)' }}>
          +{currencySymbol}{totalIncomeSum.toLocaleString()}
        </div>
        <div className="kpi-subtext">{incomes.length} total entries</div>
      </div>

      {/* Income Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading income records...
                  </td>
                </tr>
              ) : incomes.length > 0 ? (
                incomes.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ fontWeight: '700' }}>{inc.source}</td>
                    <td>{inc.category?.name || 'Salary/Income'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{inc.description || '-'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{inc.incomeDate}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--status-success)' }}>
                      +{currencySymbol}{parseFloat(inc.amount).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(inc)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(inc.id)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No income records found. Click "Record Income" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIncome ? 'Edit Income Entry' : 'Record Income'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Income Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 4500.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Source</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Employer Inc, Freelance Client"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Category (Optional)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.incomeDate}
              onChange={(e) => setFormData({ ...formData, incomeDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Short description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {editingIncome ? 'Update Record' : 'Save Income Entry'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default IncomePage;
