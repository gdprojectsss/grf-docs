---
title: "Configuration"
description: "Startup files, plugins, environment variables and the files grfsh writes."
---

## Startup files

| File | Read by |
| --- | --- |
| `~/.config/grfsh/profile` or `~/.grfsh_profile` | login shells, first |
| `~/.config/grfsh/grfshrc` or `~/.grfshrc` | interactive shells and shells reading standard input |
| `~/.config/grfsh/plugins/*/init.grfsh` | interactive shells, after the rc file, in name order |
| `~/.config/grfsh/theme` | the prompt, reread when it changes |

On macOS, login shells first add the directories from `/etc/paths` and `/etc/paths.d` to `PATH`, as `path_helper` does for zsh and bash. `XDG_CONFIG_HOME` moves `~/.config`. Startup files and plugins are skipped with a warning when they or their directory belong to another user or can be written by group or others. `chmod go-w` fixes the warning.

## A starting rc file

```sh
export EDITOR=nvim
export PATH="$HOME/.local/bin:$PATH"

alias ll='ls -la'
alias gs='git status'
abbr gco 'git checkout'

mkcd() { mkdir -p "$1" && cd "$1"; }

set -o vi
shopt -s globstar
```

## Plugins

A plugin is a directory with an `init.grfsh` file:

```
~/.config/grfsh/plugins/
  aliases/init.grfsh
  kube/init.grfsh
```

Plugins are plain grfsh scripts. Put functions, aliases, completions and hooks in them, and share them as git repositories that people clone into the plugins directory.

## Environment variables

| Variable | Effect |
| --- | --- |
| `GRFSH_PROMPT` | template for the default prompt when there is no theme file |
| `GRFSH_THEME` | preset to use when there is no theme file |
| `GRFSH_AGENT` | `1` turns on agent mode, see [Using grfsh from agents](/docs/agents/) |
| `GRFSH_OUTPUT_LINES` | output limit in agent mode, `0` for no limit |
| `NO_COLOR` | any non empty value turns colors off |
| `COLORTERM` | `truecolor` or `24bit` enables 24 bit colors in themes |
| `CDPATH` | directories `cd` searches for relative names |

## Files grfsh writes

| File | Contents |
| --- | --- |
| `~/.grfsh_history` | line editor history, mode 0600 |
| `~/.grfsh_dirs` | directory visit counts for `z`, mode 0600 |
| `~/.local/share/grfsh/commands.tsv` | command log behind `history --table`, mode 0600 |
| `~/.config/grfsh/.welcome-shown` | marks that the first run hint was shown |
