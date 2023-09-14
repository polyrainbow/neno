import AppMenu from "./AppMenu";

interface HeaderContainerProps {
  children?: React.ReactNode,
  noBackground?: boolean,
}

const HeaderContainer = ({
  children,
  noBackground,
}: HeaderContainerProps) => {
  return (
    <>
      <header className={"app-header " + (noBackground ? "no-background" : "")}>
        {children}
      </header>
      <AppMenu />
    </>
  );
};

export default HeaderContainer;
