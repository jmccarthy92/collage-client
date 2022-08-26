import React, { useState, useMemo } from "react";
import { currentTime, randomPosition } from "@features/collage/util";

const intervalReset = 10; // time in seconds for when a users gif displays at full scale
const minScale = 0.2;
const maxScale = 0.8;
const baseDuration = 200;

interface Props {
  id: string;
  url: string;
  width: number;
  height: number;
  lastPosted?: number;
  onAnimationEnd: (id: string) => void;
}

const Gif: React.FC<Props> = ({
  id,
  url,
  width,
  height,
  lastPosted,
  onAnimationEnd,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  const { scale, zIndex } = useMemo(() => {
    if (lastPosted) {
      const cTime = currentTime();
      const userInterval = cTime - lastPosted;
      const scale = userInterval / intervalReset;
      const zIndex = cTime + userInterval - intervalReset;
      return {
        scale: Math.min(Math.max(scale, minScale), maxScale),
        zIndex: Math.min(cTime, zIndex),
      };
    }
    return { scale: maxScale, zIndex: currentTime() };
  }, [lastPosted]);

  const duration = `${baseDuration * scale}s`;

  const { top, left } = useMemo(
    () => randomPosition(height, width, scale),
    [height, width, scale]
  );

  const onLoad = () => {
    setLoaded(true);
  };

  return (
    <div
      onAnimationEnd={() => {
        onAnimationEnd(id);
      }}
      className={`${loaded ? "grow" : ""} post-container`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        animationDuration: duration,
        top,
        left,
        zIndex,
      }}
    >
      <img
        className="post-content"
        onLoad={onLoad}
        key={url}
        src={url}
        alt={url}
      />
    </div>
  );
};

export default Gif;
