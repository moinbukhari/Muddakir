import { useEffect, useRef, type DialogHTMLAttributes } from "react";
import IconOnly from "./icon";
import { cn } from "~/utils";

interface DialogProps
  extends DialogHTMLAttributes<HTMLDialogElement>{
  open: boolean;
  onOpenChange(open: boolean): void;
}

const MyModal: React.FC<DialogProps> = ({
  className,
  open,
  onOpenChange,
  ...props
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    onOpenChange(false);

  };

  useEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      console.log(e.target);
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleEvent);

    return () => {
      document.removeEventListener("mousedown", handleEvent);
    };
  });

  return (
    <>
      {open && (
        <div className={cn( "fixed inset-0 flex items-center justify-center bg-slate-950/50 px-5" , className )}>
          <dialog
            className="relative m-auto flex h-[600px] w-full max-w-lg flex-col items-center justify-center  rounded-lg bg-slate-100"
            ref={modalRef}
          >
            <button
              className="absolute right-2 top-2 flex h-4 w-4 appearance-none items-center justify-center rounded-full bg-slate-950/50 hover:bg-slate-950/60 xs:right-4 xs:top-4 xs:h-6 xs:w-6"
              onClick={handleCloseModal}
            >
              <IconOnly type="incorrect" />
            </button>
            {props.children}
          </dialog>
        </div>
      )}
    </>
  );
};

export default MyModal;
