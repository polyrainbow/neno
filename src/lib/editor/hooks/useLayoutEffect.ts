import { useEffect, useLayoutEffect } from "react";
import { CAN_USE_DOM } from "../utils/canUseDom";

const useLayoutEffectImpl: typeof useLayoutEffect = CAN_USE_DOM
  ? useLayoutEffect
  : useEffect;

export default useLayoutEffectImpl;
