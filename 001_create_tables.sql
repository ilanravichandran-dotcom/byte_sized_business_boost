-- Migration: 001_create_tables.sql
-- Creates users, reviews, and favorites tables for the application

CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL,
  user_email TEXT REFERENCES users(email) ON DELETE SET NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL,
  user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (business_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_email ON favorites(user_email);
