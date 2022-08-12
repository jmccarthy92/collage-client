import { SignalRContext } from "@shared/contexts/signalr";
import { useCallback, useContext } from "react";

export interface GifHandlers {
  sendGif: (url: string) => Promise<void> | undefined;
}

export const useGifMessage = (): GifHandlers => {
  const { connection } = useContext(SignalRContext);

  const sendGif = useCallback(
    (url: string) => connection?.invoke("sendGif", { url }),
    [connection]
  );

  return {
    sendGif,
  };
};
