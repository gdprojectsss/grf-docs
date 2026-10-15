---
title: "Prompt themes"
description: "The prompt theme engine: styles, segments, colors, icons, right and transient prompts."
---

grfsh draws its own prompt. Run `configure-prompt` for a short wizard with live previews, or pick a preset directly:

```sh
configure-prompt --list
configure-prompt --preset rainbow
```

Both write `~/.config/grfsh/theme`, a plain `key = value` file. Edit it by hand any time; the next prompt picks up the change.

## The theme file

```ini
preset = lean            # start from a preset, then override
style = classic          # lean, classic or rainbow
icons = nerd             # nerd, unicode or ascii
lines = 2                # 1 or 2
transient = true         # collapse old prompts to a single character
left = context dir git
right = status duration jobs venv rust node python go time
prompt_char = "❯"
dir_depth = 3            # how many trailing directories to show
duration_threshold = 2   # seconds before duration appears
context_always = false   # show user@host even on local sessions
color.dir = #61afef
color.git = 178
```

A `#` starts a comment when it follows a space, so colors such as `#ff8800` work.

## Styles

- **lean** prints segments separated by spaces, with colored text and no backgrounds.
- **classic** puts segments on a dark bar with thin separators.
- **rainbow** gives each segment its own background with powerline arrows. It needs a [Nerd Font](https://www.nerdfonts.com).

## Segments

Segments only show when they have something to say.

| Segment | Shows |
| --- | --- |
| `context` | `user@host`, on SSH, as root, or with `context_always = true` |
| `dir` | the working directory, shortened to `dir_depth` parts |
| `git` | branch, a dirty marker, and ahead and behind counts |
| `status` | the exit status after a failure |
| `duration` | how long the last command took, past `duration_threshold` |
| `jobs` | the number of background jobs |
| `time` | the current time |
| `venv` | the active Python virtual environment |
| `rust`, `node`, `python`, `go` | the toolchain version inside a project of that kind |

## Colors

A color is a name (`red`, `blue`, `magenta` and the others), a number from 0 to 255, or a hex value such as `#61afef`. Hex colors use 24 bit escapes when `COLORTERM` is `truecolor` or `24bit` and the nearest 256 color otherwise. With `NO_COLOR` set, the prompt has no colors at all.

## Icons

`nerd` uses Nerd Font glyphs, `unicode` uses characters every modern font has, and `ascii` is safe for any terminal. grfsh falls back to ascii when the locale is not UTF-8.

## Right and transient prompts

The right prompt lines up at the edge of the terminal and disappears when the line gets long. With `transient = true`, a prompt shrinks to its final character once you press Enter, so the scrollback stays clean.

## starship

If you already use [starship](https://starship.rs), set `engine = starship` in the theme file and grfsh calls it to draw the prompt.

## Without a theme file

When there is no theme file, `GRFSH_THEME=name` picks a preset and `GRFSH_PROMPT` sets a template for the simple default prompt:

```sh
export GRFSH_PROMPT='{blue}{cwd}{reset} {git}{red}{status}{reset}> '
```

Placeholders: `{user}`, `{host}`, `{cwd}`, `{branch}`, `{dirty}`, `{git}`, `{status}`, `{duration}`, `{jobs}`, and the colors `{green}`, `{blue}`, `{magenta}`, `{cyan}`, `{red}`, `{yellow}`, `{bold}`, `{reset}`.
