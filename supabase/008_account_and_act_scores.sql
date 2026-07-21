-- Munaretto Tutoring - student phone + current ACT section scores
-- Run in Supabase SQL Editor. Plain ASCII. Safe to re-run.

alter table public.profiles
  add column if not exists phone text,
  add column if not exists act_score_english int,
  add column if not exists act_score_math int,
  add column if not exists act_score_reading int,
  add column if not exists act_score_science int,
  add column if not exists act_score_writing int;
