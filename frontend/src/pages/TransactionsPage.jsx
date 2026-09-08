import React, { useState, useEffect } from 'react';
import { transactionService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Calendar, ArrowRightLeft, Download } from 'lucide-react';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [type, setType] = useState('ALL');
  const [categoryId, setCategoryId] = useState('');
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getAll({
        type: type !== 'ALL' ? type : undefined,
        categoryId: categoryId || undefined,
        query: query || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTransactions(res.data);
    } catch (e) {
      console.error(e);
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
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [type, categoryId, query, startDate, endDate]);

  const currencySymbol = user?.currency || '$';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Unified Transactions Ledger</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          View, search, and filter all income and expense transactions in one centralized view.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={styles.filterGrid}>
          {/* Search Box */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={styles.inputIcon} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search source, description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Transaction Type Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Transaction Type</label>
            <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ALL">All Transactions</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Title / Description</th>
                <th>Category</th>
                <th>Payment / Source</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tx.id}</td>
                    <td>
                      <span className={`badge ${tx.type === 'INCOME' ? 'badge-ok' : 'badge-exceeded'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{tx.title}</td>
                    <td>{tx.category?.name || 'General'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx.paymentMethodOrSource || '-'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: tx.type === 'INCOME' ? 'var(--status-success)' : 'var(--status-error)' }}>
                      {tx.type === 'INCOME' ? '+' : '-'}{currencySymbol}{parseFloat(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No matching transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  inputIcon: {
    position: 'absolute',
    left: '0.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
};

export default TransactionsPage;
