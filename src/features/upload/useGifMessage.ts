import { SignalRContext } from "@shared/contexts/signalr";
import { useContext } from "react";

export interface GifHandlers {
  sendGif: (url: string) => Promise<void> | undefined;
}

export const useGifMessage = (): GifHandlers => {
  const { connection } = useContext(SignalRContext);

  const sendGif = (url: string) => connection?.invoke("sendGif", { url });

  return {
    sendGif,
  };
};
