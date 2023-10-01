import { styled, keyframes, css } from "styled-components";

interface ImageProps {
  transform: string;
  transitiondelay: number;
}

interface DragProps {
  tX: number;
  tY: number;
}

interface SpinProps {
  rotatespeed: number;
  $running: boolean;
  dragDirection: number;
}

export const Layout = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: #070716;
  perspective: 1000px;
  transform-style: preserve-3d;
`;

export const Drag = styled.div<DragProps>`
  position: relative;
  display: flex;
  margin: auto;
  transform-style: preserve-3d;
  transform: ${({ tX, tY }) =>
    `rotateX(${tY > 50 ? -50 : tY < 0 ? 0 : -tY}deg) rotateY(${tX}deg)`};
  transition: all 1s;
`;

export const Spin = styled.div<SpinProps>`
  position: relative;
  top: -100px;
  display: flex;
  margin: auto;
  transform-style: preserve-3d;
  transform: rotateX(-10deg);
  animation: ${({ rotatespeed, dragDirection }) =>
    dragDirection > 0
      ? css`
          ${spinAnimation} ${Math.abs(rotatespeed)}s infinite linear
        `
      : css`
          ${spinRevertAnimation} ${Math.abs(rotatespeed)}s infinite linear
        `};
  animation-play-state: ${({ $running }) => ($running ? "running" : "paused")};
`;

export const Image = styled.img<ImageProps>`
  transform-style: preserve-3d;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  box-shadow: 0 0 8px #fff;
  transform: ${({ transform }) => transform};
  transition: transform 1s;
  transition-delay: ${({ transitiondelay }) => `${transitiondelay}s`};
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0005);

  &:hover {
    box-shadow: 0 0 15px #fffd;
    -webkit-box-reflect: below 10px
      linear-gradient(transparent, transparent, #0007);
  }
`;

export const Ground = styled.div`
  width: 900px;
  height: 900px;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(90deg);
`;

const spinAnimation = keyframes`
  from {
    transform: rotateY(0deg)
  }

  to {
    transform: rotateY(360deg)
  }
`;

const spinRevertAnimation = keyframes`
from {
  transform: rotateY(360deg)
}

to {
  transform: rotateY(0deg)
}
`;
