import { useState, useEffect } from 'react';
import { type Material, type Student, type User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, Link as LinkIcon, FileText, Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';

interface MaterialFormProps {
  material?: Material | null;
  student: Student | null;
  students: Student[];
  user: User;
  onSubmit: (material: Omit<Material, 'id'>) => void;
  onCancel: () => void;
}

export function MaterialForm({ material, student, students, user, onSubmit, onCancel }: MaterialFormProps) {
  const [formData, setFormData] = useState({
    studentId: student?.id ,
    subject: '',
    type: 'material' as 'material' | 'activity',
    description: '',
    links: [''],
  });
  const [files, setFiles] = useState<{ name: string; url: string; size: number }[]>([]);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

  // Limite de 10MB por arquivo
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    if (material) {
      setFormData({
        studentId: material.studentId,
        subject: material.subject,
        type: material.type,
        description: material.description,
        links: material.links && material.links.length > 0 ? material.links : [''],
      });
      setFiles(material.files?.map(f => ({ ...f, size: 0 })) || []);
    } else if (student) {
      setFormData(prev => ({ ...prev, studentId: student.id }));
    }
  }, [material, student]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
  };

  const removeLink = (index: number) => {
    if (formData.links.length > 1) {
      const newLinks = formData.links.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, links: newLinks }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const validFiles: { name: string; url: string; size: number }[] = [];
      let hasErrors = false;

      fileArray.forEach((file, index) => {
        // Validar tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`Arquivo "${file.name}" excede o tamanho máximo de 10MB`);
          hasErrors = true;
          return;
        }

        // Simular progresso do upload
        setUploadProgress(prev => ({ ...prev, [files.length + index]: 0 }));
        
        // Simular carregamento progressivo
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[files.length + index] || 0;
            if (current >= 100) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [files.length + index]: current + Math.random() * 30 };
          });
        }, 100);

        validFiles.push({
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
        });
      });

      if (!hasErrors) {
        setFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.studentId) {
      setError('Selecione um estudante');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Disciplina é obrigatória');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return false;
    }

    const hasValidLinks = formData.links.some(link => link.trim() !== '');
    const hasFiles = files.length > 0;

    if (formData.type === 'activity' && !hasValidLinks) {
      setError('Atividades devem ter pelo menos um link para o NeaD');
      return false;
    }

    if (formData.type === 'material' && !hasValidLinks && !hasFiles) {
      setError('Materiais devem ter pelo menos um arquivo ou link');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validLinks = formData.links.filter(link => link.trim() !== '');

    onSubmit({
      studentId: formData.studentId || 0,
      teacherName: user.name,
      teacherId: user.id,
      subject: formData.subject,
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      description: formData.description,
      ...(files.length > 0 && { files }),
      ...(validLinks.length > 0 && { links: validLinks }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {fileError && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="student">Estudante *</Label>
        <Select value={formData.studentId?.toString()} onValueChange={(value) => handleChange('studentId', value)}>
          <SelectTrigger id="student">
            <SelectValue placeholder="Selecione o estudante" />
          </SelectTrigger>
          <SelectContent>
            {students.map(s => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name} - {s.course} ({s.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Disciplina *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Ex: Programação Orientada a Objetos"
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo *</Label>
        <RadioGroup value={formData.type} onValueChange={(value) => handleChange('type', value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="material" id="material" />
            <Label htmlFor="material" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <div>
                  <p>Material de Estudo</p>
                  <p className="text-xs text-gray-500">Arquivos, slides, apostilas, vídeos, etc.</p>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="activity" id="activity" />
            <Label htmlFor="activity" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <LinkIcon className="size-4" />
                <div>
                  <p>Atividade/Tarefa</p>
                  <p className="text-xs text-gray-500">Exercícios, trabalhos, provas (sempre com link NeaD)</p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição Detalhada *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descreva o conteúdo do material ou atividade..."
          rows={4}
        />
      </div>

      {formData.type === 'material' && (
        <div className="space-y-2">
          <Label htmlFor="files">Arquivos (opcional para materiais) - Máx. 10MB por arquivo</Label>
          <Input
            id="files"
            type="file"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.xlsx,.xls,.jpg,.jpeg,.png"
          />
          {files.length > 0 && (
            <div className="space-y-2 mt-2">
              {files.map((file, index) => {
                const progress = uploadProgress[index] || 100;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="size-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      {progress >= 100 ? (
                        <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                      ) : null}
                    </div>
                    {progress < 100 && (
                      <div className="mb-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="size-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Links {formData.type === 'activity' ? '*' : '(opcional)'}</Label>
        <p className="text-xs text-gray-500 mb-2">
          {formData.type === 'activity' 
            ? 'Atividades sempre devem ter link para o NeaD'
            : 'Links para materiais no NeaD ou outros recursos online'}
        </p>
        <div className="space-y-2">
          {formData.links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="https://nead.exemplo.com/..."
                type="url"
              />
              {formData.links.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeLink(index)}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLink} className="w-full">
            <Plus className="size-4 mr-2" />
            Adicionar outro link
          </Button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {material ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}
