import { Layout, Drag, Spin, Ground } from "./style/styles";

import { DATA } from "./data/data";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import useDrag from "./hooks/useDrag";
import { useTransforms } from "./hooks/useTransform";

import ImageList from "./components/ImageList";

const RADIUS = 340;
const ROTATE_SPEED = -60;
const IMG_WIDTH = 190;
const IMG_HEIGHT = 230;

export default function Slider() {
  const [items] = useState(DATA);

  const layoutRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const groundRef = useRef<HTMLDivElement | null>(null);

  const {
    dragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    tX,
    tY,
    dragDirection,
    isRunning,
  } = useDrag();

  const { transforms, transitionDelays } = useTransforms({ items, RADIUS });

  useEffect(() => {
    if (spinRef.current) {
      spinRef.current.style.width = `${IMG_WIDTH}px`;
      spinRef.current.style.height = `${IMG_HEIGHT}px`;
    }

    if (groundRef.current) {
      groundRef.current.style.width = `${RADIUS * 3}px`;
      groundRef.current.style.height = `${RADIUS * 3}px`;
    }
  }, [items]);

  const wrappedHandlePointerMove = useCallback(
    (e: PointerEvent) => {
      handlePointerMove(e as unknown as React.PointerEvent<Element>);
    },
    [handlePointerMove]
  );

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", wrappedHandlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", wrappedHandlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  const MemoizedImageList = memo(ImageList);

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
          rotatespeed={ROTATE_SPEED}
          $running={isRunning}
          dragDirection={dragDirection}
        >
          <MemoizedImageList
            items={items}
            transforms={transforms}
            transitionDelays={transitionDelays}
          />
        </Spin>
        <Ground ref={groundRef} />
      </Drag>
    </Layout>
  );
}
