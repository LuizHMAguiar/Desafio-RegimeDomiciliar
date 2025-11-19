export type UserRole = "coordinator" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student {
  id: string;
  name: string;
  course: string;
  class: string;
  startDate: string;
  endDate: string;
  registeredBy: string;
  registeredAt: string;
}

export interface Material {
  id: string;
  studentId: string;
  teacherName: string;
  teacherId: string;
  subject: string;
  date: string;
  type: "material" | "activity";
  description: string;
  files?: { name: string; url: string }[];
  links?: string[];
}