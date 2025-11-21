import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Login } from './components/Login';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { type User, type Student, type Material } from './types';
import { ProtectedRoute } from './routes/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    // Inicializar com dados mock
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Ana Silva Santos',
        course: 'Engenharia de Software',
        class: '3º Período',
        startDate: '2025-11-01',
        endDate: '2025-12-15',
        registeredBy: 'coord1',
        registeredAt: '2025-10-28',
      },
      {
        id: '2',
        name: 'Carlos Eduardo Lima',
        course: 'Administração',
        class: '2º Período',
        startDate: '2025-11-10',
        endDate: '2025-11-30',
        registeredBy: 'coord1',
        registeredAt: '2025-11-05',
      },
      {
        id: '3',
        name: 'Maria Oliveira Costa',
        course: 'Engenharia de Software',
        class: '1º Período',
        startDate: '2025-11-15',
        endDate: '2026-01-10',
        registeredBy: 'coord1',
        registeredAt: '2025-11-10',
      },
    ];

    const mockMaterials: Material[] = [
      {
        id: '1',
        studentId: '1',
        teacherName: 'Prof. João Silva',
        teacherId: 'teacher1',
        subject: 'Programação Orientada a Objetos',
        date: '2025-11-05',
        type: 'material',
        description: 'Material sobre herança e polimorfismo. Inclui slides e exemplos práticos em Java.',
        files: [{ name: 'heranca-polimorfismo.pdf', url: '#' }],
        links: ['https://nead.exemplo.com/poo/modulo3'],
      },
      {
        id: '2',
        studentId: '1',
        teacherName: 'Prof. João Silva',
        teacherId: 'teacher1',
        subject: 'Programação Orientada a Objetos',
        date: '2025-11-08',
        type: 'activity',
        description: 'Atividade prática: implementar um sistema de gerenciamento de biblioteca usando os conceitos de POO.',
        links: ['https://nead.exemplo.com/poo/atividade-biblioteca'],
      },
      {
        id: '3',
        studentId: '1',
        teacherName: 'Profa. Maria Santos',
        teacherId: 'teacher2',
        subject: 'Banco de Dados',
        date: '2025-11-12',
        type: 'material',
        description: 'Normalização de banco de dados - Formas Normais 1FN, 2FN e 3FN com exemplos práticos.',
        files: [{ name: 'normalizacao.pdf', url: '#' }],
        links: ['https://nead.exemplo.com/bd/normalizacao'],
      },
    ];

    setStudents(mockStudents);
    setMaterials(mockMaterials);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simulação de login
    if (email === 'coordenador@escola.com' && password === 'coord123') {
      const newUser = {
        id: 'coord1',
        name: 'Maria Coordenadora',
        email: email,
        role: 'coordinator' as const,
      };
      setUser(newUser);
      navigate('/coordinator');
      return;
    } else if (email === 'professor@escola.com' && password === 'prof123') {
      const newUser = {
        id: 'teacher1',
        name: 'Prof. João Silva',
        email: email,
        role: 'teacher' as const,
      };
      setUser(newUser);
      navigate('/teacher');
      return;
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login', { replace: true });
  };

  const handleAddStudent = (student: Omit<Student, 'id' | 'registeredAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setStudents([...students, newStudent]);
    toast.success('Estudante registrado com sucesso!');
  };

  const handleUpdateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedStudent } : s));
    toast.success('Dados do estudante atualizados!');
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setMaterials(materials.filter(m => m.studentId !== id));
    toast.success('Estudante removido com sucesso!');
  };

  const handleAddMaterial = (material: Omit<Material, 'id'>) => {
    const newMaterial: Material = {
      ...material,
      id: Date.now().toString(),
    };
    setMaterials([...materials, newMaterial]);
    toast.success(material.type === 'material' ? 'Material adicionado com sucesso!' : 'Atividade adicionada com sucesso!');
  };

  const handleUpdateMaterial = (id: string, updatedMaterial: Partial<Material>) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, ...updatedMaterial } : m));
    toast.success('Registro atualizado com sucesso!');
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast.success('Registro removido com sucesso!');
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
              <CoordinatorDashboard
                user={user!}
                students={students}
                materials={materials}
                onLogout={handleLogout}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute user={user} allowedRoles={[ 'teacher' ]}>
              <TeacherDashboard
                user={user!}
                students={students}
                materials={materials}
                onLogout={handleLogout}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onDeleteMaterial={handleDeleteMaterial}
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;