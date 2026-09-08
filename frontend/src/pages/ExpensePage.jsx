import React, { useState, useEffect } from 'react';
import { expenseService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { CreditCard, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const ExpensePage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Card',
    description: '',
    notes: '',
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseService.getAll();
      setExpenses(res.data);
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
    fetchExpenses();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingExpense(null);
    setFormData({
      amount: '',
      categoryId: categories[0]?.id || '',
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Card',
      description: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setFormData({
      amount: exp.amount,
      categoryId: exp.category?.id || '',
      expenseDate: exp.expenseDate,
      paymentMethod: exp.paymentMethod,
      description: exp.description || '',
      notes: exp.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingExpense) {
        await expenseService.update(editingExpense.id, payload);
        showSuccess('Expense record updated!');
      } else {
        await expenseService.create(payload);
        showSuccess('New expense recorded!');
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save expense.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await expenseService.delete(id);
        showSuccess('Expense record deleted!');
        fetchExpenses();
      } catch (err) {
        showError('Failed to delete expense.');
      }
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (selectedCategory && exp.category?.id !== parseInt(selectedCategory)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const descMatch = exp.description?.toLowerCase().includes(q);
      const catMatch = exp.category?.name.toLowerCase().includes(q);
      const payMatch = exp.paymentMethod?.toLowerCase().includes(q);
      if (!descMatch && !catMatch && !payMatch) return false;
    }
    return true;
  });

  const currencySymbol = user?.currency || '$';
  const totalExpenseSum = filteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Expense Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Monitor and record all your category spending, bills, and transactions.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> <span>Record Expense</span>
        </button>
      </div>

      {/* KPI & Filter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Filtered Expenses</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
              <CreditCard size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--status-error)' }}>
            -{currencySymbol}{totalExpenseSum.toLocaleString()}
          </div>
          <div className="kpi-subtext">{filteredExpenses.length} entries displayed</div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label">Search Expenses</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search description, merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label">Filter Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description / Merchant</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: `${exp.category?.color || '#3b82f6'}15`,
                          color: exp.category?.color || 'var(--text-primary)',
                        }}
                      >
                        {exp.category?.name || 'Expense'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{exp.description || '-'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{exp.paymentMethod}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{exp.expenseDate}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--status-error)' }}>
                      -{currencySymbol}{parseFloat(exp.amount).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(exp)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(exp.id)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No expense entries found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? 'Edit Expense Record' : 'Record Expense'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Expense Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 50.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
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
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-control"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="Card">Credit/Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Digital Wallet">Digital Wallet</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Merchant / Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Starbucks, Electricity Bill"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {editingExpense ? 'Update Expense' : 'Save Expense Record'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ExpensePage;
