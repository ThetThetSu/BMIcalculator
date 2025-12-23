-- Create records table for BMI app
CREATE TABLE IF NOT EXISTS records (
  id SERIAL PRIMARY KEY,
  username TEXT,
  email TEXT,
  bmi REAL,
  category TEXT,
  height INTEGER,
  weight INTEGER,
  password VARCHAR,
  savedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);
