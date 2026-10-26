import React from 'react';

export function Toast({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type || 'info'} show`}
          onClick={() => onRemove(toast.id)}
          role="status"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
