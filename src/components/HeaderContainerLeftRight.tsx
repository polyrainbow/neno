import React from "react";
import HeaderContainer from "./HeaderContainer";
import AppMenuToggle from "./AppMenuToggle";
import HistoryNavigationButtons from "./HistoryNavigationButtons";

interface HeaderContainerLeftRightProps {
  leftContent?: React.ReactNode,
  rightContent?: React.ReactNode,
}

const HeaderContainerLeftRight = ({
  leftContent,
  rightContent,
}: HeaderContainerLeftRightProps) => {
  return (
    <HeaderContainer>
      <div className="header-left">
        <AppMenuToggle />
        <HistoryNavigationButtons />
        {leftContent}
      </div>
      <div className="header-right">
        {rightContent}
      </div>
    </HeaderContainer>
  );
};

export default HeaderContainerLeftRight;
