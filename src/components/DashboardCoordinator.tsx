import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../api/queries';
import { getStudentStatus } from '../utils/studentStatus';

export function DashboardCoordinator() {
  const { data: students = [], isLoading } = useStudents();

  const kpis = useMemo(() => {
    const now = new Date();
    let ativos = 0, encerrando = 0, encerrados = 0;
    const list = (students as any) ?? [];
    for (const s of list) {
      const st = getStudentStatus(s, now as any);
      if (st === 'ativo') ativos++;
      else if (st === 'encerrando') encerrando++;
      else encerrados++;
    }
    return { ativos, encerrando, encerrados, total: list.length };
  }, [students]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded border bg-white">
          <div className="text-sm text-gray-500">Estudantes Ativos</div>
          <div className="text-2xl font-bold">{kpis.ativos}</div>
        </div>
        <div className="p-4 rounded border bg-white">
          <div className="text-sm text-gray-500">Próximos de encerrar</div>
          <div className="text-2xl font-bold">{kpis.encerrando}</div>
        </div>
        <div className="p-4 rounded border bg-white">
          <div className="text-sm text-gray-500">Encerrados</div>
          <div className="text-2xl font-bold">{kpis.encerrados}</div>
        </div>
        <div className="p-4 rounded border bg-white">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold">{kpis.total}</div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Link to="/students/new" className="btn btn-primary">Cadastrar estudante</Link>
        <Link to="/students" className="btn">Listagem completa</Link>
        <Link to="/reports" className="btn">Relatórios</Link>
        <Link to="/students?filter=endingSoon" className="btn">Filtros rápidos</Link>
      </div>

      <section>
        <h3 className="text-lg font-medium mb-2">Estudantes próximos do fim</h3>
        {isLoading ? <p>Carregando...</p> : (
          <ul>
            {students.slice(0, 6).map((s: any) => (
              <li key={s.id} className="py-2 border-b">
                <Link to={`/students/${s.id}`} className="hover:underline">{s.name}</Link>
                <div className="text-xs text-gray-500">{s.course} — {s.class}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardCoordinator;
