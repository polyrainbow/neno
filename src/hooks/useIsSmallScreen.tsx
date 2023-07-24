/*
  This hook can be used by all components that need information on if we are on
  a small screen or not. It uses the ScreenSize module so there won't be
  any unneccessary DOM queries.
*/

import * as ScreenSize from "../lib/ScreenSize";
import { useEffect, useState } from "react";

const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(
    ScreenSize.getIsSmallScreen(),
  );

  useEffect(() => {
    const updateMatch = () => {
      setIsSmallScreen(ScreenSize.getIsSmallScreen());
    };

    updateMatch();

    ScreenSize.addChangeListener(updateMatch);
    return () => {
      ScreenSize.removeChangeListener(updateMatch);
    };
  }, []);

  return isSmallScreen;
};

export default useIsSmallScreen;
