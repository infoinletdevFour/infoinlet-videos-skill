# infoinlet-videos-skill

A Claude Code skill that makes 55-70 second vertical animated story shorts (YouTube Shorts, TikTok, Reels).

The style is 2D cartoon characters in a colourful 3D world: ink outlines, a painted town, lens blur, gliding cameras, voice narration, music and sound effects. Everything is drawn in code (three.js inside Remotion) and rendered on your own PC. No AI video generator is used.

Based on [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) (MIT), renamed to `infoinlet-video` and extended with a ready project, the 3D models and a render script.

---

## 1. What you need first

| Tool | Why | Check it with |
|---|---|---|
| [Claude Code](https://claude.com/claude-code) | Runs the skill | `claude --version` |
| [Git](https://git-scm.com/) | Downloads the skill | `git --version` |
| [Node.js](https://nodejs.org/) 20 or newer | Runs Remotion (the renderer) | `node -v` |
| [Python](https://www.python.org/) 3.10 or newer | Makes the music and sound effects, runs quality checks | `python --version` |
| Google Chrome or Microsoft Edge | Draws every frame | Installed in the default location |

You also need about 5 GB of free disk space and a PC with a graphics card (built-in graphics work, only slower).

## 2. Where everything is kept

There are two folders. Keep them separate.

| Folder | What it is | Where it goes |
|---|---|---|
| **The skill** (this repo) | Instructions and templates that Claude reads | `~/.claude/skills/infoinlet-video/` (on Windows: `C:\Users\<you>\.claude\skills\infoinlet-video\`) |
| **The video project** | Where your videos are actually built and rendered | `C:\dev\infoinlet-video` on Windows, `~/infoinlet-video` on Mac/Linux |

Important: do **not** put the video project inside OneDrive, Dropbox, Google Drive or iCloud. It holds thousands of small files and syncing them makes everything slow or broken.

## 3. Install (one time)

### Step 1: download the skill

Open a terminal (on Windows use **Git Bash**) and run:

```bash
git clone https://github.com/infoinletdevFour/infoinlet-videos-skill.git ~/.claude/skills/infoinlet-video
```

The folder name must be exactly `infoinlet-video`. That name is what makes the `/infoinlet-video` command appear.

### Step 2: install the Python libraries

```bash
pip install numpy scipy pillow
```

### Step 3: build the video project

**Easy way:** open Claude Code and type:

```
/infoinlet-video set up the project
```

Claude copies the templates into `C:\dev\infoinlet-video`, installs the packages and renders two test pictures to prove it works.

**Manual way** (same result):

```bash
S=~/.claude/skills/infoinlet-video/templates
P=/c/dev/infoinlet-video            # Mac/Linux: P=~/infoinlet-video

mkdir -p $P/src/videos/bridge $P/scripts $P/public/bridge/kenney
cp -r $S/project/. $P/
mv $P/gitignore.txt $P/.gitignore
cp $S/bridge/*  $P/src/videos/bridge/
cp $S/scripts/* $P/scripts/
cp -r $S/kenney/. $P/public/bridge/kenney/

cd $P
npm install
```

### Step 4: test it

```bash
cd /c/dev/infoinlet-video
export REMOTION_TMP=C:/dev/remotion-tmp
npx tsc --noEmit
node scripts/bridge-stills.mjs out/bridge/test_ 400,1900 0.5
```

After about a minute you should have `out/bridge/test_400.jpg` and `out/bridge/test_1900.jpg`: soldiers marching on a bridge. If you see them, the install is complete.

## 4. Make a video

1. Open a terminal in the video project folder and start Claude Code:
   ```bash
   cd /c/dev/infoinlet-video
   claude
   ```
2. Type the command with your topic:
   ```
   /infoinlet-video make a short about why the Tacoma Narrows bridge twisted apart
   ```
3. Claude then works through these steps:

| Step | What Claude does | What you do |
|---|---|---|
| 1. Topic and facts | Researches one surprising true story and lists the facts with sources | Nothing |
| 2. Script | Writes a 55-70 s script (hook, setting, build-up, snap, explanation, twist) | **Read it and approve it, or ask for changes** |
| 3. Voice | Makes the narration and the timing of every word | Nothing (or supply your own recording) |
| 4. Shot plan | Plans every camera shot, timed to the words | Nothing |
| 5-7. World, characters, effects | Builds the 3D scene, draws the characters, sets the look | Nothing |
| 8. Sound | Generates music and sound effects and mixes them under the voice | Nothing |
| 9. Look checks | Renders test pictures and fixes what looks wrong | Look at them if you like |
| 10. Final render | Renders the 2K video (1440x2560) with sound and runs a frame-by-frame check | Wait; this is the slow part |
| 11. Deliver | Gives you the final MP4 | Watch it, ask for changes |

Claude only stops for you at step 2. After you approve the script it runs to the end.

### Good topics

Pick one true story with a physical cause and effect that is easy to show, for example a bridge that fell, a machine that failed or an invention that went wrong. The built-in example is "The Bridge That Fell for a Song": 74 soldiers marching in step brought down an iron bridge in 1831.

### Asking for changes

Just say it in plain words, for example:

- "Make the hook line shorter."
- "Shot 5 is too dark."
- "The character in the middle should look scared when the bridge snaps."
- "Make the music quieter."

## 5. Where your files end up

Inside the video project (`C:\dev\infoinlet-video`):

| Path | What is there |
|---|---|
| `src/videos/<name>/` | The code of one video (one folder per video) |
| `src/Root.tsx` | The list of all videos |
| `shorts/<name>/` | That video's script, voice and sound files |
| `out/<name>/` | Test pictures, quality reports and the **final MP4** |
| `public/` | 3D models and other assets |

## 6. Rules built into the skill

Claude follows these unless you tell it otherwise:

- No captions or text labels in the video.
- English narration, one steady voice.
- Jokes are real, researched facts.
- Final export is 2K vertical (1440x2560, 30 fps).
- Story, characters and voice are always original. Nothing is copied from other channels.

To change a rule for good, edit `SKILL.md` in the skill folder. To change it for one video, just tell Claude.

## 7. Useful commands

Run these inside the video project folder. Claude runs them for you; they are here in case you want to do it yourself.

```bash
export REMOTION_TMP=C:/dev/remotion-tmp        # always set this first

# test pictures of frames 100 and 400 at half size
COMP=BridgeShort node scripts/bridge-stills.mjs out/bridge/x_ 100,400 0.5

# a quick 2-second test video
node scripts/render.mjs BridgeShort out/bridge/test.mp4 --frames 380-439

# the final 2K video with sound
node scripts/render.mjs BridgeShort out/bridge/final.mp4 --scale 1.3333 --audio shorts/bridge/audio/mix.wav

# open the Remotion preview in the browser
npm run studio
```

## 8. Problems and fixes

| Problem | Fix |
|---|---|
| `/infoinlet-video` does not appear | The skill folder must be `~/.claude/skills/infoinlet-video/` with `SKILL.md` directly inside it. Restart Claude Code. |
| The disk fills up | Every render copies files into the temp folder. Always set `REMOTION_TMP` to a folder on a big drive, and delete the `remotion-webpack-bundle-*` folders in it when no render is running. |
| `ffmpeg: command not found` in the Python scripts | Run `export PATH="$PWD/node_modules/@remotion/compositor-win32-x64-msvc:$PATH"` in the project folder. Remotion ships its own ffmpeg. On Mac/Linux install ffmpeg normally. |
| `npx remotion render` is blocked or fails | Use `node scripts/render.mjs` instead. |
| Trees, stalls and carts are missing from the picture | The models are not in `public/bridge/kenney/`. Copy `templates/kenney/` there again. |
| `No module named 'scipy'` | Run `pip install numpy scipy pillow`. |
| Chrome is not found | Install Chrome or Edge in the default location, or edit the path at the top of `scripts/render.mjs` and `scripts/bridge-stills.mjs`. |
| The final render is slow | Normal. A 67-second 2K video is 2,025 frames. Test with `--frames` first and let the full render run in the background. |

## 9. Get updates

When this repo changes, update your copy:

```bash
cd ~/.claude/skills/infoinlet-video
git pull
```

Your videos are not touched; they live in the video project folder.

## 10. What is in this repo

| Path | What it is |
|---|---|
| `SKILL.md` | The skill itself: setup, the full pipeline, every rule, known traps and the final look values |
| `templates/project/` | The Remotion project starter: `package.json`, `tsconfig.json`, `src/index.ts`, `src/Root.tsx` |
| `templates/bridge/` | Full source of the example video: world, characters, ink, lens blur, colour grade, story and camera |
| `templates/kenney/` | The 26 Kenney 3D models the example uses (free, CC0) |
| `templates/audio/` | The Python sound scripts: sound effects, music, the mix |
| `templates/scripts/` | Test pictures, final render, side-by-side sheets and frame-by-frame quality check |
| `references/STYLE_BIBLE.md` | The script and visual formula |
| `references/reports/` | Seven measured style reports: motion, depth, textures, characters, lighting, outlines, grade |

The original repo also has reference frames taken from another creator's videos (`references/frames/`, `references/sheets/`). They are not republished here. For private style study, copy those two folders from the [original repo](https://github.com/mromidev/claude-animated-shorts) into `references/`.

## License

MIT (see `LICENSE`, original copyright kept). The Kenney models are CC0 (`templates/kenney/LICENSE.txt`).
