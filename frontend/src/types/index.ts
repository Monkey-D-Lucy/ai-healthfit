export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  full_name: string;
}

export interface HealthMetric {
  id: number;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  source: string;
  notes?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  type: string;
  reason: string;
  doctor?: User;
  patient?: User;
}