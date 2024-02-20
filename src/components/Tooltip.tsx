import Tippy from "@tippyjs/react";
import { JSXElementConstructor } from "react";

interface TooltipProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any, string | JSXElementConstructor<any>>;
}

const Tooltip = ({
  title,
  children,
}: TooltipProps) => {
  return <Tippy content={title}>
    {children}
  </Tippy>;
};

export default Tooltip;
