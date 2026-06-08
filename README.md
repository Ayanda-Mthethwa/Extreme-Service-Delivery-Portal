# Extreme Service Delivery Portal

A full-stack municipal service delivery management system that enables residents to report community issues and allows municipal employees (Admins, Managers, Supervisors) to track, assign, and resolve those issues efficiently.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Roles & Permissions](#roles--permissions)
- [Authentication Flow](#authentication-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Overview

The Extreme Service Delivery Portal bridges the gap between Emalahleni municipality and its residents. Residents can report infrastructure issues (potholes, water outages, electrical faults, etc.), track their status in real time, and receive updates. Municipal staff manage, assign, and resolve issues through role-specific dashboards.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| SCSS / Sass | Styling |
| Bootstrap 5 | Component utilities |
| Chart.js + react-chartjs-2 | Data visualisation |
| FontAwesome | Icons |
| Axios | HTTP client |
| jsPDF | PDF report generation |
| react-datepicker | Date range selection |
| EmailJS | Client-side email (employee registration) |
| Cloudinary (via backend) | Image uploads |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL | Relational database |
| bcryptjs | Password hashing |
| JSON Web Tokens (JWT) | Stateless authentication |
| Nodemailer | OTP and password reset emails |
| Multer + Cloudinary | Profile image upload and storage |
| dotenv | Environment configuration |

---

## Architecture

```
Extreme Service Delivery Portal/
├── frontend/          # React SPA (Create React App)
└── backend/           # Express REST API
```

The frontend and backend are fully decoupled. The React app communicates with the Express API over HTTP. JWT tokens are stored in `localStorage` and attached to every request via an Axios request interceptor.

```
[Browser] ──HTTP──► [Express API :5000] ──SQL──► [PostgreSQL]
                           │
                     [Cloudinary]  (image storage)
                     [Nodemailer]  (OTP / reset emails)
```

---

## Features

### Resident (Citizen)
- Register and log in with OTP-based two-factor authentication
- Report community issues with description, location, category, and optional photo
- Duplicate issue detection before submission
- Real-time issue status tracking
- View a public news feed of reported issues
- Receive notifications on status changes

### Admin
- Create and manage Manager, Supervisor, and Admin accounts
- View all registered municipal employees by role
- Delete accounts
- Generate date-range issue reports with PDF export
- View a monthly bar chart of issues reported per month

### Manager
- View all issues within their department
- Assign issues to Supervisors
- Access assigned issue lists per Supervisor
- Generate and download department reports

### Supervisor
- View issues assigned to them
- Update issue status (Pending → In Progress → Completed)
- Write and submit reports to the department Manager
- Receive notifications on new assignments

---

## Roles & Permissions

| Endpoint category | RESIDENT | SUPERVISOR | MANAGER | ADMIN |
|---|---|---|---|---|
| Report issue | ✅ | — | — | — |
| View own issues | ✅ | — | — | — |
| View dept issues | — | ✅ | ✅ | — |
| Update issue status | — | ✅ | — | — |
| Assign supervisors | — | — | ✅ | — |
| View all employees | — | — | — | ✅ |
| Delete user | — | — | — | ✅ |
| Generate reports | — | — | ✅ | ✅ |

---

## Authentication Flow

1. User submits email + password on the Login page
2. Backend validates credentials and sends a 6-digit OTP to the registered email (valid for 10 minutes)
3. User enters OTP on the verification page
4. Backend verifies OTP, issues a signed JWT (`24h` expiry) containing `id`, `email`, `role_name`, `department_id`
5. JWT is stored in `localStorage` and attached to all subsequent requests via Axios interceptor
6. Route-protected pages check role from the decoded token and redirect if unauthorised

Password reset uses a time-limited token (1 hour) delivered by email link.

---

## Project Structure

```
frontend/src/
├── assets/                  # Images and static files
├── components/
│   ├── auth/                # Login, Signup, OTP, ForgotPassword, ResetPassword
│   └── shared/              # Sidebar, StatCard, PageHeader, SignOutModal
├── pages/
│   ├── citizen/             # Resident-facing pages (ReportIssue, Status, NewsFeed)
│   └── municipal_emp/
│       ├── admin/           # AdminHome, AddEmployment, ViewAccount, Monthly, MonthlyDetail
│       ├── manager/         # ManagerHome, IssueReports, Assigned
│       └── supervisor/      # SupervisorHome, IssueUpdate, WriteReport
├── services/                # Axios service modules (authService, issueService, etc.)
└── scss/                    # Per-component SCSS files

backend/src/
├── config/                  # Database and Cloudinary configuration
├── controllers/             # Route handler logic
├── middleware/              # JWT verification and role-based access control
├── routes/                  # Express route definitions
└── utils/                   # Email service helpers
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Extreme Service Delivery Portal"
```

### 2. Set up the database

```bash
psql -U postgres -f backend/schema.sql
```

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configure environment variables

See [Environment Variables](#environment-variables) below.

### 5. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # nodemon server.js on :5000

# Terminal 2 — Frontend
cd frontend
npm start          # React dev server on :3000
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/extreme_service_delivery

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend — `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000

# EmailJS (employee registration notifications)
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/login` | Initiate login, send OTP | Public |
| POST | `/verify-otp/:email` | Verify OTP, receive JWT | Public |
| POST | `/resend-otp/:email` | Resend OTP | Public |
| POST | `/register/resident` | Register a citizen account | Public |
| POST | `/register/municipal-employer` | Register Manager/Supervisor | Admin |
| POST | `/register/admin` | Register Admin account | Admin |
| POST | `/forgot-password` | Send password reset email | Public |
| POST | `/reset-password` | Reset password with token | Public |

### Issues — `/api/issue`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/my-issues` | Get resident's own issues | Resident |
| GET | `/getAllIssues` | Get issues by date range | Admin/Manager |
| GET | `/dept-issues` | Get department issues | Manager/Supervisor |
| GET | `/issue-counts` | Monthly issue counts for chart | Admin |
| POST | `/report-issue` | Submit a new issue | Resident |
| POST | `/assign-supervisor` | Assign issue to supervisor | Manager |

### Users — `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| DELETE | `/:email` | Delete a user account | Admin |

### Updates — `/api/updates`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/municipal-emps` | List all municipal employees | Authenticated |
| GET | `/departments` | List all departments | Public |
| PUT | `/update-details/:userId` | Update user profile | Authenticated |
| PUT | `/update-profile-picture/:userId` | Upload profile picture | Authenticated |

### Reports — `/api/reports`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get reports by date range | Authenticated |
| POST | `/submit` | Submit a supervisor report | Supervisor |

---

## Deployment

The backend is configured for deployment on **Railway** (`backend/railway.json`). The frontend can be deployed to any static host (Netlify, Vercel, etc.).

Ensure all environment variables are set in the Railway dashboard and that `FRONTEND_URL` is updated to the production frontend URL for correct CORS and email reset link behaviour.

---

## License

This project was developed as part of a municipal service delivery initiative for Emalahleni Local Municipality.
