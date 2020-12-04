import React from "react";
import HeaderContainer from "./HeaderContainer";
import HeaderControls from "./HeaderControls";
import AppStats from "./AppStats";

const Header = ({
  stats,
  openImportLinksDialog,
  setActiveView,
}) => {
  return (
    <HeaderContainer
      leftContent={
        <>
          <h1 id="heading">NeNo</h1>
          <HeaderControls
            setActiveView={setActiveView}
            openImportLinksDialog={openImportLinksDialog}
          />
        </>
      }
      rightContent={
        <AppStats stats={stats} />
      }
    />
  );
};

export default Header;
