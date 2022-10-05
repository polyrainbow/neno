import React from "react";

interface HeaderContainerProps {
  children?: React.ReactNode,
}

const HeaderContainer = ({
  children,
}: HeaderContainerProps) => {
  return (
    <header className="app-header">
      {children}
    </header>
  );
};

export default HeaderContainer;
