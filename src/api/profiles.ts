import axios from 'axios';
import type { User } from '../types';

const API_BASE = 'https://regimedomiciliar-api.onrender.com';
const KEY = 'app_profiles_v1';

export async function getProfiles(): Promise<Array<User & { createdAt: string }>> {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    return response.data.map((user: any) => ({
      ...user,
      createdAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    // Fallback para localStorage
    await new Promise((r) => setTimeout(r, 200));
    return readStorage();
  }
}

export async function validateProfile(email: string, password: string): Promise<(User & { createdAt: string }) | null> {
  try {
    // Buscar usuários da API
    const response = await axios.get(`${API_BASE}/users`);
    const users = response.data;
    
    // Procurar usuário por email
    const user = users.find((u: any) => u.email === email);
    
    if (user) {
      // Na API real, você pode implementar validação de senha
      // Por enquanto, aceitamos apenas pela existência do email
      return {
        ...user,
        createdAt: new Date().toISOString(),
      };
    }
    
    // Se não encontrar na API, verificar localStorage para usuários criados localmente
    const list = readStorage();
    const localProfile = list.find((p: any) => p.email === email);
    
    if (localProfile) {
      const passwordHash = simpleHash(password);
      if (localProfile.passwordHash === passwordHash) {
        return localProfile;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao validar perfil:', error);
    // Fallback para localStorage
    await new Promise((r) => setTimeout(r, 200));
    const list = readStorage();
    const profile = list.find((p: any) => p.email === email);
    
    if (!profile) return null;
    
    const passwordHash = simpleHash(password);
    if (profile.passwordHash === passwordHash) {
      return profile;
    }
    
    return null;
  }
}

// Hash simples para mock (NUNCA usar em produção!)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function readStorage(): any[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeStorage(data: any[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export async function createProfile(payload: { name: string; email: string; password: string; role: User['role'] }) {
  try {
    // Tentar criar na API
    const response = await axios.post(`${API_BASE}/users`, {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });
    return {
      ...response.data,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erro ao criar perfil na API, salvando localmente:', error);
    // Fallback para localStorage
    await new Promise((r) => setTimeout(r, 200));
    const list = readStorage();
    const now = new Date().toISOString();
    const newItem = {
      id: Date.now().toString(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      passwordHash: simpleHash(payload.password),
      createdAt: now,
    };
    list.unshift(newItem);
    writeStorage(list);
    return newItem;
  }
}

export async function updateProfile(id: string, payload: Partial<{ name: string; email: string; password?: string; role: User['role'] }>) {
  try {
    // Tentar atualizar na API
    const response = await axios.patch(`${API_BASE}/users/${id}`, {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });
    return {
      ...response.data,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil na API, usando localStorage:', error);
    // Fallback para localStorage
    await new Promise((r) => setTimeout(r, 200));
    const list = readStorage();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Perfil não encontrado');

    const updatedItem = { ...list[idx], ...payload };
    if (payload.password) {
      updatedItem.passwordHash = simpleHash(payload.password);
    }
    delete (updatedItem as any).password;

    list[idx] = updatedItem;
    writeStorage(list);
    return list[idx];
  }
}

export async function deleteProfile(id: string) {
  try {
    // Tentar deletar na API
    await axios.delete(`${API_BASE}/users/${id}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar perfil na API, usando localStorage:', error);
    // Fallback para localStorage
    await new Promise((r) => setTimeout(r, 150));
    let list = readStorage();
    list = list.filter((p) => p.id !== id);
    writeStorage(list);
    return true;
  }
}
