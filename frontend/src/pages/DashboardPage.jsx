import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  PieChart as PieIcon,
  Plus,
  Sparkles
} from 'lucide-react';
import { dashboardService, incomeService, expenseService, budgetService, goalService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [categories, setCategories] = useState([]);

  // Form states
  const [incomeForm, setIncomeForm] = useState({ amount: '', source: '', incomeDate: new Date().toISOString().split('T')[0], description: '', categoryId: '' });
  const [expenseForm, setExpenseForm] = useState({ amount: '', categoryId: '', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'Card', description: '' });
  const [budgetForm, setBudgetForm] = useState({ categoryId: '', amount: '', budgetMonth: new Date().getMonth() + 1, budgetYear: new Date().getFullYear() });
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', currentAmount: '0', targetDate: new Date().toISOString().split('T')[0] });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getSummary();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCategories();
  }, []);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await incomeService.create({
        ...incomeForm,
        amount: parseFloat(incomeForm.amount),
        categoryId: incomeForm.categoryId ? parseInt(incomeForm.categoryId) : null,
      });
      showSuccess('Income recorded successfully!');
      setActiveModal(null);
      fetchDashboard();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add income.');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await expenseService.create({
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        categoryId: parseInt(expenseForm.categoryId),
      });
      showSuccess('Expense recorded successfully!');
      setActiveModal(null);
      fetchDashboard();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add expense.');
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetService.create({
        ...budgetForm,
        amount: parseFloat(budgetForm.amount),
        categoryId: parseInt(budgetForm.categoryId),
        budgetMonth: parseInt(budgetForm.budgetMonth),
        budgetYear: parseInt(budgetForm.budgetYear),
      });
      showSuccess('Category budget saved successfully!');
      setActiveModal(null);
      fetchDashboard();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to set budget.');
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await goalService.create({
        ...goalForm,
        targetAmount: parseFloat(goalForm.targetAmount),
        currentAmount: parseFloat(goalForm.currentAmount || 0),
      });
      showSuccess('Financial goal created!');
      setActiveModal(null);
      fetchDashboard();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add goal.');
    }
  };

  const currencySymbol = user?.currency || '$';

  if (loading && !data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Financial Dashboard...</h2>
      </div>
    );
  }

  const chartCategoryData = data?.categoryBreakdown?.map((item) => ({
    name: item.categoryName,
    value: parseFloat(item.totalAmount),
    color: item.color || '#3b82f6',
  })) || [];

  const barComparisonData = [
    { name: 'Income vs Expense', Income: parseFloat(data?.totalIncome || 0), Expense: parseFloat(data?.totalExpenses || 0) }
  ];

  return (
    <div style={styles.container}>
      {/* Header & Quick Actions */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Financial Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Welcome back, {user?.name}! Here is your financial overview.
          </p>
        </div>

        <div style={styles.actionButtons}>
          <button onClick={() => setActiveModal('income')} className="btn btn-primary btn-sm">
            <Plus size={16} /> <span>Add Income</span>
          </button>
          <button onClick={() => setActiveModal('expense')} className="btn btn-secondary btn-sm">
            <Plus size={16} /> <span>Add Expense</span>
          </button>
          <button onClick={() => setActiveModal('budget')} className="btn btn-secondary btn-sm">
            <Plus size={16} /> <span>Set Budget</span>
          </button>
          <button onClick={() => setActiveModal('goal')} className="btn btn-secondary btn-sm">
            <Plus size={16} /> <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={styles.kpiGrid}>
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Net Balance</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
              <Wallet size={22} />
            </div>
          </div>
          <div className="kpi-value">{currencySymbol}{parseFloat(data?.totalBalance || 0).toLocaleString()}</div>
          <div className="kpi-subtext">Total cumulative balance</div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Income</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--status-success)' }}>
            +{currencySymbol}{parseFloat(data?.totalIncome || 0).toLocaleString()}
          </div>
          <div className="kpi-subtext">Recorded earnings</div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Expenses</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
              <CreditCard size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--status-error)' }}>
            -{currencySymbol}{parseFloat(data?.totalExpenses || 0).toLocaleString()}
          </div>
          <div className="kpi-subtext">Total spending</div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Remaining Budget</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
              <PieIcon size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {currencySymbol}{parseFloat(data?.totalRemainingBudget || 0).toLocaleString()}
          </div>
          <div className="kpi-subtext">Available for current month</div>
        </div>
      </div>

      {/* Main Charts & Smart Insights Row */}
      <div style={styles.mainGrid}>
        {/* Left Column: Visual Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Income vs Expenses Bar Chart */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Income vs Expense Comparison</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barComparisonData}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
                  <Legend />
                  <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem' }}>Recent Activity</h3>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Latest transactions</span>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title / Source</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentActivity?.length > 0 ? (
                    data.recentActivity.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          <span className={`badge ${tx.type === 'INCOME' ? 'badge-ok' : 'badge-exceeded'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>{tx.title}</td>
                        <td>{tx.category?.name || 'General'}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: tx.type === 'INCOME' ? 'var(--status-success)' : 'var(--status-error)' }}>
                          {tx.type === 'INCOME' ? '+' : '-'}{currencySymbol}{parseFloat(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No transactions recorded yet. Use the actions above to add your first income or expense!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Category Breakdown & Smart Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Smart Insights Panel */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.125rem' }}>Smart Insights</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {data?.smartInsights?.map((insight) => (
                <div
                  key={insight.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${
                      insight.type === 'ALERT' ? 'var(--status-error)' : insight.type === 'WARNING' ? 'var(--status-warning)' : 'var(--primary)'
                    }`,
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {insight.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Spending Pie Chart */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Spending by Category</h3>
            {chartCategoryData.length > 0 ? (
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {chartCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No category expenses logged yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Action Modals --- */}
      {/* 1. Add Income Modal */}
      <Modal isOpen={activeModal === 'income'} onClose={() => setActiveModal(null)} title="Record New Income">
        <form onSubmit={handleAddIncome}>
          <div className="form-group">
            <label className="form-label">Income Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 5000.00"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Income Source</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Monthly Salary, Client Project"
              value={incomeForm.source}
              onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={incomeForm.incomeDate}
              onChange={(e) => setIncomeForm({ ...incomeForm, incomeDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Additional notes"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Income Record
          </button>
        </form>
      </Modal>

      {/* 2. Add Expense Modal */}
      <Modal isOpen={activeModal === 'expense'} onClose={() => setActiveModal(null)} title="Record New Expense">
        <form onSubmit={handleAddExpense}>
          <div className="form-group">
            <label className="form-label">Expense Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 45.00"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={expenseForm.categoryId}
              onChange={(e) => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.filter(c => c.type === 'EXPENSE').map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={expenseForm.expenseDate}
              onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-control"
              value={expenseForm.paymentMethod}
              onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
            >
              <option value="Card">Credit/Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Digital Wallet">Digital Wallet (PayPal, Apple Pay)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description / Merchant</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Groceries at Supermarket"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Expense Record
          </button>
        </form>
      </Modal>

      {/* 3. Add Budget Modal */}
      <Modal isOpen={activeModal === 'budget'} onClose={() => setActiveModal(null)} title="Create Monthly Category Budget">
        <form onSubmit={handleAddBudget}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={budgetForm.categoryId}
              onChange={(e) => setBudgetForm({ ...budgetForm, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.filter(c => c.type === 'EXPENSE').map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Limit ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 500.00"
              value={budgetForm.amount}
              onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Month (1-12)</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-control"
                value={budgetForm.budgetMonth}
                onChange={(e) => setBudgetForm({ ...budgetForm, budgetMonth: e.target.value })}
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
                value={budgetForm.budgetYear}
                onChange={(e) => setBudgetForm({ ...budgetForm, budgetYear: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Set Monthly Budget
          </button>
        </form>
      </Modal>

      {/* 4. Add Goal Modal */}
      <Modal isOpen={activeModal === 'goal'} onClose={() => setActiveModal(null)} title="Create Financial Savings Goal">
        <form onSubmit={handleAddGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Emergency Fund, New Laptop, Vacation"
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 3000.00"
              value={goalForm.targetAmount}
              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Savings Deposit ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 500.00"
              value={goalForm.currentAmount}
              onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Completion Date</label>
            <input
              type="date"
              className="form-control"
              value={goalForm.targetDate}
              onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Financial Goal
          </button>
        </form>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
  },
};

export default DashboardPage;
