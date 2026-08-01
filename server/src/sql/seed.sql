INSERT INTO users (name, email, password_hash, role, department) VALUES
('Alex Johnson', 'alex.employee@company.com', '$2a$10$4Gz3E5z4w9w8v7u6t5s4r3q2p1o0n9m8l7k6j5i4h3g2f1e0d', 'Employee', 'Engineering'),
('Sarah Vance', 'sarah.director@company.com', '$2a$10$4Gz3E5z4w9w8v7u6t5s4r3q2p1o0n9m8l7k6j5i4h3g2f1e0d', 'Director', 'Executive'),
('David Miller', 'david.accounts@company.com', '$2a$10$4Gz3E5z4w9w8v7u6t5s4r3q2p1o0n9m8l7k6j5i4h3g2f1e0d', 'Accounts', 'Finance')
ON CONFLICT (email) DO NOTHING;

INSERT INTO vouchers (voucher_number, title, department, category, expense_date, amount, description, status, user_id, signature_url) VALUES
('VCH-2026-001', 'Client Strategy Lunch Meeting', 'Sales', 'Meals & Entertainment', '2026-07-20', 3450.00, 'Quarterly business review lunch with key stakeholder enterprise team.', 'Approved', 1, 'https://placehold.co/200x80/2563eb/ffffff?text=Alex+Signature'),
('VCH-2026-002', 'Cloud Infrastructure Subscription', 'Engineering', 'Software & Tools', '2026-07-22', 18500.00, 'Monthly AWS and database server hosting charges.', 'Submitted', 1, 'https://placehold.co/200x80/2563eb/ffffff?text=Alex+Signature'),
('VCH-2026-003', 'Office Stationery & Printer Ink', 'Operations', 'Office Supplies', '2026-07-25', 1200.00, 'Printer cartridges and notebook stock for office inventory.', 'Draft', 1, NULL)
ON CONFLICT (voucher_number) DO NOTHING;