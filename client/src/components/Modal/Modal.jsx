import { useEffect } from 'react';
import styles from './Modal.module.scss';

export default function Modal({ title, onClose, onSubmit, submitLabel = 'Отправить', children, isOpen = true }) {
  if (!isOpen) return null;
  
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <form className={styles.modal} onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <div className={styles.formHeader}>
          <span className={styles.formTitle}>{title}</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37 1L0 36" stroke="black" strokeWidth="2"/>
              <path d="M0 0.5L36.5 36.5" stroke="black" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className={styles.formBody}>
          {children}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className="btn btn-primary">{submitLabel}</button>
          <button type="button" className="btn btn-cancel" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
