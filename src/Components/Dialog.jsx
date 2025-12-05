import { useEffect } from 'react';
import '../Design/dialog.css';

// function DeleteDialog({ open, onClose, onConfirm }) {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Delete this work?</DialogTitle>
//       <DialogContent>Are you sure you want to delete this artwork?</DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={onConfirm} color="error">Delete</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

function DeleteDialog({ open, onClose, onConfirm }) {
    // Disable body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll');
    }
    // Upon Closing, re-enable body scroll
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  if (!open) return null;

  // A plain <button> without type="button" inside it 
  // would default to type="submit" and triggers the form submit regardless of onClick handler.

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