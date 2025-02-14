import { useEffect, useRef, useState } from "react";
import { l } from "../lib/intl";
import IconButton from "./IconButton";
import AppMenu from "./AppMenu";


const AppMenuToggle = () => {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (ref.current?.open && !showMenu) {
      ref.current?.close();
    } else if (!ref.current?.open && showMenu) {
      ref.current?.showModal();
    }
  }, [showMenu]);



  return <>
    <IconButton
      onClick={() => {
        setShowMenu(true);
      }}
      icon="menu"
      title={l("app.menu-button.alt")}
      disableTooltip={true}
      id="app-menu-toggle"
    />
    {
      showMenu
        ? <AppMenu ref={ref} onSelect={() => {
          setShowMenu(false);
        }}/>
        : ""
    }
  </>;
};

export default AppMenuToggle;
