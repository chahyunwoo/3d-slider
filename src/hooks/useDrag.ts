import { useRef, useState, useCallback } from "react";

export default function UseDrag() {
  const [dragging, setDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  const sXRef = useRef(0);
  const sYRef = useRef(0);
  const nXRef = useRef(0);
  const nYRef = useRef(0);
  const desXRef = useRef(0);
  const desYRef = useRef(0);
  const tXRef = useRef(0);
  const tYRef = useRef(10);
  const timerRef = useRef<number | null>(null);

  const playSpin = (bool: boolean) => {
    setIsRunning(bool);
  };

  const handlePointerDown = useCallback((e: React.PointerEvent<Element>) => {
    playSpin(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    sXRef.current = e.clientX;
    sYRef.current = e.clientY;
    setDragging(true);
    e.preventDefault();
  }, []);

  const easing = 0.5;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<Element>) => {
      if (dragging) {
        requestAnimationFrame(() => {
          nXRef.current = e.clientX;
          nYRef.current = e.clientY;

          desXRef.current +=
            (nXRef.current - sXRef.current - desXRef.current) * easing;
          desYRef.current +=
            (nYRef.current - sYRef.current - desYRef.current) * easing;

          tXRef.current = tXRef.current + desXRef.current * 0.1;
          tYRef.current = tYRef.current + desYRef.current * 0.1;

          const dragDirectionValue = nXRef.current - sXRef.current > 0 ? 1 : -1;
          if (dragDirectionValue !== dragDirection) {
            setDragDirection(dragDirectionValue);
          }

          sXRef.current = nXRef.current;
          sYRef.current = nYRef.current;
        });
      }
    },
    [dragging, dragDirection]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      desXRef.current = desXRef.current * easing;
      desYRef.current = desYRef.current * easing;
      tXRef.current = tXRef.current + desXRef.current * 0.1;
      tYRef.current = tYRef.current + desYRef.current * 0.1;

      if (Math.abs(desXRef.current) < 0.5 && Math.abs(desYRef.current) < 0.5) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        playSpin(true);
      }
    }, 17);
  }, []);

  return {
    dragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    tX: tXRef.current,
    tY: tYRef.current,
    dragDirection,
    isRunning,
  };
}
