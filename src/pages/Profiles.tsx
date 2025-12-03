import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../api/profiles';
import { useAppStore } from '../stores/useAppStore';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

function ProfileForm({ 
  onSubmit, 
  initial, 
  onCancel,
  isLoading 
}: { 
  onSubmit: (v: any) => void
  initial?: any
  onCancel: () => void
  isLoading?: boolean 
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'coordinator' | 'teacher'>(initial?.role ?? 'teacher');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'Email é obrigatório';
    if (!initial && !password.trim()) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name, email, password, role });
    }
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do usuário</label>
        <input 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({...errors, name: ''});
          }}
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input 
          type="email" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          value={email} 
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({...errors, email: ''});
          }}
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input 
          type="password" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({...errors, password: ''});
          }}
          placeholder={initial ? 'Deixe em branco para manter a senha' : 'Digite a senha'}
          disabled={isLoading}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de perfil</label>
        <select 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          value={role} 
          onChange={(e) => setRole(e.target.value as any)}
          disabled={isLoading}
        >
          <option value="coordinator">Coordenador</option>
          <option value="teacher">Professor</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          <Save className="size-4 mr-2" />
          {initial ? 'Atualizar' : 'Criar perfil'}
        </Button>
        <Button 
          type="button" 
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={isLoading}
        >
          <X className="size-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default function ProfilesPage() {
  const user = useAppStore((s: any) => s.user);
  const navigate = useNavigate();
  const qc = useQueryClient();

  // permissão: somente coordenador
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'coordinator') return <Navigate to="/teacher" replace />;

  const { data: profiles = [], isLoading } = useQuery({ queryKey: ['profiles'], queryFn: getProfiles });

  const createMut = useMutation({ mutationFn: (payload: any) => createProfile(payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }) });
  const updateMut = useMutation({ mutationFn: ({ id, payload }: any) => updateProfile(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }) });
  const deleteMut = useMutation({ mutationFn: (id: string) => deleteProfile(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }) });

  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/coordinator')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Perfis</h1>
              <p className="text-gray-500 mt-1">Crie e edite perfis de usuários (coordenadores e professores)</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/coordinator')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  {editing ? (
                    <>
                      <Edit2 className="size-5" />
                      Editar perfil
                    </>
                  ) : (
                    <>
                      <Plus className="size-5" />
                      Novo perfil
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {editing ? 'Atualize os dados do perfil' : 'Crie um novo usuário para o sistema'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ProfileForm
                  initial={editing}
                  onSubmit={async (v) => {
                    try {
                      if (editing) {
                        await updateMut.mutateAsync({ id: editing.id, payload: v });
                        setEditing(null);
                      } else {
                        await createMut.mutateAsync(v);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  onCancel={() => setEditing(null)}
                  isLoading={createMut.isPending || updateMut.isPending}
                />
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Perfis */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Perfis cadastrados</CardTitle>
                <CardDescription>Total: {profiles.length} perfil(is)</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Carregando perfis...</p>
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-gray-500">Nenhum perfil cadastrado ainda</p>
                    <p className="text-sm text-gray-400 mt-2">Crie um novo perfil no formulário ao lado</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Função</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Criado</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(profiles as any[]).map((p: any) => (
                          <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                            <td className="py-3 px-4 text-gray-600 text-sm">{p.email}</td>
                            <td className="py-3 px-4">
                              <Badge className={p.role === 'coordinator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                {p.role === 'coordinator' ? 'Coordenador' : 'Professor'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-sm">
                              {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditing(p)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit2 className="size-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir o perfil de ${p.name}?`)) {
                                      deleteMut.mutate(p.id);
                                    }
                                  }}
                                  disabled={deleteMut.isPending}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
