import Tippy from "@tippyjs/react";

const Tooltip = (props) => {
  return <Tippy content={props.title}>
    {props.children}
  </Tippy>;
};

export default Tooltip;
