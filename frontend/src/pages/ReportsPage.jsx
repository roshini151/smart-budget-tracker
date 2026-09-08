import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, CreditCard, PiggyBank, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const ReportsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getSummary(startDate || undefined, endDate || undefined);
      setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const currencySymbol = user?.currency || '$';

  const categoryChartData = analytics?.categorySpending?.map((c) => ({
    name: c.categoryName,
    value: parseFloat(c.totalAmount),
    color: c.color || '#3b82f6',
    pct: c.percentage,
  })) || [];

  const trendChartData = analytics?.monthlyTrends?.map((t) => ({
    label: t.monthLabel,
    Income: parseFloat(t.income),
    Expense: parseFloat(t.expenses),
    Savings: parseFloat(t.savings),
  })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Financial Reports & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            In-depth analysis of revenue trends, spending velocity, and savings capacity.
          </p>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: '150px' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: '150px' }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Period Income</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--status-success)' }}>
            +{currencySymbol}{parseFloat(analytics?.totalIncome || 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Period Expenses</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
              <CreditCard size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--status-error)' }}>
            -{currencySymbol}{parseFloat(analytics?.totalExpenses || 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Net Savings</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
              <PiggyBank size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {currencySymbol}{parseFloat(analytics?.netSavings || 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Savings Rate</span>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
              <BarChart3 size={22} />
            </div>
          </div>
          <div className="kpi-value">{analytics?.savingsRatePercentage || 0}%</div>
          <div className="kpi-subtext">Percentage of income retained</div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Monthly Trend Area Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>6-Month Income vs Expense Trend</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData}>
                <XAxis dataKey="label" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
                <Legend />
                <Area type="monotone" dataKey="Income" stroke="#10b981" fill="rgba(16, 185, 129, 0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" fill="rgba(239, 68, 68, 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Category Distribution</h3>
          {categoryChartData.length > 0 ? (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No expense data recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
