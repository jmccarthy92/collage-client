import React from "react";
import "./App.css";
import { SignalRProvider } from "@shared/contexts/signalr";
import { Collage } from "@features/collage";

function App() {
  return (
    <SignalRProvider>
      <div className="App">
        <Collage />
      </div>
    </SignalRProvider>
  );
}

export default App;
