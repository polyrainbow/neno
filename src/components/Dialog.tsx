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
  return <Overlay
    onClick={onClickOnOverlay}
  >
    <dialog
      className={"dialog-box " + className ?? ""}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </dialog>
  </Overlay>;
};

export default Dialog;
