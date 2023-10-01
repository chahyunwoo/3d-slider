import { Layout, Drag, Spin, Image, Ground } from "./style/styles";

import picture1 from "./assets/images/1.jpg";
import picture2 from "./assets/images/2.jpg";
import picture3 from "./assets/images/3.jpg";
import picture4 from "./assets/images/4.jpg";
import picture5 from "./assets/images/5.jpg";
import picture6 from "./assets/images/6.jpg";
import picture7 from "./assets/images/7.jpg";
import picture8 from "./assets/images/8.jpg";
import picture9 from "./assets/images/9.jpg";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";

export default function Slider() {
  const Pictures = [
    picture1,
    picture2,
    picture3,
    picture4,
    picture5,
    picture6,
    picture7,
    picture8,
    picture9,
  ];

  const [items] = useState(
    [...Array(9)].map((_, i) => ({ id: i, image: Pictures[i] }))
  );
  const [transforms, setTransforms] = useState<string[]>([]);
  const [transitionDelays, setTransitionDelays] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [dragDirection, setDragDirection] = useState(1);

  const layoutRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const groundRef = useRef<HTMLDivElement | null>(null);

  const sXRef = useRef(0);
  const sYRef = useRef(0);
  const nXRef = useRef(0);
  const nYRef = useRef(0);
  const desXRef = useRef(0);
  const desYRef = useRef(0);
  const tXRef = useRef(0);
  const tYRef = useRef(10);
  const timerRef = useRef<number | null>(null);

  let sX = sXRef.current;
  let sY = sYRef.current;
  let nX = nXRef.current;
  let nY = nYRef.current;
  let desX = desXRef.current;
  let desY = desYRef.current;
  let tX = tXRef.current;
  let tY = tYRef.current;
  let timer = timerRef.current;

  const easing = 0.5;

  const radius = 340;
  const rotateSpeed = -60;
  const imgWidth = 190;
  const imgHeight = 230;

  useEffect(() => {
    if (spinRef.current) {
      spinRef.current.style.width = `${imgWidth}px`;
      spinRef.current.style.height = `${imgHeight}px`;
    }

    if (groundRef.current) {
      groundRef.current.style.width = `${radius * 3}px`;
      groundRef.current.style.height = `${radius * 3}px`;
    }

    const initialTransforms = items.map(() => `rotateY(0deg) translateZ(0px)`);
    const initialTransitionDelays = items.map((_, index) => index / 4);

    setTransforms(initialTransforms);
    setTransitionDelays(initialTransitionDelays);

    setTimeout(() => {
      const newTransforms = items.map(
        (_, index) =>
          `rotateY(${index * (360 / items.length)}deg) translateZ(${radius}px)`
      );
      const newTransitionDelays = items.map(
        (_, index) => (items.length - index) / 4
      );

      setTransforms(newTransforms);
      setTransitionDelays(newTransitionDelays);
    }, 100);
  }, [items]);

  const playSpin = (bool: boolean) => {
    setIsRunning(bool);
  };

  const handlePointerDown = useCallback((e: any) => {
    playSpin(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    sXRef.current = e.clientX;
    sYRef.current = e.clientY;
    setDragging(true);
    e.preventDefault();
  }, []);

  const handlePointerMove = useCallback(
    (e: any) => {
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

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  return (
    <Layout
      ref={layoutRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Drag ref={dragRef} tX={tX} tY={tY}>
        <Spin
          ref={spinRef}
          rotatespeed={rotateSpeed}
          $running={isRunning}
          dragDirection={dragDirection}
        >
          {items.map((item, index) => {
            return (
              <Image
                key={index}
                src={item.image}
                transform={transforms[index]}
                transitiondelay={transitionDelays[index]}
              />
            );
          })}
        </Spin>

        <Ground ref={groundRef} />
      </Drag>
    </Layout>
  );
}
