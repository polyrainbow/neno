import React from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Tooltip = ({
  title,
  children,
}) => {
  return <Tippy content={title}>
    {children}
  </Tippy>;
};

export default Tooltip;
