import { useState, useEffect } from 'react';
import { Student } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface StudentFormProps {
  student?: Student | null;
  userId: string;
  onSubmit: (student: Omit<Student, 'id' | 'registeredAt'>) => void;
  onCancel: () => void;
}

export function StudentForm({ student, userId, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    class: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        course: student.course,
        class: student.class,
        startDate: student.startDate,
        endDate: student.endDate,
      });
    }
  }, [student]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome do estudante é obrigatório');
      return false;
    }
    if (!formData.course.trim()) {
      setError('Curso é obrigatório');
      return false;
    }
    if (!formData.class.trim()) {
      setError('Turma é obrigatória');
      return false;
    }
    if (!formData.startDate) {
      setError('Data de início é obrigatória');
      return false;
    }
    if (!formData.endDate) {
      setError('Data de término é obrigatória');
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end <= start) {
      setError('A data de término deve ser posterior à data de início');
      return false;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 15) {
      setError('O período de regime domiciliar deve ser de no mínimo 15 dias');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      registeredBy: userId,
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
        <Label htmlFor="name">Nome do Estudante *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nome completo do estudante"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course">Curso *</Label>
          <Input
            id="course"
            value={formData.course}
            onChange={(e) => handleChange('course', e.target.value)}
            placeholder="Ex: Engenharia de Software"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Turma *</Label>
          <Input
            id="class"
            value={formData.class}
            onChange={(e) => handleChange('class', e.target.value)}
            placeholder="Ex: 3º Período"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Término *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          <strong>Atenção:</strong> O regime domiciliar é destinado a estudantes que ficarão ausentes 
          das atividades presenciais por mais de 15 dias consecutivos.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {student ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}
