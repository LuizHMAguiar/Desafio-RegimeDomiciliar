import { useState } from 'react';
import type { User, Student, Material } from '../types';
import { Header } from './Header';
import { StudentsList } from './StudentsList';
import { StudentForm } from './StudentForm';
import { StudentDetails } from './StudentDetails';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface CoordinatorDashboardProps {
  user: User;
  students: Student[];
  materials: Material[];
  onLogout: () => void;
  onAddStudent: (student: Omit<Student, 'id' | 'registeredAt'>) => void;
  onUpdateStudent: (id: string, student: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

export function CoordinatorDashboard({
  user,
  students,
  materials,
  onLogout,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}: CoordinatorDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = (student: Omit<Student, 'id' | 'registeredAt'>) => {
    onAddStudent(student);
    setIsFormOpen(false);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleUpdateStudent = (student: Omit<Student, 'id' | 'registeredAt'>) => {
    if (editingStudent) {
      onUpdateStudent(editingStudent.id, student);
      setIsFormOpen(false);
      setEditingStudent(null);
      if (selectedStudent?.id === editingStudent.id) {
        setSelectedStudent({ ...editingStudent, ...student });
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    onDeleteStudent(id);
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Estudantes em Regime Domiciliar</h1>
            <p className="text-gray-600">
              Gerencie estudantes que estão estudando remotamente por mais de 15 dias
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingStudent(null)}>
                <Plus className="size-4 mr-2" />
                Registrar Estudante
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Editar Estudante' : 'Registrar Novo Estudante'}
                </DialogTitle>
              </DialogHeader>
              <StudentForm
                student={editingStudent}
                userId={user.id}
                onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                onCancel={handleCloseForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StudentsList
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              userRole="coordinator"
            />
          </div>

          <div className="lg:col-span-2">
            {selectedStudent ? (
              <StudentDetails
                student={selectedStudent}
                materials={materials.filter(m => m.studentId === selectedStudent.id)}
                userRole="coordinator"
              />
            ) : (
              <div className="internal-panel p-12 text-center">
                <p className="text-gray-600">
                  Selecione um estudante para ver os detalhes e materiais
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
