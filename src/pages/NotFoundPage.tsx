import { Compass } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export function NotFoundPage() {
  return (
    <div className="py-10">
      <EmptyState
        icon={Compass}
        title="Sección no encontrada"
        description="La ruta solicitada no existe dentro de BiblioNexo. Puedes regresar a la página de inicio o explorar el catálogo."
        actionLabel="Volver al inicio"
        actionTo="/"
      />
    </div>
  );
}
