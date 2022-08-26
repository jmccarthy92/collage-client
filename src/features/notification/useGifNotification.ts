import { SignalRContext } from "@shared/contexts/signalr";
import { GifUrl } from "@shared/types";
import { useCallback, useContext, useEffect } from "react";
import { Option } from "./types";

export const useGifNotification = ({ handler }: Option): void => {
  const { connection } = useContext(SignalRContext);

  const onNotification = useCallback(
    (message: GifUrl) => {
      console.log(`Message received for 'newGif': ${message}`);
      handler(message);
    },
    [handler]
  );

  useEffect(() => {
    if (connection) connection.on("newGif", onNotification);
    return function cleanup() {
      if (connection) connection.off("newGif", onNotification);
    };
  }, [connection, onNotification]);
};
