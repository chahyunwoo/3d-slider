import { Image } from "../style/styles";

import { dataType } from "../types/dataType";

interface ImageListProps {
  items: dataType[];
  transforms: string[];
  transitionDelays: number[];
}

export default function ImageList({
  items,
  transforms,
  transitionDelays,
}: ImageListProps) {
  return (
    <>
      {items.map((item, index) => (
        <Image
          key={index}
          src={item.image}
          alt={item.alt}
          transform={transforms[index]}
          transitiondelay={transitionDelays[index]}
        />
      ))}
    </>
  );
}
