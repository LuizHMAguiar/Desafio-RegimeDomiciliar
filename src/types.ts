export type UserRole = "coordinator" | "teacher";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student {
  id: number | string;
  name: string;
  course: string;
  class: string;
  startDate: string;
  endDate: string;
  registeredBy: string;
  registeredAt: string;
}

export interface Material {
  id: number | string;
  studentId: number | string;
  teacherName: string;
  teacherId: number | string;
  subject: string;
  date: string; 
  type: "material" | "activity";
  description: string;
  files?: { name: string; url: string }[];
  links?: string[];
}