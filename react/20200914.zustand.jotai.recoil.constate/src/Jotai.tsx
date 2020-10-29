import React from "react";
import { Provider, atom, useAtom } from "jotai";

const countAtom = atom(0);
const doubledCountAtom = atom((get) => get(countAtom) * 2);

const Controls = function Controls() {
  const [count, setCount] = useAtom(countAtom);
  const [doubledCount] = useAtom(doubledCountAtom);
  return (
    <>
      <p>{count}</p>
      <p>
        {"x2: "}
        {doubledCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>one up</button>
    </>
  );
};

export const Jotai = function Jotai() {
  return (
    <Provider>
      <Controls />
    </Provider>
  );
};
