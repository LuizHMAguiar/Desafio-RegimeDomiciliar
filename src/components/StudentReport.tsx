import { type Student, type Material } from '../types';
import { Calendar, FileText, Link as LinkIcon } from 'lucide-react';

interface StudentReportProps {
  student: Student;
  materials: Material[];
}

export function StudentReport({ student, materials }: StudentReportProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Agrupar por disciplina
  const materialsBySubject: Record<string, Material[]> = {};
  materials.forEach(material => {
    if (!materialsBySubject[material.subject]) {
      materialsBySubject[material.subject] = [];
    }
    materialsBySubject[material.subject].push(material);
  });

  // Ordenar materiais por data dentro de cada disciplina
  Object.keys(materialsBySubject).forEach(subject => {
    materialsBySubject[subject].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  const subjects = Object.keys(materialsBySubject).sort();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Cabeçalho */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-center mb-2">Relatório de Regime Domiciliar</h1>
          <p className="text-center text-gray-600">CDAE - Centro de Apoio ao Estudante</p>
        </div>

        {/* Informações do Estudante */}
        <div className="mb-6">
          <h2 className="mb-3">Dados do Estudante</h2>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <p className="text-sm text-gray-600">Nome:</p>
              <p>{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Curso:</p>
              <p>{student.course}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Turma:</p>
              <p>{student.class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Semestre:</p>
              <p>{formatDate(student.startDate)} até {formatDate(student.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="mb-6">
          <h2 className="mb-3">Resumo</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <p className="text-2xl mb-1">{materials.filter(m => m.type === 'material').length}</p>
              <p className="text-sm text-gray-600">Materiais</p>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <p className="text-2xl mb-1">{materials.filter(m => m.type === 'activity').length}</p>
              <p className="text-sm text-gray-600">Atividades</p>
            </div>
            <div className="bg-purple-50 p-4 rounded text-center">
              <p className="text-2xl mb-1">{subjects.length}</p>
              <p className="text-sm text-gray-600">Disciplinas</p>
            </div>
          </div>
        </div>

        {/* Materiais e Atividades por Disciplina */}
        <div>
          <h2 className="mb-3">Materiais e Atividades por Disciplina</h2>
          
          {subjects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum material ou atividade registrado</p>
          ) : (
            subjects.map(subject => (
              <div key={subject} className="mb-6 break-inside-avoid">
                <h3 className="bg-gray-100 p-3 rounded mb-3">{subject}</h3>
                <div className="space-y-4 pl-4">
                  {materialsBySubject[subject].map(material => (
                    <div key={material.id} className="border-l-2 border-gray-300 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        {material.type === 'material' ? (
                          <FileText className="size-4 text-blue-600" />
                        ) : (
                          <LinkIcon className="size-4 text-green-600" />
                        )}
                        <span className="text-sm">
                          {material.type === 'material' ? 'Material' : 'Atividade'}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{material.teacherName}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="size-3" />
                          {formatDate(material.date)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{material.description}</p>
                      
                      {material.files && material.files.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">Arquivos:</p>
                          <ul className="list-disc list-inside text-xs text-gray-700 pl-2">
                            {material.files.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {material.links && material.links.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Links:</p>
                          <ul className="list-disc list-inside text-xs text-gray-700 pl-2">
                            {material.links.map((link, index) => (
                              <li key={index} className="break-all">{link}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div className="mt-8 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-500 text-center">
            Relatório gerado em {formatDate(new Date().toISOString().split('T')[0])} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
