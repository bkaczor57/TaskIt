import { emitError } from '../context/ErrorProvider';

/**
 * Zwraca czytelną wiadomość na podstawie odpowiedzi API
 * (ProblemDetails, { error }, itp.) i – o ile trzeba – pokazuje toast.
 *
 * • 404 traktujemy jako „cichy” błąd – nie wyświetlamy toasta
 * • Zwraca Error (można dalej throw‑ować lub zignorować)
 */
export const parseApiError = (err, context = '') => {
  const status = err?.response?.status;

  /* === 404 → bez toasta === */
  if (status === 404) {
    // tu możesz dodać console.debug, jeśli chcesz
    return new Error('Not found (404) – toast pominięty');
  }

  /* ---------- poprzednia logika ---------- */
  let msg;

  // custom { error: "..." }
  if (err.response?.data?.error) {
    msg = err.response.data.error;

  // ASP.NET Validation ProblemDetails
  } else if (err.response?.data?.errors) {
    const dict = err.response.data.errors;
    msg = Object.values(dict).flat().join(' • ');
  }

  // Fallback
  msg ??= err.message ?? 'Nieoczekiwany błąd';
  if (context) msg = `Błąd podczas ${context}: ${msg}`;

  emitError(msg);          // 🔔 toast (dla wszystkiego poza 404)
  return new Error(msg);
};
