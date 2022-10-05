import React from "react";
import AppTitle from "./AppTitle";
import HeaderContainer from "./HeaderContainer";

interface HeaderContainerLeftRightProps {
  leftContent?: React.ReactNode,
  rightContent?: React.ReactNode,
  toggleAppMenu: any,
}

const HeaderContainerLeftRight = ({
  leftContent,
  rightContent,
  toggleAppMenu,
}: HeaderContainerLeftRightProps) => {
  return (
    <HeaderContainer>
      <div className="header-left">
        <AppTitle
          toggleAppMenu={toggleAppMenu}
        />
        {leftContent}
      </div>
      <div className="header-right">
        {rightContent}
      </div>
    </HeaderContainer>
  );
};

export default HeaderContainerLeftRight;
