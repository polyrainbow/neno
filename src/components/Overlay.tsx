interface OverlayProps {
  onClick: () => void;
}

const Overlay = ({
  onClick,
  children,
}: React.PropsWithChildren<OverlayProps>) => {
  return <div
    onClick={onClick}
    className="overlay"
  >
    {children}
  </div>;
};

export default Overlay;
