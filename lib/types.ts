export type Role = "student" | "admin";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  focus: string | null;
  next_session: string | null;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};
