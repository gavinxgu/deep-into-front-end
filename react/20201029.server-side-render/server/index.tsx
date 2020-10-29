import path from "path";
import fs from "fs";
import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";
import App from "../shared/App";

const PORT = process.env.PORT || 3006;
const app = express();

app.get("/", (req, res) => {
  const appString = ReactDOMServer.renderToString(<App />);

  const indexFile = path.resolve(__dirname, "../index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${appString}</div>`)
    );
  });
});

app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
