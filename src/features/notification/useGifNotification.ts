import { SignalRContext } from "@shared/contexts/signalr";
import { useCallback, useContext, useEffect } from "react";
import { Message, Option } from "./types";

export const useGifNotification = ({ handler }: Option): void => {
  const { connection } = useContext(SignalRContext);

  const onNotification = useCallback(
    (message: Message) => {
      console.log(`Message received for 'newGif': ${message}`);
      handler(message.url);
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
