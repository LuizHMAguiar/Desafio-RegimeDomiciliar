import type { Student } from '../types';

export type StudentStatus = 'ativo' | 'encerrando' | 'encerrado';

/**
 * Retorna o status do estudante com base em suas datas.
 * - 'encerrado'   -> quando a data atual já passou de endDate
 * - 'encerrando'  -> quando faltam 7 dias ou menos para endDate
 * - 'ativo'       -> quando está dentro do período (ou antes do início)
 *
 * Observação: se a propriedade `ultimoRegistroData` estiver presente, ela
 * pode ser utilizada em ordenações — a função abaixo apenas calcula status.
 */
export function getStudentStatus(student: Student, now: Date = new Date()): StudentStatus {
  const start = student.startDate ? new Date(student.startDate) : new Date(0);
  const end = student.endDate ? new Date(student.endDate) : new Date(0);

  // Se a data final não for válida, considerar encerrado por segurança
  if (isNaN(end.getTime())) return 'encerrado';

  // Já encerrado
  if (now > end) return 'encerrado';

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = (end.getTime() - now.getTime()) / msPerDay;

  // Próximo de encerrar: 7 dias ou menos restantes (inclui 0)
  if (daysLeft <= 7) return 'encerrando';

  // Considera ativo quando dentro do período entre start e end.
  if (!isNaN(start.getTime()) && now >= start && now <= end) return 'ativo';

  // Caso o período ainda não tenha iniciado, considerar 'ativo' (a critério do produto)
  return 'ativo';
}

/**
 * Ordena estudantes conforme regras:
 * 1) date final mais próxima (endDate asc)
 * 2) último registro mais recente (ultimoRegistroData ou registeredAt desc)
 * 3) curso (asc)
 * 4) turma (asc)
 *
 * Retorna uma nova array (não muta a original).
 */
export function sortStudents(students: Student[]): Student[] {
  return [...students].sort((a, b) => {
    const aEnd = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
    const bEnd = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;

    if (aEnd !== bEnd) return aEnd - bEnd; // mais próximo primeiro

    // Para último registro, usar propriedade 'ultimoRegistroData' se existir,
    // caso contrário usar 'registeredAt' (mais compatível com o schema atual).
    const aLast = (a as any).ultimoRegistroData ?? a.registeredAt ?? '';
    const bLast = (b as any).ultimoRegistroData ?? b.registeredAt ?? '';
    const aLastTime = aLast ? new Date(aLast).getTime() : 0;
    const bLastTime = bLast ? new Date(bLast).getTime() : 0;

    if (aLastTime !== bLastTime) return bLastTime - aLastTime; // mais recente primeiro

    // Ordenação secundária por curso e depois turma
    if (a.course !== b.course) return a.course.localeCompare(b.course);
    if (a.class !== b.class) return a.class.localeCompare(b.class);

    // fallback por nome
    return a.name.localeCompare(b.name);
  });
}

export default { getStudentStatus, sortStudents };
