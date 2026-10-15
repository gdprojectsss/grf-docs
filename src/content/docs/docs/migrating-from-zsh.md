---
title: "Migrating from zsh and oh-my-zsh"
description: "Replace oh-my-zsh, powerlevel10k and common zsh plugins with grfsh built ins."
---

grfsh covers what most people use oh-my-zsh and its popular plugins for, without plugins or a framework.

## Plugin equivalents

| zsh setup | grfsh |
| --- | --- |
| zsh-autosuggestions | built in |
| zsh-syntax-highlighting, fast-syntax-highlighting | built in |
| powerlevel10k, spaceship, pure | `configure-prompt` with the `rainbow`, `classic`, `lean` or `pure` presets |
| p10k transient prompt | `transient = true` in the theme |
| z, zoxide, autojump | `z` built in |
| git plugin aliases | `abbr`, see below |
| zsh-abbr | `abbr` built in |
| starship | `engine = starship` in the theme |
| command-not-found | "did you mean" suggestions built in |

Run `configure-prompt` and pick the style closest to your theme. Like p10k, the wizard previews each choice live.

## Moving your config

| zsh | grfsh |
| --- | --- |
| `~/.zshrc` | `~/.grfshrc` |
| `~/.zprofile`, `~/.zlogin` | `~/.grfsh_profile` |
| `~/.zsh_history` | `~/.grfsh_history` |
| `$ZSH_CUSTOM/plugins/name` | `~/.config/grfsh/plugins/name/init.grfsh` |

Aliases and exports copy over as they are. For the oh-my-zsh git aliases, abbreviations are nicer since the history keeps the full command:

```sh
abbr g git
abbr gst 'git status'
abbr gco 'git checkout'
abbr gcm 'git checkout main'
abbr gp 'git push'
abbr gl 'git pull'
abbr gd 'git diff'
abbr glog 'git log --oneline --graph --decorate'
```

## Hooks and keys

| zsh | grfsh |
| --- | --- |
| `precmd`, `preexec`, `chpwd` functions | same names |
| `add-zsh-hook precmd fn` | `precmd_functions+=(fn)` |
| `bindkey '^R' history-incremental-search-backward` | `bindkey '^R' reverse-search-history`, `bindkey -l` lists actions |
| `bindkey -v` | `set -o vi` |
| `setopt AUTO_CD` | always on |
| `setopt globstar` style `**` | `shopt -s globstar` |

## Differences to know about

- grfsh syntax follows bash, so zsh only features such as glob qualifiers (`*(.)`), `${(s/:/)var}` flags and 1-based arrays do not exist. Arrays are 0-based as in bash.
- `setopt` and `autoload` do not exist. Run `grfsh --check ~/.zshrc` to see each line that needs attention.
- zsh themes are not loaded. grfsh draws its own prompt from a theme file, see [Prompt themes](/docs/themes/).
