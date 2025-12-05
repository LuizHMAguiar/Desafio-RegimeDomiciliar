import type { User } from '../types';
import { Button } from './ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const roleLabel = user.role === 'coordinator' ? 'Coordenador' : 'Professor';
  const roleColor = user.role === 'coordinator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

  const handleProfileClick = () => {
    navigate(user.role === 'coordinator' ? '/perfis' : '/perfil');
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-lg shadow-md flex items-center justify-center">
              {/* Nova logo SVG fornecida pelo usuário */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-8 text-white" aria-hidden="true">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                <path d="M22 10v6"></path>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-foreground text-lg sm:text-xl font-semibold leading-tight">Sistema de Regime Domiciliar</h2>
              <p className="text-sm text-muted-foreground truncate">CDAE — Centro de Apoio ao Estudante</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex sm:items-center sm:gap-3 text-right min-w-0">
              <p className="text-sm text-foreground truncate font-medium">{user.name}</p>
              <Badge className={roleColor} variant="secondary">
                {roleLabel}
              </Badge>
            </div>

            {/* compact profile / actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleProfileClick}
                className="bg-gray-100/60 dark:bg-input/30 p-2 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer shadow-sm"
                title="Abrir perfil"
                aria-label="Abrir perfil"
              >
                <UserIcon className="size-5 text-gray-700 dark:text-gray-200" />
              </button>

              <ThemeToggle />

              <Button variant="outline" onClick={onLogout} className="hidden sm:inline-flex">
                <LogOut className="size-4 mr-2" />
                Sair
              </Button>

              {/* small visible logout for very small screens */}
              <Button variant="ghost" onClick={onLogout} className="sm:hidden" aria-label="Sair">
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
