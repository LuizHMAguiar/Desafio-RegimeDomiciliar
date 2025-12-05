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
  let customStyle: React.CSSProperties = {};

  if (status === 'encerrando') {
    label = 'Próximo de encerrar';
    extraClass = 'bg-yellow-100 text-yellow-800 border-transparent';
  } else if (status === 'encerrado') {
    label = 'Encerrado';
    extraClass = 'border-transparent';
    customStyle = { 
      backgroundColor: '#ef4444', 
      color: '#ffffff',
      fontWeight: '600'
    };
  }

  return (
    <Badge 
      className={`${extraClass} ${className}`.trim()}
      style={customStyle}
    >
      {label}
    </Badge>
  );
}

export default StatusBadge;
