// React import not required with automatic JSX runtime
import { Link, useLocation } from 'react-router-dom';

type Crumb = { path: string; label: string };

export function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  const mapLabel = (segment: string) => {
    if (segment === 'students') return 'Estudantes';
    if (segment === 'dashboard') return 'Dashboard';
    if (segment === 'materials') return 'Materiais';
    if (segment === 'add') return 'Adicionar';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  let pathAcc = '';
  const crumbs: Crumb[] = parts.map((p) => {
    pathAcc += `/${p}`;
    return { path: pathAcc, label: mapLabel(p) };
  });

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
      <ol className="flex gap-2 items-center">
        <li><Link to="/" className="text-gray-500 hover:underline">Home</Link></li>
        {crumbs.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {i === crumbs.length - 1 ? (
              <span className="font-medium text-gray-800">{c.label}</span>
            ) : (
              <Link to={c.path} className="text-gray-500 hover:underline">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
