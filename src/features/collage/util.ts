import { tldExists } from "tldjs";

const DOMAIN_CONSTRAINT =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

export const isValidDomain = (domain: string) =>
  DOMAIN_CONSTRAINT.test(domain) && tldExists(domain);

export function currentTime() {
  return Math.round(new Date().getTime() / 1000);
}

// get a random int between two given ints (inclusive)
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// generate a random position
export function randomPosition(height: number, width: number, scale: number) {
  // get window size
  const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
  const spawnArea = 0.1; // margin around screen
  // create a smaller area in the middle of the window to spawn new posts
  const spawnHeight = windowHeight * (1 - spawnArea);
  const spawnHeightOffset = windowHeight - spawnHeight;
  const spawnWidth = windowWidth * (1 - spawnArea);
  const spawnWidthOffset = windowWidth - spawnWidth;

  const totalHeight = height;

  const top = randomInt(
    spawnHeightOffset - (totalHeight / 2) * (1 - scale),
    spawnHeight - scale * totalHeight - (totalHeight / 2) * (1 - scale)
  );

  const left = randomInt(
    spawnWidthOffset - (width / 2) * (1 - scale),
    spawnWidth - scale * width - (width / 2) * (1 - scale)
  );

  return {
    top,
    left,
  };
}
