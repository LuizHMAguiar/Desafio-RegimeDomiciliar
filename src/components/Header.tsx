import type { User } from '../types';
import { Button } from './ui/button';
import { GraduationCap, LogOut, User as UserIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const roleLabel = user.role === 'coordinator' ? 'Coordenador' : 'Professor';
  const roleColor = user.role === 'coordinator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Sistema de Regime Domiciliar</h2>
              <p className="text-sm text-gray-500">CDAE - Centro de Apoio ao Estudante</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-900">{user.name}</p>
                <Badge className={roleColor} variant="secondary">
                  {roleLabel}
                </Badge>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                <UserIcon className="size-5 text-gray-600" />
              </div>
            </div>

            <Button variant="outline" onClick={onLogout}>
              <LogOut className="size-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
