-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bmi_records table for BMI calculations
CREATE TABLE IF NOT EXISTS bmi_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  height NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  bmi NUMERIC NOT NULL,
  category TEXT NOT NULL,
  savedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
