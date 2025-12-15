export type UserRole = "coordinator" | "teacher";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student {
  id: number;
  name: string;
  course: string;
  class: string;
  startDate: string;
  endDate: string;
  registeredBy: number;
  registeredAt: string;
}

export interface Material {
  id: number;
  studentId: number ;
  teacherName: string;
  teacherId: number;
  subject: string;
  date: string; 
  type: "material" | "activity";
  description: string;
  files?: { name: string; url: string }[];
  links?: string[];
}