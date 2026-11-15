# infoinlet-videos-skill

A Claude Code skill that makes 55-70 s vertical animated story shorts: 2D cartoon characters in a colourful 3D world, with ink outlines, a painted town, lens blur, gliding cameras, a march score and sound effects. Everything is rendered with three.js inside Remotion on your own PC, with no AI video generator.

Based on [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) (MIT), renamed to `infoinlet-video` and extended with a ready project scaffold, the 3D models and a render script.

## Use
In Claude Code, type:

```
/infoinlet-video make a short about <your topic>
```

Claude follows `SKILL.md`: topic and facts, script (it stops here for your approval), voice, shot plan, stills, sound, final 2K render.

## Install
1. Clone this repo to `~/.claude/skills/infoinlet-video/`:
   `git clone https://github.com/infoinletdevFour/infoinlet-videos-skill.git ~/.claude/skills/infoinlet-video`
2. You need Node, Python 3 (`pip install numpy scipy pillow`) and Chrome or Edge.
3. Build the Remotion project once (see "Start here" in `SKILL.md`): copy `templates/project/`, `templates/bridge/`, `templates/scripts/` and `templates/kenney/` into place, then `npm install`.

## What's inside
| Path | What it is |
|---|---|
| `SKILL.md` | The skill: setup, the full pipeline, every rule, every fix, and the final look values |
| `templates/project/` | Remotion project scaffold: `package.json`, `tsconfig.json`, `src/index.ts`, `src/Root.tsx` |
| `templates/bridge/` | Full source of the example short: world, characters, ink, lens blur, grade, story/camera |
| `templates/kenney/` | The 26 Kenney 3D models the example uses (CC0) |
| `templates/audio/` | The synthesized sound: SFX, march music, the mix with ducking and loudness |
| `templates/scripts/` | Stills, final render (`render.mjs`), side-by-side sheets, shot merge and frame-by-frame QA |
| `references/STYLE_BIBLE.md` | The script and visual formula |
| `references/reports/` | Seven measured reports: motion, depth, textures, characters, lighting, outlines, grade |

The original repo also ships reference frames and contact sheets taken from another creator's videos (`references/frames/`, `references/sheets/`). They are not republished here. If you want them for private style study, copy those two folders from the original repo into `references/`.

## Notes
- Set `REMOTION_TMP` to a folder on a big drive outside OneDrive. Every Remotion bundle copies `public/` into the temp folder.
- Story, characters and voice should always be your own. Use the references for the look, not the content.

## License
MIT (see `LICENSE`, original copyright kept). Kenney models are CC0 (`templates/kenney/LICENSE.txt`).
