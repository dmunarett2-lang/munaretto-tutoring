/* ============================================================
   DEMO DATA — placeholder only.
   This hardcoded data stands in for a real database. It will be
   replaced by Supabase (Postgres) tables + row-level security in
   the auth milestone. Nothing here is persisted or secured.
   ============================================================ */

export type Student = {
  name: string;
  focus: string;
  email: string;
  next: string;
};

export type Inquiry = {
  name: string;
  email: string;
  message: string;
  status: string;
};

export const demoStudents: Student[] = [
  { name: "Ava Thompson", focus: "ACT Prep", email: "demo@student.com", next: "Thu, 4:30 PM" },
  { name: "Jack Reilly", focus: "College Essays", email: "jack.r@email.com", next: "Fri, 3:00 PM" },
  { name: "Sofia Martinez", focus: "Applications", email: "sofia.m@email.com", next: "Mon, 5:00 PM" },
];

export const demoInquiries: Inquiry[] = [];
