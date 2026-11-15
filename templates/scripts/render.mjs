// Final render without the Remotion CLI (works where `npx remotion render` is blocked).
// usage: node scripts/render.mjs <CompId> <out.mp4> [--scale 1.3333] [--audio mix.wav] [--frames a-b] [--crf 16]
//   --audio muxes the finished sound mix in (Remotion writes a silent track; it is replaced).
//   Set REMOTION_TMP to a folder on a big drive outside OneDrive: every bundle copies public/ into the temp folder.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
const { bundle } = await import("@remotion/bundler");
const { renderMedia, selectComposition } = await import("@remotion/renderer");

const [id, out, ...rest] = process.argv.slice(2);
if (!id || !out) { console.error("usage: node scripts/render.mjs <CompId> <out.mp4> [--scale n] [--audio mix.wav] [--frames a-b] [--crf n]"); process.exit(1); }
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : d; };
const scale = Number(opt("scale", "1")), crf = Number(opt("crf", "16")), audio = opt("audio"), frames = opt("frames");
const browserExecutable = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
const chromiumOptions = { gl: "angle" };
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY || "src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions });
const silent = audio ? out.replace(/\.mp4$/, ".video.mp4") : out;
const t0 = Date.now();
let last = 0;
await renderMedia({
  composition, serveUrl, codec: "h264", crf, scale, outputLocation: silent, browserExecutable, chromiumOptions,
  concurrency: Number(opt("concurrency", "2")), timeoutInMilliseconds: 180000,
  frameRange: frames ? frames.split("-").map(Number) : null,
  onProgress: ({ renderedFrames }) => { if (renderedFrames - last >= 150) { last = renderedFrames; console.log(`frame ${renderedFrames}  ${(renderedFrames / ((Date.now() - t0) / 1000)).toFixed(1)} fps`); } },
});
if (audio) {
  const ff = path.resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
  const r = spawnSync(fs.existsSync(ff) ? ff : "ffmpeg", ["-y", "-v", "error", "-i", silent, "-i", audio, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", out], { stdio: "inherit" });
  if (r.status !== 0) { console.error("mux failed; silent video kept at", silent); process.exit(1); }
  fs.unlinkSync(silent);
}
console.log(`done: ${out}  (${(fs.statSync(out).size / 1e6).toFixed(1)} MB, ${((Date.now() - t0) / 1000).toFixed(0)} s)`);
