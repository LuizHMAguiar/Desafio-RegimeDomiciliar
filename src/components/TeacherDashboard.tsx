import { useState } from 'react';
import type { User, Student, Material } from '../types';
import { Header } from './Header';
import { StudentsList } from './StudentsList';
import { StudentDetails } from './StudentDetails';
import { MaterialForm } from './MaterialForm';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface TeacherDashboardProps {
  user: User;
  students: Student[];
  materials: Material[];
  onLogout: () => void;
  onAddMaterial: (material: Omit<Material, 'id'>) => void;
  onUpdateMaterial: (id: string, material: Partial<Material>) => void;
  onDeleteMaterial: (id: string) => void;
}

export function TeacherDashboard({
  user,
  students,
  materials,
  onLogout,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
}: TeacherDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const handleAddMaterial = (material: Omit<Material, 'id'>) => {
    onAddMaterial(material);
    setIsFormOpen(false);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setSelectedStudent(students.find(s => s.id === material.studentId) || null);
    setIsFormOpen(true);
  };

  const handleUpdateMaterial = (material: Omit<Material, 'id'>) => {
    if (editingMaterial) {
      onUpdateMaterial(editingMaterial.id, material);
      setIsFormOpen(false);
      setEditingMaterial(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMaterial(null);
  };

  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Estudantes em Regime Domiciliar</h1>
            <p className="text-gray-600">
              Adicione materiais e atividades para os estudantes
            </p>
          </div>
          <div>
            <Button
              onClick={handleOpenAddMaterial}
              disabled={!selectedStudent}
              title={!selectedStudent ? 'Selecione um estudante para ativar' : 'Adicionar material/atividade'}
              className="inline-flex"
            >
              <Plus className="size-4 mr-2" />
              Adicionar Material/Atividade
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StudentsList
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              userRole="teacher"
            />
          </div>

          <div className="lg:col-span-2">
            {selectedStudent ? (
              <StudentDetails
                student={selectedStudent}
                materials={materials.filter(m => m.studentId === selectedStudent.id)}
                userRole="teacher"
                currentUserId={user.id}
                onEditMaterial={handleEditMaterial}
                onDeleteMaterial={onDeleteMaterial}
              />
            ) : (
              <div className="internal-panel p-12 text-center">
                <p className="text-gray-600">
                  Selecione um estudante para adicionar materiais ou atividades
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating action button for adding materials (bottom-right) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
            <div className="fixed bottom-6 right-6 z-50">
            <Button aria-label="Adicionar Material ou Atividade" onClick={handleOpenAddMaterial} className="rounded-full px-4 py-3 shadow-xl flex items-center gap-2" disabled={!selectedStudent} title={!selectedStudent ? 'Selecione um estudante para ativar' : 'Adicionar material/atividade'}>
              <Plus className="size-4" />
              <span className="hidden sm:inline">Adicionar Material/Atividade</span>
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? 'Editar Registro' : 'Adicionar Material ou Atividade'}
            </DialogTitle>
          </DialogHeader>
          <MaterialForm
            material={editingMaterial}
            student={selectedStudent}
            students={students}
            user={user}
            onSubmit={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
