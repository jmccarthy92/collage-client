import { GifUrl } from "@shared/types";

export interface Option {
  handler: (ur: GifUrl) => any;
}
