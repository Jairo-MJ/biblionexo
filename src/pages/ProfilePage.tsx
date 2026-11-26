import { BookCheck, BookMarked, Calendar, Heart, Mail, User } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { StatCard } from '../components/StatCard';
import { useLibrary } from '../context/LibraryContext';
import { formatDateEs, validateProfileInput } from '../utils/libraryLogic';

export function ProfilePage() {
  const { profile, loans, favorites, updateProfile } = useLibrary();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile]);

  const activeLoansCount = loans.filter((l) => l.status === 'Activo').length;
  const returnedLoansCount = loans.filter((l) => l.status === 'Devuelto').length;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateProfileInput(name, email);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }
    updateProfile({ name, email });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-[#DFD9C9] pb-5">
        <h1 className="font-serif text-3xl font-semibold text-[#18324B]">
          Mi perfil
        </h1>
        <p className="max-w-2xl text-sm text-[#315C78]">
          Consulta tu resumen de actividad lectora y actualiza tus datos de demostración
          almacenados localmente en el navegador.
        </p>
      </header>

      {/* Resumen de actividad */}
      <section aria-labelledby="profile-stats-heading">
        <h2 id="profile-stats-heading" className="sr-only">
          Resumen de actividad del lector
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Préstamos activos"
            value={activeLoansCount}
            hint="En curso actualmente"
            icon={BookMarked}
            to="/prestamos"
            actionLabel="Ver préstamos"
          />
          <StatCard
            label="Préstamos devueltos"
            value={returnedLoansCount}
            hint={`Total histórico: ${loans.length}`}
            icon={BookCheck}
            to="/prestamos"
            actionLabel="Ver historial"
          />
          <StatCard
            label="Libros favoritos"
            value={favorites.length}
            hint="Guardados en tu lista"
            icon={Heart}
            to="/favoritos"
            actionLabel="Ver favoritos"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Tarjeta informativa de cuenta simulada */}
        <section
          aria-labelledby="profile-info-heading"
          className="rounded-xl border border-[#DFD9C9] bg-white p-6 lg:col-span-5 space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-[#EFEBE0] pb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#18324B] text-[#D5A85B]">
              <User className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id="profile-info-heading"
                className="font-serif text-xl font-semibold text-[#18324B] truncate"
              >
                {profile.name}
              </h2>
              <p className="text-sm text-[#315C78] truncate">{profile.email}</p>
            </div>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#315C78] mt-0.5" aria-hidden="true" />
              <div>
                <dt className="text-xs text-[#315C78]">Correo electrónico</dt>
                <dd className="font-medium text-[#18324B] break-all">{profile.email}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 shrink-0 text-[#315C78] mt-0.5" aria-hidden="true" />
              <div>
                <dt className="text-xs text-[#315C78]">Fecha de registro simulada</dt>
                <dd className="font-medium text-[#18324B] tabular-nums">
                  {formatDateEs(profile.registeredAt)}
                </dd>
              </div>
            </div>
          </dl>

          <p className="border-t border-[#EFEBE0] pt-4 text-xs leading-relaxed text-[#315C78]">
            Nota académica: esta pantalla opera sin autenticación externa ni envío de correos
            electrónicos; los cambios se guardan únicamente en LocalStorage.
          </p>
        </section>

        {/* Formulario de edición */}
        <section
          aria-labelledby="profile-edit-heading"
          className="rounded-xl border border-[#DFD9C9] bg-white p-6 lg:col-span-7"
        >
          <h2
            id="profile-edit-heading"
            className="font-serif text-xl font-semibold text-[#18324B]"
          >
            Editar información personal
          </h2>
          <p className="mt-1 text-sm text-[#315C78]">
            Modifica tu nombre y correo electrónico. Ambos campos son obligatorios.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-[#18324B]"
              >
                Nombre completo
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'profile-name-error' : undefined}
                className={`mt-1.5 h-11 w-full rounded-lg border px-3.5 text-sm text-[#18324B] transition-colors focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-[#B91C1C] bg-[#FEF2F2] focus:border-[#B91C1C] focus:ring-[#B91C1C]/15'
                    : 'border-[#D6D0C2] bg-white focus:border-[#18324B] focus:ring-[#18324B]/15'
                }`}
              />
              {errors.name && (
                <p
                  id="profile-name-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-[#B91C1C]"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-sm font-medium text-[#18324B]"
              >
                Correo electrónico
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'profile-email-error' : undefined}
                className={`mt-1.5 h-11 w-full rounded-lg border px-3.5 text-sm text-[#18324B] transition-colors focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-[#B91C1C] bg-[#FEF2F2] focus:border-[#B91C1C] focus:ring-[#B91C1C]/15'
                    : 'border-[#D6D0C2] bg-white focus:border-[#18324B] focus:ring-[#18324B]/15'
                }`}
              />
              {errors.email && (
                <p
                  id="profile-email-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-[#B91C1C]"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#18324B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => {
                  setName(profile.name);
                  setEmail(profile.email);
                  setErrors({});
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#D4CEC0] bg-white px-4 py-2.5 text-sm font-medium text-[#18324B] transition-colors hover:bg-[#F4F1E8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
              >
                Restablecer
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
