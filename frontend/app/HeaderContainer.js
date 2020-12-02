import React from "react";

const HeaderContainer = ({
  leftContent,
  rightContent,
}) => {
  return (
    <header>
      <div id="header-left">
        {leftContent}
      </div>
      <div id="header-right">
        {rightContent}
      </div>
    </header>
  );
};

export default HeaderContainer;
