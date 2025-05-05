import { emitError } from '../context/ErrorProvider';

/**
 * Zwraca czytelną wiadomość na podstawie odpowiedzi API
 * i (nieobowiązkowo) kontekstu operacji.
 *
 *  • Obsługuje ProblemDetails z `errors = { Field: [...] }`
 *  • Obsługuje własne `{ error: "..." }`
 *  • Falling‑back: error.message lub generyczny tekst
 */
export const parseApiError = (err, context = '') => {
  let msg;

  // custom { error: "..." }
  if (err.response?.data?.error) {
    msg = err.response.data.error;

  // ASP.NET Validation ProblemDetails
  } else if (err.response?.data?.errors) {
    const dict = err.response.data.errors;
    // scalamy wszystkie tablice message'ów w jedno zdanie
    msg = Object.values(dict).flat().join(' • ');
  }

  // Fallback na komunikat Error lub generyczny
  msg ??= err.message ?? 'Nieoczekiwany błąd';

  if (context) msg = `Błąd podczas ${context}: ${msg}`;

  // globalny toast
  emitError(msg);

  return new Error(msg);      // pozwala throw‑ować dalej
};
