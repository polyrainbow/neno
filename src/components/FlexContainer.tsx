interface FlexContainerProps {
  onClick?: () => void;
  className?: string;
  centerAlignedItems?: boolean;
}

const FlexContainer = ({
  onClick,
  className,
  centerAlignedItems,
  children,
}: React.PropsWithChildren<FlexContainerProps>) => {
  return <div
    onClick={onClick}
    className={
      "flex-container"
      + (className ? " " + className : "")
      + (centerAlignedItems ? " center-aligned-items" : "")
    }
  >
    {children}
  </div>;
};

export default FlexContainer;
