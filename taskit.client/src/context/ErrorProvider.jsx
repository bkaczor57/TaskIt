// ErrorProvider.jsx – global toast system (updated to expose emitter)
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ErrorToast.css';

/* ------------------------------------------------------------------
   GLOBAL EMITTER
------------------------------------------------------------------ */
let _globalEmit = (msg) => console.error("[ErrorProvider not mounted]", msg);
export const emitError = (msg) => _globalEmit(msg);

/* ------------------------------------------------------------------
   CONTEXT
------------------------------------------------------------------ */
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // [{ id, text }]

  const showError = useCallback((text) => {
    if (!text) return;                 // <-- ignoruj puste
    setQueue(prev => [...prev, { id: Date.now(), text }]);
  }, []);

  // expose to non‑React modules
  useEffect(() => {
    _globalEmit = showError;
  }, [showError]);

  const remove = useCallback((id) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {createPortal(
        <div className="error-toast-wrapper">
          {queue.map((item) => (
            <ErrorToast key={item.id} {...item} onDone={() => remove(item.id)} />
          ))}
        </div>,
        document.body
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useError must be used within ErrorProvider');
  return ctx;
};

/* ------------------------------------------------------------------
   SINGLE TOAST
------------------------------------------------------------------ */
const ErrorToast = ({ id, text, onDone }) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setClosing(true), 10000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(onDone, 300);
    return () => clearTimeout(t);
  }, [closing, onDone]);

  const handleClick = async () => {
    try { await navigator.clipboard.writeText(text); } catch(_) {}
  };

  return (
    <div
      className={`error-toast ${closing ? 'hide' : 'show'}`}
      title={text}
      onClick={handleClick}
    >
      {text}
    </div>
  );
};
