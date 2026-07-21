-- Munaretto Tutoring - per-section ACT goal scores on each student profile
-- Run in Supabase SQL Editor. Plain ASCII. Safe to re-run.

alter table public.profiles
  add column if not exists act_goal_english int,
  add column if not exists act_goal_math int,
  add column if not exists act_goal_reading int,
  add column if not exists act_goal_science int,
  add column if not exists act_goal_writing int;
