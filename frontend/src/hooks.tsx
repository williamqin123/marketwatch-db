import { useEffect, useRef } from "react";

export const useEffectSingleDependencyOnlyOnChanges = (effect, dep) => {
  const prev = useRef(undefined);

  useEffect(() => {
    if (prev.current && prev.current !== dep) {
      // If the dependency has changed, run the effect
      return effect();
    }
    prev.current = dep;
  }, [dep]);
};
