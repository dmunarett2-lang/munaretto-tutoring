export type Role = "student" | "admin";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  focus: string | null;
  next_session: string | null;
  sessions_remaining: number;
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

export type Package = {
  id: string;
  name: string;
  category: string | null;
  sessions: number;
  price_cents: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type OrderStatus = "pending" | "paid" | "cancelled";

export type Order = {
  id: string;
  student_id: string | null;
  buyer_name: string;
  buyer_email: string;
  package_id: string | null;
  package_name: string;
  sessions: number;
  amount_cents: number;
  payment_method: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
  paid_at: string | null;
};

export type AppSettings = {
  id: number;
  zelle_handle: string | null;
  calendly_url: string | null;
  notify_email: string | null;
};

export type StudentProgress = {
  id: string;
  student_id: string;
  label: string;
  detail: string | null;
  percent: number;
  sort_order: number;
};

export type StudentSession = {
  id: string;
  student_id: string;
  title: string;
  subtitle: string | null;
  when_text: string | null;
  sort_order: number;
};

export type BookingType = {
  id: string;
  label: string;
  description: string | null;
  calendly_url: string;
  sort_order: number;
  is_active: boolean;
};

export type StudentResource = {
  id: string;
  student_id: string;
  label: string;
  url: string | null;
  sort_order: number;
};
