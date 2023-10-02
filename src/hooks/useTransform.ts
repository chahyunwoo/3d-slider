// hooks/useTransforms.ts
import { useEffect, useState } from "react";

import { dataType } from "../types/dataType";

interface useTransformsProps {
  items: dataType[];
  RADIUS: number;
}

export function useTransforms({ items, RADIUS }: useTransformsProps) {
  const [transforms, setTransforms] = useState<string[]>([]);
  const [transitionDelays, setTransitionDelays] = useState<number[]>([]);

  useEffect(() => {
    const initialTransforms = items.map(() => `rotateY(0deg) translateZ(0px)`);
    const initialTransitionDelays = items.map((_, index) => index / 4);

    setTransforms(initialTransforms);
    setTransitionDelays(initialTransitionDelays);

    setTimeout(() => {
      const newTransforms = items.map(
        (_, index) =>
          `rotateY(${index * (360 / items.length)}deg) translateZ(${RADIUS}px)`
      );
      const newTransitionDelays = items.map(
        (_, index) => (items.length - index) / 4
      );

      setTransforms(newTransforms);
      setTransitionDelays(newTransitionDelays);
    }, 100);
  }, [items, RADIUS]);

  return {
    transforms,
    transitionDelays,
  };
}
