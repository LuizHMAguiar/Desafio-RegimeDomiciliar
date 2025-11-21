import { useState, useEffect } from 'react';
import { type Material, type Student, type User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, Link as LinkIcon, FileText, Plus, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

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
    studentId: student?.id || '',
    subject: '',
    type: 'material' as 'material' | 'activity',
    description: '',
    links: [''],
  });
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (material) {
      setFormData({
        studentId: material.studentId,
        subject: material.subject,
        type: material.type,
        description: material.description,
        links: material.links && material.links.length > 0 ? material.links : [''],
      });
      setFiles(material.files || []);
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
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
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
      studentId: formData.studentId,
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

      <div className="space-y-2">
        <Label htmlFor="student">Estudante *</Label>
        <Select value={formData.studentId} onValueChange={(value) => handleChange('studentId', value)}>
          <SelectTrigger id="student">
            <SelectValue placeholder="Selecione o estudante" />
          </SelectTrigger>
          <SelectContent>
            {students.map(s => (
              <SelectItem key={s.id} value={s.id}>
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
          <Label htmlFor="files">Arquivos (opcional para materiais)</Label>
          <Input
            id="files"
            type="file"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
          />
          {files.length > 0 && (
            <div className="space-y-2 mt-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
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
