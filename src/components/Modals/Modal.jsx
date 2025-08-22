import { forwardRef } from "react";

const Modal = forwardRef(({ children }, ref) => {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello from Modal!</h3>
        {children}
        <div className="modal-action">
          <button className="btn" onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

export default Modal;
