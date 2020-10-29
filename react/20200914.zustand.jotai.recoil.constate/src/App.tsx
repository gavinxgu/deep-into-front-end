import React from "react";
import { useLogger } from "react-use";
import { Zustand } from "./Zustand";
import { Jotai } from "./Jotai";
import { Recoil } from "./Recoil";

export const App: React.FC = () => {
  useLogger("App");
  return (
    <div>
      <h1>{"Zustand"}</h1>
      <Zustand />
      <h1>{"Jotai"}</h1>
      <Jotai />
      <h1>{"Recoil"}</h1>
      <Recoil />
    </div>
  );
};
