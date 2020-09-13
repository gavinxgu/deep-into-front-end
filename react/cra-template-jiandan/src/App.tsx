import React from "react";
import { useLogger } from "react-use";

export const App: React.FC = () => {
  useLogger("App");
  return <div>{"Hello, app"}</div>;
};
