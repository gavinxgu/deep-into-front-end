import React from "react";

interface Theme {
  backgroundColor: string;
  textColor: string;
}

const darkTheme = {
  backgroundColor: "#222",
  textColor: "#eee",
};

const lightTheme = {
  backgroundColor: "#eee",
  textColor: "#222",
};

// @ts-ignore
const ThemeCtx = React.createContext<Theme>(darkTheme, () => 0);

const Box: React.FC = React.memo(function Box() {
  const theme = React.useContext(ThemeCtx);
  return (
    <div
      style={{
        width: 100,
        height: 100,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {"I am a box!"}
    </div>
  );
});

export const Example: React.FC = function Example() {
  const [theme, setTheme] = React.useState(darkTheme);
  return (
    <ThemeCtx.Provider value={theme}>
      <div>
        <h1>{"Change Theme"}</h1>
        <button onClick={() => setTheme(darkTheme)} children={"dark"} />
        <button onClick={() => setTheme(lightTheme)} children={"light"} />
        <Box />
      </div>
    </ThemeCtx.Provider>
  );
};
