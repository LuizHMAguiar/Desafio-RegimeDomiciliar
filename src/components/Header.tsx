import type { User } from '../types';
import { Button } from './ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import Logo from '../assets/logo.jpg';
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
            <div className="p-3 rounded-lg shadow-md flex items-center justify-center bg-transparent">
              <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
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
