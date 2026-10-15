---
title: "Interactive features"
description: "Line editing, autosuggestions, completion, z, history, abbreviations, jobs and hooks."
---

## Line editing

grfsh uses emacs style keys by default. Run `set -o vi` for vi mode.

| Key | Action |
| --- | --- |
| Right arrow or Ctrl-F at the end of the line | accept the autosuggestion |
| Tab | complete |
| Ctrl-R | search history |
| Ctrl-C | cancel the line, or stop the running command |
| Ctrl-Z | stop the running command, then `fg` or `bg` |
| Ctrl-D | exit on an empty line |

`bindkey key action` changes a binding and `bindkey -l` lists the actions. `bindkey -s '^G' 'git status\n'` binds a key to text.

## Autosuggestions and highlighting

As you type, grfsh shows the most recent matching history entry in a dim color. Commands are highlighted green when they exist and red when they do not, and strings, variables, options and operators each get their own color. Set `NO_COLOR=1` to turn all colors off.

## Completion

Tab completes commands, builtins, functions, aliases, paths and variables, and understands a few common tools:

- `git`: subcommands, then branches and tags for `checkout`, `switch`, `merge`, `rebase` and similar commands
- `ssh`, `mosh`, `ping`: hosts from `~/.ssh/config` and `known_hosts`, and `scp`, `rsync`, `sftp` complete `host:`
- `make`: targets from the Makefile
- `cargo`: subcommands, including installed `cargo-*` tools
- `cd`, `z`, `pushd`: directories only
- `fg`, `bg`, `kill`: job numbers after `%`

Add your own with `complete`:

```sh
complete -W 'start stop restart status' svc
complete -C 'kubectl get ns -o name | cut -d/ -f2' kns
complete -d mycd
complete -f myedit
```

## Directory jumping

`z` jumps to the directory you visit most that matches all of its arguments:

```sh
z proj          # ~/work/project
z go fast       # ~/Work/goRustlyFast
z -l proj       # list matches with scores
```

Typing a directory name on its own changes to it. `cd -`, `pushd`, `popd` and `dirs` work as in bash.

## History

History is shared between sessions through `~/.grfsh_history`. `!!`, `!$`, `!n`, `!-n` and `!prefix` expand when you press Enter. `history --table` shows the command log, with times, durations and exit statuses:

```sh
history --table | where status ne 0 | first 10
history --table | where duration gt 5 | sort-by duration -r
```

## Mistyped commands

When a command is not found, grfsh suggests the closest name:

```
$ gti status
grfsh: gti: command not found, did you mean 'git'?
```

## Abbreviations

Abbreviations expand when you press Enter, so your history keeps the full command:

```sh
abbr gco 'git checkout'
abbr gp 'git push'
abbr -e gp          # remove
abbr                # list
```

## Jobs

```sh
sleep 60 &          # [1] 12345
jobs
fg %1
bg
wait
kill %1
```

## Hooks

Functions named `precmd`, `preexec` and `chpwd`, or any function listed in the arrays `precmd_functions`, `preexec_functions` and `chpwd_functions`, run before each prompt, before each command line, and after the directory changes.

```sh
precmd() { printf '\033]0;%s\007' "${PWD##*/}"; }
chpwd() { [[ -f .nvmrc ]] && nvm use; }
```
