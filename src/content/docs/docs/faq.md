---
title: "FAQ"
description: "Common questions about grfsh."
---

## Is grfsh ready for daily use?

It is ready as an interactive shell and for scripts that `grfsh --check` accepts. It is a young project, so keep bash or zsh installed as a fallback and report anything odd.

## Does it replace bash for scripts?

No need. Scripts with `#!/bin/bash` keep running under bash. Use grfsh for scripts you write for it, or check existing ones with `grfsh --check`.

## Can I use my zsh theme or oh-my-zsh plugins?

No. grfsh does not load zsh code. It ships its own themes with the same ideas as powerlevel10k (segments, right prompt, transient prompt, a configuration wizard), and the popular plugins are built in. See [Migrating from zsh](/docs/migrating-from-zsh/).

## Why are my colors missing?

`NO_COLOR` is set, `TERM` is `dumb`, or the output is not a terminal. For 24 bit theme colors, set `COLORTERM=truecolor` if your terminal supports it.

## The rainbow theme shows boxes instead of arrows

The terminal font is not a Nerd Font. Install one from [nerdfonts.com](https://www.nerdfonts.com), or set `icons = unicode` in `~/.config/grfsh/theme`.

## grfsh skipped my rc file with a warning

The file or its directory belongs to another user or can be written by others. Run `chmod go-w ~/.grfshrc ~` and start a new shell.

## How do I run a program called `files`, `search` or `ports`?

`command files`, or call it by its path.

## Why is it called grfsh?

The repository started as goRustlyFast. grfsh is that name as a shell.

## How do I uninstall it?

Switch back with `chsh -s /bin/bash` (or zsh), remove the binary (`rm ~/.local/bin/grfsh` for the install script, or uninstall the package), and delete `~/.config/grfsh`, `~/.local/share/grfsh`, `~/.grfsh_history` and `~/.grfsh_dirs` if you want your settings gone too.

## Where do I report bugs?

[GitHub issues](https://github.com/gdprojectsss/goRustlyFast/issues). For security problems, follow the [security policy](https://github.com/gdprojectsss/goRustlyFast/security/policy).
