import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Login } from './components/Login';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import ProfilesPage from './pages/Profiles';
import TeacherProfilePage from './pages/TeacherProfile';
import InternalLayout from './components/InternalLayout';
import { useAppStore } from './stores/useAppStore';
import { validateProfile } from './api/profiles';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { type User, type Student, type Material } from './types';
import { ProtectedRoute } from './routes/ProtectedRoute';

const API_BASE = 'https://regimedomiciliar-api.onrender.com';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const setGlobalUser = useAppStore((s: any) => s.setUser);
  const [students, setStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados da API
    const loadData = async () => {
      try {
        setLoading(true);
        const [studentsRes, materialsRes] = await Promise.all([
          axios.get(`${API_BASE}/students`),
          axios.get(`${API_BASE}/materials`),
        ]);
        setStudents(studentsRes.data);
        setMaterials(materialsRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados da API:', error);
        toast.error('Erro ao carregar dados. Alguns recursos podem não estar disponíveis.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Verificar perfis cadastrados na API
    validateProfile(email, password).then((profile) => {
      if (profile) {
        const newUser: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as 'teacher' | 'coordinator',
        };
        setUser(newUser);
        setGlobalUser(newUser as any);

        if (profile.role === 'coordinator') {
          navigate('/coordinator');
        } else {
          navigate('/teacher');
        }
        return;
      }

      throw new Error('Credenciais inválidas');
    }).catch(() => {
      throw new Error('Credenciais inválidas');
    });
  };

  const handleLogout = () => {
    setUser(null);
    setGlobalUser(null as any);
    navigate('/login', { replace: true });
  };

  const handleAddStudent = async (student: Omit<Student, 'id' | 'registeredAt'>) => {
    try {
      const response = await axios.post(`${API_BASE}/students`, {
        ...student,
        registeredAt: new Date().toISOString(),
      });
      setStudents([...students, response.data]);
      toast.success('Estudante registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar estudante:', error);
      toast.error('Erro ao registrar estudante');
    }
  };

  const handleUpdateStudent = async (id: string | number, updatedStudent: Partial<Student>) => {
    try {
      const response = await axios.patch(`${API_BASE}/students/${id}`, updatedStudent);
      setStudents(students.map(s => s.id === id ? response.data : s));
      toast.success('Dados do estudante atualizados!');
    } catch (error) {
      console.error('Erro ao atualizar estudante:', error);
      toast.error('Erro ao atualizar estudante');
    }
  };

  const handleDeleteStudent = async (id: string | number) => {
    try {
      await axios.delete(`${API_BASE}/students/${id}`);
      setStudents(students.filter(s => s.id !== id));
      setMaterials(materials.filter(m => m.studentId !== id));
      toast.success('Estudante removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar estudante:', error);
      toast.error('Erro ao remover estudante');
    }
  };

  const handleAddMaterial = async (material: Omit<Material, 'id'>) => {
    try {
      const response = await axios.post(`${API_BASE}/materials`, material);
      setMaterials([...materials, response.data]);
      toast.success(material.type === 'material' ? 'Material adicionado com sucesso!' : 'Atividade adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      toast.error('Erro ao adicionar registro');
    }
  };

  const handleUpdateMaterial = async (id: string | number, updatedMaterial: Partial<Material>) => {
    try {
      const response = await axios.patch(`${API_BASE}/materials/${id}`, updatedMaterial);
      setMaterials(materials.map(m => m.id === id ? response.data : m));
      toast.success('Registro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      toast.error('Erro ao atualizar registro');
    }
  };

  const handleDeleteMaterial = async (id: string | number) => {
    try {
      await axios.delete(`${API_BASE}/materials/${id}`);
      setMaterials(materials.filter(m => m.id !== id));
      toast.success('Registro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar material:', error);
      toast.error('Erro ao remover registro');
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/coordinator"
          element={
            <ProtectedRoute user={user} allowedRoles={[ 'coordinator' ]}>
              <InternalLayout>
                <CoordinatorDashboard
                  user={user!}
                  students={students}
                  materials={materials}
                  onLogout={handleLogout}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                />
              </InternalLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute user={user} allowedRoles={[ 'teacher' ]}>
              <InternalLayout>
                <TeacherDashboard
                  user={user!}
                  students={students}
                  materials={materials}
                  onLogout={handleLogout}
                  onAddMaterial={handleAddMaterial}
                  onUpdateMaterial={handleUpdateMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                />
              </InternalLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route
          path="/perfis"
          element={
            <ProtectedRoute user={user} allowedRoles={[ 'coordinator' ]}>
              <InternalLayout>
                <ProfilesPage />
              </InternalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute user={user} allowedRoles={[ 'teacher' ]}>
              <InternalLayout>
                <TeacherProfilePage />
              </InternalLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;