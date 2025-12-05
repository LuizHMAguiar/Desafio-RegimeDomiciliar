import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Student } from '../types';
import { sortStudents } from '../utils/studentStatus';

export const api = axios.create({
  baseURL: 'https://regimedomiciliar-api.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

const defaultQueryOptions = {
  cacheTime: 1000 * 60 * 7,
  staleTime: 1000 * 60,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

export function useStudents(params?: Record<string, any>) {
  const key = ['students', params];
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get('/students', { params });
      const data: Student[] = res.data;
      return sortStudents(data);
    },
    ...defaultQueryOptions,
  });
}

export function useStudent(id?: string | null) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      if (!id) throw new Error('No id');
      const res = await api.get(`/students/${id}`);
      return res.data as Student;
    },
    enabled: !!id,
  });
}

export function useAddMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/materials', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['materials'] });
      qc.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
