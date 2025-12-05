import { useState } from 'react';
import type { Student } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import StatusBadge from './ui/status-badge';
import { getStudentStatus, sortStudents } from '../utils/studentStatus';
import { Search, Calendar, Edit, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface StudentsListProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
  userRole: 'coordinator' | 'teacher';
  manualSortApplied?: boolean;
}

export function StudentsList({
  students,
  selectedStudent,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  userRole,
  manualSortApplied = false,
}: StudentsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const courses = Array.from(new Set(students.map(s => s.course))).sort();
  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesCourse && matchesClass;
  });

  const autoSorted = sortStudents(filteredStudents);
  const finalStudents = manualSortApplied ? filteredStudents : autoSorted;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleDeleteClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setStudentToDelete(student);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete && onDeleteStudent) {
      onDeleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Estudantes ({finalStudents.length})</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por turma" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                {classes.map(classItem => (
                  <SelectItem key={classItem} value={classItem}>{classItem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {finalStudents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum estudante encontrado
              </p>

            ) : (
              finalStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  role="button"
                  aria-pressed={selectedStudent?.id === student.id}
                  tabIndex={0}
                  className={`p-4 rounded-lg cursor-pointer transition-all internal-panel border focus-visible:!ring-4 focus-visible:!ring-ring/30 ${
                    selectedStudent?.id === student.id
                      ? 'ring-2 ring-blue-400/40 shadow-md border-blue-200/40'
                      : 'hover:shadow-sm'
                  }`}
                >

                  <div className="flex items-start justify-between mb-2 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-accent text-accent-foreground font-semibold text-sm shadow-sm flex-shrink-0">
                        {student.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-foreground mb-1 font-semibold text-base sm:text-lg truncate">{student.name}</h3>

                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="truncate">{student.course}</span>
                          <span className="truncate">{student.class}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={getStudentStatus(student)} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(student.startDate)} — {formatDate(student.endDate)}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      {userRole === 'coordinator' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditStudent?.(student);
                            }}
                            className="flex-1"
                          >
                            <Edit className="size-3 mr-1" />
                            Editar
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, student)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </CardContent>
      </Card>

      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o registro de <strong>{studentToDelete?.name}</strong>?  
              Esta ação não pode ser desfeita e todos os materiais e atividades vinculados serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
