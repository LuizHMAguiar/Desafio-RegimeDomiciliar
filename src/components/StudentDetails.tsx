import { useState, useRef } from 'react';
import { type Student, type Material } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, FileText, Link as LinkIcon, Download, Edit, Trash2, Printer, Search } from 'lucide-react';
import { Input } from './ui/input';
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
import { StudentReport } from './StudentReport';

interface StudentDetailsProps {
  student: Student;
  materials: Material[];
  userRole: 'coordinator' | 'teacher';
  currentUserId?: string;
  onEditMaterial?: (material: Material) => void;
  onDeleteMaterial?: (id: string) => void;
}

export function StudentDetails({
  student,
  materials,
  userRole,
  currentUserId,
  onEditMaterial,
  onDeleteMaterial,
}: StudentDetailsProps) {
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'material' | 'activity'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const subjects = Array.from(new Set(materials.map(m => m.subject))).sort();

  const filteredMaterials = materials
    .filter(m => {
      const matchesSubject = subjectFilter === 'all' || m.subject === subjectFilter;
      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      const matchesSearch = 
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSubject && matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const canEdit = (material: Material) => {
    return userRole === 'teacher' && currentUserId === material.teacherId;
  };

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete && onDeleteMaterial) {
      onDeleteMaterial(materialToDelete.id);
      setMaterialToDelete(null);
    }
  };

  const handlePrintReport = () => {
    setShowReport(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <div className="print:hidden">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{student.name}</CardTitle>
                <div className="space-y-1 mt-2">
                  <p className="text-sm text-gray-600">{student.course}</p>
                  <p className="text-sm text-gray-600">{student.class}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="size-4" />
                    <span>
                      {formatDate(student.startDate)} até {formatDate(student.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={handlePrintReport} variant="outline">
                <Printer className="size-4 mr-2" />
                Imprimir Relatório
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Materiais e Atividades ({filteredMaterials.length})</CardTitle>
            </div>

            <div className="space-y-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Buscar por disciplina, professor ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-3">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as disciplinas</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)} className="flex-1">
                  <TabsList>
                    <TabsTrigger value="all">Todos ({filteredMaterials.length})</TabsTrigger>
                    <TabsTrigger value="material">
                      Materiais ({filteredMaterials.filter(m => m.type === 'material').length})
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                      Atividades ({filteredMaterials.filter(m => m.type === 'activity').length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Nenhum material ou atividade registrado ainda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMaterials.map(material => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          material.type === 'material' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {material.type === 'material' ? (
                            <FileText className="size-5" />
                          ) : (
                            <LinkIcon className="size-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-gray-900">{material.subject}</h3>
                            <Badge variant="outline" className={
                              material.type === 'material' 
                                ? 'border-blue-300 text-blue-700' 
                                : 'border-green-300 text-green-700'
                            }>
                              {material.type === 'material' ? 'Material' : 'Atividade'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{material.teacherName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(material.date)}
                          </p>
                        </div>
                      </div>

                      {canEdit(material) && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditMaterial?.(material)}
                          >
                            <Edit className="size-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(material)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3">{material.description}</p>

                    {material.files && material.files.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Arquivos:</p>
                        <div className="space-y-2">
                          {material.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                            >
                              <span className="text-sm truncate flex-1">{file.name}</span>
                              <Button variant="ghost" size="sm">
                                <Download className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {material.links && material.links.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Links:</p>
                        <div className="space-y-2">
                          {material.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <LinkIcon className="size-3" />
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showReport && (
        <div className="hidden print:block" ref={reportRef}>
          <StudentReport student={student} materials={materials} />
        </div>
      )}

      <AlertDialog open={!!materialToDelete} onOpenChange={() => setMaterialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
