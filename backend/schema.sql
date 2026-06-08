-- ============================================================
-- Extreme Service Delivery Portal — PostgreSQL Schema
-- Run this once against your database to set up all tables
-- ============================================================

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Seed departments
INSERT INTO departments (name) VALUES
  ('Water'),
  ('Electricity'),
  ('Roads'),
  ('Safety'),
  ('General')
ON CONFLICT (name) DO NOTHING;

-- Users (residents + municipal employees)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contact VARCHAR(20),
  address TEXT,
  password_hash VARCHAR(255) NOT NULL,
  role_name VARCHAR(20) NOT NULL CHECK (role_name IN ('RESIDENT', 'SUPERVISOR', 'MANAGER', 'ADMIN')),
  profile_pic VARCHAR(500),
  department_id INTEGER REFERENCES departments(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Issues reported by residents
CREATE TABLE IF NOT EXISTS issues (
  issue_id SERIAL PRIMARY KEY,
  resident_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  issue_category VARCHAR(50) NOT NULL CHECK (issue_category IN ('electricity', 'water', 'road', 'crime', 'other')),
  location TEXT,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Complicated')),
  issue_image_path VARCHAR(500),
  date_reported TIMESTAMP DEFAULT NOW(),
  verification_count INTEGER DEFAULT 0,
  supervisor_id INTEGER REFERENCES users(id),
  department_id INTEGER REFERENCES departments(id)
);

-- Announcements created by managers/admins
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications for any user
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OTP codes for email-based login verification
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
