# Expense Voucher Management System (VoucherFlow)

> Full-Stack Developer Internship Assignment Submission for ABC Company
> **Website link**: [https://expense-voucher-system-front.onrender.com]
> **Repository**: [https://github.com/vrushali-nalawade/expense-voucher-system.git](https://github.com/vrushali-nalawade/expense-voucher-system.git)

---

## Executive Summary

ABC Company's manual expense reimbursement workflow is digitized into a secure, real-time web application. **VoucherFlow** provides automated voucher generation, interactive e-signature verification, Director approval queues, and Accounts Team audit tracking.

---

## System Architecture & User Roles

### 1. Employee Module
- **Dashboard**: Track total amount claimed, draft counts, pending approvals, approved vouchers, and rejected vouchers.
- **Voucher Operations**: Create claims, save as **Draft**, submit for approval, edit or delete draft vouchers.
- **E-Signature Verification**: Interactive HTML5 signature canvas with 1:1 coordinate calibration and file upload support.
- **Privacy Scoping**: Employees strictly view only their own submitted vouchers.

### 2. Director (Admin) Module
- **Pending Approvals Queue**: Dedicated queue with interactive Director E-Signature verification canvas.
- **Rejection Workflow**: Enforces mandatory rejection remarks when declining expense requests.
- **Org-Wide Audit**: Read-only audit visibility across all employee vouchers.

### 3. Accounts Team Module
- **Reimbursement Payouts**: Monitor approved vouchers ready for financial processing.
- **Voucher Export**: Native Print and Download PDF receipt summary generator.
- **Signature Auditing**: Inspect verified employee and director signatures.

---

## Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons, Axios, React Router v6.
- **Backend**: Node.js, Express.js, RESTful APIs, JWT Authentication, bcrypt Password Hashing.
- **Database**: PostgreSQL (Render PostgreSQL).
- **Email & Auth**: EmailJS / Nodemailer OTP Email Dispatch, Google OAuth 2.0 Identity Services.
- **Deployment**: Render (Static Site for Frontend, Web Service for Backend).

---

## Project Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Git

### 1. Local Installation

```bash
# Clone the repository
git clone https://github.com/vrushali-nalawade/expense-voucher-system.git
cd expense-voucher-system
```

### 2. Frontend Client Setup

```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

### 3. Backend Server Setup

```bash
cd ../server
npm install
cp .env.example .env
npm run dev
```
Server runs on `http://localhost:5000`.

---

## Database Schema Explanation

The PostgreSQL database schema consists of three core relational tables defined in `server/src/sql/schema.sql`:

```sql
-- 1. Users Table
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

-- 2. Vouchers Table
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

-- 3. Password Resets Table
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'
);
```

---

## API Documentation

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with 6-digit OTP verification | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `POST` | `/api/auth/send-otp` | Dispatch email OTP code for signup/reset | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset token | Public |

### Voucher Endpoints (`/api/vouchers`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vouchers` | Fetch vouchers (Supports `employeeOnly`, `status`, `search`) | Authenticated |
| `POST` | `/api/vouchers` | Create new expense voucher claim | Employee |
| `PUT` | `/api/vouchers/:id` | Update draft voucher details | Employee |
| `DELETE` | `/api/vouchers/:id` | Delete draft voucher | Employee |
| `POST` | `/api/vouchers/:id/approve` | Approve voucher with Director E-Signature | Director |
| `POST` | `/api/vouchers/:id/reject` | Reject voucher with rejection reason | Director |

### Dashboard Endpoints (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/employee` | Get personal claim metrics | Employee |
| `GET` | `/api/dashboard/director` | Get executive approval queue metrics | Director |
| `GET` | `/api/dashboard/accounts` | Get organization reimbursement metrics | Accounts |

---

## Assumptions Made During Development

1. **Unique Voucher Number Generation**: Voucher IDs follow the format `VCH-2026-XXX` generated sequentially per submission.
2. **Draft Immutability Rules**: Vouchers in `Submitted`, `Approved`, or `Rejected` states are read-only and cannot be edited by employees.
3. **Signature Mandate**: Employee signatures are required before submission; Director signatures are mandatory before approval.
4. **Data Isolation**: Employees can access strictly their own records, whereas Director and Accounts roles maintain organization-wide audit access.

---

## Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Employee** | `vrushalinalawade108@gmail.com` | `password123` |
| **Director** | `sarah.director@company.com` | `password123` |
| **Accounts** | `david.accounts@company.com` | `password123` |
