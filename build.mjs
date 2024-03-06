import { context } from "esbuild";
import fs from 'fs/promises';

const WATCH = process.argv.includes('--watch');

/** @type import("esbuild").Plugin */
const copyHtmlPlugin = {
  name: "HTMLPlugin",
  setup(pluginBuild) {
    pluginBuild.onEnd(async () => {
      try {
        fs.copyFile('./index.html', `${pluginBuild.initialOptions.outdir}/index.html`);
      } catch (e) { console.log(e); };
    });
  }
};

const createContext = async () => await context({
  entryPoints: ["./src/main.ts"],
  outdir: "./build",
  plugins: [
    copyHtmlPlugin
  ],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  logLevel: 'debug'
});

const ctx = await createContext();

if (WATCH) {
  ctx.watch();
} else {
  await ctx.rebuild();
  ctx.dispose();
}
