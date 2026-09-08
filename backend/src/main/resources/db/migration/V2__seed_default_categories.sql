-- Seed default Expense Categories
INSERT INTO categories (name, type, icon, color) VALUES
('Food', 'EXPENSE', 'Utensils', '#f59e0b'),
('Transport', 'EXPENSE', 'Car', '#3b82f6'),
('Shopping', 'EXPENSE', 'ShoppingBag', '#ec4899'),
('Bills', 'EXPENSE', 'Receipt', '#ef4444'),
('Entertainment', 'EXPENSE', 'Film', '#8b5cf6'),
('Education', 'EXPENSE', 'GraduationCap', '#10b981'),
('Health', 'EXPENSE', 'HeartPulse', '#06b6d4'),
('Other Expense', 'EXPENSE', 'Tag', '#64748b');

-- Seed default Income Categories
INSERT INTO categories (name, type, icon, color) VALUES
('Salary', 'INCOME', 'Briefcase', '#10b981'),
('Freelance', 'INCOME', 'Laptop', '#8b5cf6'),
('Investments', 'INCOME', 'TrendingUp', '#3b82f6'),
('Gifts', 'INCOME', 'Gift', '#ec4899'),
('Other Income', 'INCOME', 'DollarSign', '#64748b');
