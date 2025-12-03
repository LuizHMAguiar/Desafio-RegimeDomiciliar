import { Badge } from './badge';
import type { StudentStatus } from '../../utils/studentStatus';

interface StatusBadgeProps {
  status: StudentStatus;
  className?: string;
}

/**
 * Componente reutilizável para exibir o status do regime domiciliar.
 * Aceita `status` com os valores: 'ativo' | 'encerrando' | 'encerrado'.
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let label = 'Ativo';
  let extraClass = 'bg-green-100 text-green-800 border-transparent';

  if (status === 'encerrando') {
    label = 'Próximo de encerrar';
    extraClass = 'bg-yellow-100 text-yellow-800 border-transparent';
  } else if (status === 'encerrado') {
    label = 'Encerrado';
    extraClass = 'bg-red-100 text-red-800 border-transparent';
  }

  return (
    <Badge className={`${extraClass} ${className}`.trim()}>
      {label}
    </Badge>
  );
}

export default StatusBadge;
