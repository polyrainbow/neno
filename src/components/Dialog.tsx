import { useEffect, useRef } from "react";
import Overlay from "./Overlay";

const Dialog = ({
  children,
  onClickOnOverlay,
  className,
}: {
  children: React.ReactNode;
  onClickOnOverlay: () => void;
  className?: string;
}) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    ref.current?.showModal();
  });

  return <Overlay
    onClick={onClickOnOverlay}
  >
    <dialog
      ref={ref}
      className={className ?? ""}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </dialog>
  </Overlay>;
};

export default Dialog;
