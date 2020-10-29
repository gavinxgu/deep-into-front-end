import React from "react";
import { useLogger } from "react-use";
import create from "zustand";

const useStore = create<{
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <p>{bears} around here ...</p>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}

export const Zustand: React.FC = function Zustand() {
  useLogger("Zustand");
  return (
    <>
      <BearCounter />
      <Controls />
    </>
  );
};
