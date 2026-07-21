-- Munaretto Tutoring - score-based student progress (current score vs goal)
-- Run in Supabase SQL Editor after 004_categories.sql. Plain ASCII. Safe to re-run.

alter table public.student_progress
  add column if not exists current_score int,
  add column if not exists goal_score int;
