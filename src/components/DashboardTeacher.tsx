import { useMemo } from 'react';
import { useStudents } from '../api/queries';
import { useAppStore } from '../stores/useAppStore';

export function DashboardTeacher() {
  const user = useAppStore((s: any) => s.user);
  const { data: students = [], isLoading } = useStudents(user ? { teacherId: user.id } : undefined);

  const recentCount = useMemo(() => {
    const now = Date.now();
    const list = (students as any[]) ?? [];
    return list.filter((s: any) => {
      const t = (s as any).registeredAt ? new Date((s as any).registeredAt).getTime() : 0;
      return now - t <= 1000 * 60 * 60 * 24 * 7;
    }).length;
  }, [students]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Painel do Professor</h2>

      <div className="flex gap-4 mb-6">
        <div className="p-4 rounded border">
          <div className="text-sm text-gray-500">Minha turma</div>
          <div className="text-xl font-bold">{students.length}</div>
        </div>
        <div className="p-4 rounded border">
          <div className="text-sm text-gray-500">Registros recentes</div>
          <div className="text-xl font-bold">{recentCount}</div>
        </div>
        <div className="p-4 rounded border">
          <div className="text-sm text-gray-500">Atalho</div>
          <a className="btn btn-primary" href="/materials/new">Adicionar material</a>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-medium mb-2">Estudantes</h3>
        {isLoading ? <p>Carregando...</p> : (
          <ul>
            {((students as any[]) ?? []).map((s: any) => (
              <li key={s.id} className="py-2 border-b">
                <a href={`/students/${s.id}`} className="hover:underline">{s.name}</a>
                <div className="text-xs text-gray-500">{s.course} — {s.class}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardTeacher;
