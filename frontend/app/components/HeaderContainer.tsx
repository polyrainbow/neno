import React from "react";
import AppMenu from "./AppMenu";

interface HeaderContainerProps {
  children?: React.ReactNode,
}

const HeaderContainer = ({
  children,
}: HeaderContainerProps) => {
  return (
    <>
      <header className="app-header">
        {children}
      </header>
      <AppMenu />
    </>
  );
};

export default HeaderContainer;
