import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Mail, User, Briefcase } from 'lucide-react';

export default function TeacherProfile() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppStore((s: any) => s.user);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/teacher')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar para dashboard
        </button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Perfil do Professor</CardTitle>
            <CardDescription className="text-blue-100">
              Informações de sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-6">
              {/* Avatar + Nome */}
              <div className="flex items-center gap-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <User className="size-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-2">
                    Professor
                  </Badge>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
                <div className="space-y-4">
                  {/* ID */}
                  <div className="flex items-start gap-4">
                    <Briefcase className="size-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">ID do Professor</p>
                      <p className="text-gray-900 font-medium">{user.id}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <Mail className="size-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-start gap-4">
                    <User className="size-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Função</p>
                      <p className="text-gray-900 font-medium">Docente</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Dica:</strong> Você pode adicionar materiais e atividades para os estudantes em regime domiciliar através do seu dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3 justify-end">
          <Button
            onClick={() => navigate('/teacher')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
