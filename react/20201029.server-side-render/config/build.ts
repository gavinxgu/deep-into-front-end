import { join } from "path";
import { InputOptions, OutputOptions, rollup, watch as rollupWatch } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

const isWatchMode = process.argv.includes("-w");

async function build({
  watch = false
}: {
  watch?: boolean;
} = {}) {
  const inputOptions: InputOptions = {
    input: join(__dirname, "../client/index.tsx"),
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true
      }),
      nodeResolve({
        browser: true
      }),
      commonjs(),
      typescript({
        tsconfig: join(__dirname, "../tsconfig.json")
      })
    ]
  };

  const outputOptions: OutputOptions = {
    file: join(__dirname, "../dist/client/index.js"),
    format: "umd",
    sourcemap: "inline"
  };

  if (watch) {
    const watcher = rollupWatch({
      ...inputOptions,
      output: [outputOptions]
    });
    watcher.on("event", (event) => {
      console.log(event);
    });
  } else {
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
  }
}

if (isWatchMode) {
  build({ watch: true }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
