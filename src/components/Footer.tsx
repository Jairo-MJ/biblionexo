import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#DFD9C9] bg-[#FFFFFF] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 max-w-md">
            <p className="font-serif text-lg font-semibold text-[#18324B]">
              BiblioNexo – Biblioteca Digital
            </p>
            <p className="text-xs leading-relaxed text-[#315C78]">
              Aplicación académica de demostración con almacenamiento local en el navegador. Los
              préstamos y datos de perfil se conservan únicamente de forma local y simulada.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#18324B]">
            <Link to="/" className="hover:text-[#315C78] hover:underline underline-offset-4 whitespace-nowrap">
              Inicio
            </Link>
            <Link to="/catalogo" className="hover:text-[#315C78] hover:underline underline-offset-4 whitespace-nowrap">
              Catálogo
            </Link>
            <Link to="/favoritos" className="hover:text-[#315C78] hover:underline underline-offset-4 whitespace-nowrap">
              Mis favoritos
            </Link>
            <Link to="/prestamos" className="hover:text-[#315C78] hover:underline underline-offset-4 whitespace-nowrap">
              Mis préstamos
            </Link>
            <Link to="/perfil" className="hover:text-[#315C78] hover:underline underline-offset-4 whitespace-nowrap">
              Mi perfil
            </Link>
          </nav>
        </div>

        <div className="border-t border-[#EFEBE0] pt-6">
          <h2 className="text-xs font-semibold tracking-wide text-[#18324B]">
            Información académica
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-1.5">
              <dt className="font-semibold text-[#18324B]">Proyecto:</dt>
              <dd className="text-[#315C78]">BiblioNexo – Biblioteca Digital.</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-[#18324B]">Alumno:</dt>
              <dd className="text-[#315C78]">Jairo José María Morales Jiménez.</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-[#18324B]">Materia:</dt>
              <dd className="text-[#315C78]">Desarrollo de Aplicaciones Web en la Nube y Móviles.</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-[#18324B]">Profesor:</dt>
              <dd className="text-[#315C78]">Zeus Emmanuel Gutiérrez Cobián.</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-[#18324B]">Calendario:</dt>
              <dd className="text-[#315C78] font-mono">2026B.</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-[#18324B]">Institución:</dt>
              <dd className="text-[#315C78]">Universidad de Guadalajara – CUCEI.</dd>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  );
}
