import React, { useContext } from "react";
import AppMenuContext from "../contexts/AppMenuContext";
import AppTitle from "./AppTitle";
import HeaderContainer from "./HeaderContainer";

interface HeaderContainerLeftRightProps {
  leftContent?: React.ReactNode,
  rightContent?: React.ReactNode,
}

const HeaderContainerLeftRight = ({
  leftContent,
  rightContent,
}: HeaderContainerLeftRightProps) => {
  const { toggleAppMenu } = useContext(AppMenuContext);

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
