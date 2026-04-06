import { useEffect } from 'react';
import '../Design/dialog.css';

function DeleteDialog({ open, onClose, onConfirm }) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <button type="button" className="close" onClick={onClose}>✕</button>
        <h3>Delete this work?</h3>
        <button type="button" className="delete" onClick={onConfirm}>Delete</button>
        <button type="button" className="cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}


export default DeleteDialog;