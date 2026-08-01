-- PostgreSQL Database Schema for Render PostgreSQL Deployment

DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Employee', 'Director', 'Accounts')),
    department VARCHAR(100) DEFAULT 'Engineering',
    signature_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vouchers Table
CREATE TABLE vouchers (
    id SERIAL PRIMARY KEY,
    voucher_number VARCHAR(100) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    expense_title VARCHAR(255) NOT NULL,
    expense_category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    expense_description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Pending Approval', 'Approved', 'Rejected')),
    rejection_reason TEXT,
    employee_signature_url TEXT,
    director_signature_url TEXT,
    approval_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password Resets Table
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'
);

-- Seed Default Admin & Employee Users
INSERT INTO users (name, email, password_hash, role, department) VALUES
('Vrushali Nalawade', 'vrushalinalawade108@gmail.com', '$2b$10$e7K.0/x00xYvR55HqD9L4.8Ld6dYQJj2vK.qYx9L8xY7v8v8v8v8v', 'Employee', 'Engineering'),
('Sarah Vance (Director)', 'sarah.director@company.com', '$2b$10$e7K.0/x00xYvR55HqD9L4.8Ld6dYQJj2vK.qYx9L8xY7v8v8v8v8v', 'Director', 'Executive'),
('David Miller (Accounts)', 'david.accounts@company.com', '$2b$10$e7K.0/x00xYvR55HqD9L4.8Ld6dYQJj2vK.qYx9L8xY7v8v8v8v8v', 'Accounts', 'Finance');