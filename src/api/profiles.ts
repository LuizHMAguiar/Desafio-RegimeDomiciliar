import type { User } from '../types';

// Mock API para perfis (localStorage)
const KEY = 'app_profiles_v1';

// Hash simples para mock (NUNCA usar em produção!)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
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

export async function getProfiles(): Promise<Array<User & { createdAt: string }>> {
  // Simula latência
  await new Promise((r) => setTimeout(r, 200));
  return readStorage();
}

export async function validateProfile(email: string, password: string): Promise<(User & { createdAt: string }) | null> {
  // Simula latência
  await new Promise((r) => setTimeout(r, 200));
  const list = readStorage();
  const profile = list.find((p: any) => p.email === email);
  
  if (!profile) return null;
  
  // Validar senha com hash simples
  const passwordHash = simpleHash(password);
  if (profile.passwordHash === passwordHash) {
    return profile;
  }
  
  return null;
}

export async function createProfile(payload: { name: string; email: string; password: string; role: User['role'] }) {
  await new Promise((r) => setTimeout(r, 200));
  const list = readStorage();
  const now = new Date().toISOString();
  const newItem = { 
    id: Date.now().toString(), 
    name: payload.name, 
    email: payload.email, 
    role: payload.role,
    passwordHash: simpleHash(payload.password),
    createdAt: now 
  };
  list.unshift(newItem);
  writeStorage(list);
  return newItem;
}

export async function updateProfile(id: string, payload: Partial<{ name: string; email: string; password?: string; role: User['role'] }>) {
  await new Promise((r) => setTimeout(r, 200));
  const list = readStorage();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Perfil não encontrado');
  
  const updatedItem = { ...list[idx], ...payload };
  if (payload.password) {
    updatedItem.passwordHash = simpleHash(payload.password);
  }
  delete (updatedItem as any).password; // Remove password field
  
  list[idx] = updatedItem;
  writeStorage(list);
  return list[idx];
}

export async function deleteProfile(id: string) {
  await new Promise((r) => setTimeout(r, 150));
  let list = readStorage();
  list = list.filter((p) => p.id !== id);
  writeStorage(list);
  return true;
}
