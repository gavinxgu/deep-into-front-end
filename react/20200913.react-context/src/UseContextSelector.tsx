import React from "react";
import { createContext, useContextSelector } from "@fluentui/react-context-selector";
import { useLogger } from "react-use";

const context = createContext({
  a: 0,
  b: {
    c: 0
  }
});

const InnerA = React.memo(function InnerA() {
  useLogger("InnerA");
  const a = useContextSelector(context, (state) => state.a);
  return (
    <div>
      {"a: "}
      {a}
    </div>
  );
});

const InnerB = React.memo(function InnerB() {
  useLogger("InnerB");
  const b = useContextSelector(context, (state) => state.b);
  return (
    <div>
      {"b.c: "}
      {b.c}
    </div>
  );
});

const Middle = React.memo(function Middle() {
  useLogger("Middle");
  return (
    <>
      <InnerA />
      <InnerB />
    </>
  );
});

export const UseContextSelector = function UseContextSelector() {
  useLogger("UseContextSelector");
  const [state, setState] = React.useState({
    a: 0,
    b: {
      c: 0
    }
  });

  return (
    <context.Provider value={state}>
      <div>
        <h1>{"Use Context Selector"}</h1>
        <button
          onClick={() => {
            setState((s) => {
              return { ...s, a: s.a + 1 };
            });
          }}
          children={"a++"}
        />
        <button
          onClick={() => {
            setState((s) => {
              return {
                ...s,
                b: {
                  ...s.b,
                  c: s.b.c + 1
                }
              };
            });
          }}
          children={"b.c++"}
        />
        <Middle />
      </div>
    </context.Provider>
  );
};
