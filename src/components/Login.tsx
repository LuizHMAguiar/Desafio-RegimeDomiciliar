import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { GraduationCap, AlertCircle, Users, BookOpen } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'coordinator' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Preenche automaticamente credenciais de teste ao selecionar um perfil
  const selectRole = (role: 'teacher' | 'coordinator') => {
    setSelectedRole(role);
    if (role === 'coordinator') {
      setEmail('coordenador@escola.com');
      setPassword('coord123');
    } else {
      setEmail('professor@escola.com');
      setPassword('prof123');
    }
  };

  // Classe dinâmica do botão de login (cor dependendo do perfil selecionado)
  const loginBtnBase = 'w-full text-white font-semibold py-2 rounded-lg shadow-sm transition-colors duration-200';
  const loginBtnColor = selectedRole
    ? '!bg-gray-800 hover:!bg-gray-900'
    : '!bg-gray-600 hover:!bg-gray-700';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="size-8 text-white" />
            </div>
          </div>
          <CardTitle>Sistema de Regime Domiciliar</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema de gerenciamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
              />
            </div>

            <Button type="submit" className={`${loginBtnBase} ${loginBtnColor}`} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Seleção de perfil (abaixo do botão) */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Entrar como</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => selectRole('coordinator')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border transition-colors duration-150 ${selectedRole === 'coordinator' ? 'bg-gray-300 border-gray-500' : 'bg-gray-100 border-gray-300 hover:border-gray-400'}`}
                >
                  <Users className={`${selectedRole === 'coordinator' ? 'text-gray-700' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium text-gray-700">Coordenador</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole('teacher')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border transition-colors duration-150 ${selectedRole === 'teacher' ? 'bg-gray-300 border-gray-500' : 'bg-gray-100 border-gray-300 hover:border-gray-400'}`}
                >
                  <BookOpen className={`${selectedRole === 'teacher' ? 'text-gray-700' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium text-gray-700">Professor</span>
                </button>
              </div>
              {selectedRole && (
                <p className="mt-2 text-xs text-gray-600">Perfil selecionado: <span className="font-semibold">{selectedRole === 'coordinator' ? 'Coordenador' : 'Professor'}</span></p>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 mb-2">Credenciais de teste:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p><strong>Coordenador:</strong> coordenador@escola.com / coord123</p>
                <p><strong>Professor:</strong> professor@escola.com / prof123</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
