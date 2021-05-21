import React from "react";
import { useLogger } from "react-use";
import { Example } from "./Example";
import { UseContextSelector } from "./UseContextSelector";

function useForceUpdate() {
  const [, forceUpdate] = React.useReducer((o) => o + 1, 0);
  return forceUpdate;
}

const refContext = React.createContext<{ a: number; b: { c: number } }>([] as any);
const stateContext = React.createContext<{ a: number; b: { c: number } }>([] as any);

const Middle: React.FC = React.memo(function Middle({ children }) {
  useLogger("Middle");
  return (
    <div>
      <div>{"Middle"}</div>
      <Inner />
      <InnerWithRefCtx />
      <InnerWithStateCtx />
    </div>
  );
});

const InnerWithRefCtx = React.memo(function InnerWithCtx() {
  const value = React.useContext(refContext);
  const forceUpdate = useForceUpdate();
  useLogger("InnerWithRefCtx");
  return (
    <div>
      <div>
        {"InnerWithRefCtx: "}
        {JSON.stringify(value)}
        <button
          onClick={() => {
            forceUpdate();
          }}
          children={"forceUpdate"}
        />
      </div>
    </div>
  );
});

const InnerWithStateCtx = React.memo(function InnerWithStateCtx() {
  const value = React.useContext(stateContext);
  useLogger("InnerWithStateCtx");
  return (
    <div>
      <div>
        {"InnerWithStateCtx: "}
        {JSON.stringify(value)}
      </div>
    </div>
  );
});

const Inner = React.memo(function Inner() {
  useLogger("Inner");
  return (
    <div>
      <div>{"Inner"}</div>
    </div>
  );
});

export const App: React.FC = () => {
  useLogger("App");
  const forceUpdate = useForceUpdate();
  const ref = React.useRef({ a: 1, b: { c: 1 } });
  const [state, setState] = React.useState({ a: 1, b: { c: 1 } });
  return (
    <>
      <refContext.Provider value={ref.current}>
        <stateContext.Provider value={state}>
          <button
            onClick={() => {
              ref.current.a += 1;
              forceUpdate();
            }}
            children={"reducer forceupdate a count ++ but not change reference"}
          />
          <button
            onClick={() => {
              ref.current = { ...ref.current, a: ref.current.a + 1 };
              forceUpdate();
            }}
            children={"reducer forceupdate a count ++"}
          />
          <button
            onClick={() => {
              setState((s) => ({ ...s, a: s.a + 1 }));
            }}
            children={"setState forceupdate a count ++"}
          />
          <div>{"Hello app"}</div>
          <Middle />
        </stateContext.Provider>
      </refContext.Provider>
      <Example />
      <UseContextSelector />
    </>
  );
};
