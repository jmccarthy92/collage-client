import React, { useState, createContext, useEffect } from "react";
import { SignalRClient } from "@shared/signalr";
import { Connection, Props } from "./types";

const initialState: Connection = {
  connection: null,
};

export const SignalRContext = createContext<Connection>(initialState);

const SignalRProvider: React.FC<Props> = ({ children }) => {
  const [connectionState, setState] = useState<Connection>(initialState);

  useEffect(() => {
    const connection = SignalRClient.initialize(
      process.env.SIGNALR_CONNECTION_HUB || "http://localhost:7071/api"
    );
    setState({ connection });
  }, []);

  return (
    <SignalRContext.Provider value={connectionState}>
      {children}
    </SignalRContext.Provider>
  );
};

export default SignalRProvider;
