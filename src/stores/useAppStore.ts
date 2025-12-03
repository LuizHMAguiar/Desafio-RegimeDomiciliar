import { create } from 'zustand';

export type UserRole = 'coordinator' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AppState {
  user: User | null;
  setUser: (u: User | null) => void;

  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  filters: { course?: string | null; class?: string | null; search?: string };
  setFilters: (f: Partial<AppState['filters']>) => void;

  recentRecords: any[];
  setRecentRecords: (r: any[]) => void;

  flags: { loading: boolean; error: string | null; success: boolean };
  setFlags: (p: Partial<AppState['flags']>) => void;
}

export const useAppStore = create<AppState>((set: any) => ({
  user: null,
  setUser: (u: User | null) => set(() => ({ user: u })),

  selectedStudentId: null,
  setSelectedStudentId: (id: string | null) => set(() => ({ selectedStudentId: id })),

  filters: { course: null, class: null, search: '' },
  setFilters: (f: Partial<AppState['filters']>) => set((s: AppState) => ({ filters: { ...s.filters, ...f } })),

  recentRecords: [],
  setRecentRecords: (r: any[]) => set(() => ({ recentRecords: r })),

  flags: { loading: false, error: null, success: false },
  setFlags: (p: Partial<AppState['flags']>) => set((s: AppState) => ({ flags: { ...s.flags, ...p } })),
}));

export default useAppStore;
