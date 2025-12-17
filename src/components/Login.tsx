import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Users, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Logo from '../assets/logo.jpg';

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

  // Usaremos o variant "secondary" do Button (tema-aware) e garantimos largura/contraste
  // para que o botão seja sempre claramente um botão, mesmo em backgrounds claros.

  return (
    <div
      className="min-h-screen relative flex items-center justify-center login-bg p-4"
      style={{ backgroundImage: `url('/login-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Card className="w-full max-w-md login-card" style={{ position: 'relative', zIndex: 10 }}>
        <CardHeader className="relative space-y-1 text-center">
          {/* Theme toggle inside card header so it doesn't overlap the submit button */}
          <div className="absolute right-3 top-3">
            <ThemeToggle />
          </div>
          <div className="flex justify-center mb-4">
            {/* Logo de login: coloque o arquivo em `public/logo-login.png` */}
            <img
              src={Logo}
              alt="Logo do Sistema"
              className="w-24 h-24 object-contain rounded-full shadow-md bg-white p-2"
              width="200px"
            />
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

            <Button type="submit" className="w-full font-semibold py-2 rounded-lg shadow-md transition transform-gpu hover:-translate-y-0.5" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Seleção de perfil (abaixo do botão) 
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Entrar como</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === 'coordinator' ? undefined : 'outline'}
                  onClick={() => selectRole('coordinator')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md transition-colors duration-150 ${selectedRole === 'coordinator' ? 'bg-background/60 border-border' : ''}`}
                >
                  <Users className={`${selectedRole === 'coordinator' ? 'text-foreground' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${selectedRole === 'coordinator' ? 'text-foreground' : 'text-muted-foreground'}`}>Coordenador</span>
                </Button>

                <Button
                  type="button"
                  variant={selectedRole === 'teacher' ? undefined : 'outline'}
                  onClick={() => selectRole('teacher')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md transition-colors duration-150 ${selectedRole === 'teacher' ? 'bg-background/60 border-border' : ''}`}
                >
                  <BookOpen className={`${selectedRole === 'teacher' ? 'text-foreground' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${selectedRole === 'teacher' ? 'text-foreground' : 'text-muted-foreground'}`}>Professor</span>
                </Button>
              </div>
              {selectedRole && (
                <p className="mt-2 text-xs text-gray-600">Perfil selecionado: <span className="font-semibold">{selectedRole === 'coordinator' ? 'Coordenador' : 'Professor'}</span></p>
              )}
            </div>  */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
