---
title: "Migrating from bash"
description: "Move your bash setup and scripts to grfsh."
---

Most of your bash knowledge carries over unchanged. This page covers what to move and what differs.

## Check your scripts first

```sh
grfsh --check ~/.bashrc ~/bin/*.sh
```

`--check` parses each script without running it and lists syntax errors, bash features grfsh does not support, and commands it cannot find, with line numbers. A clean result means the script only uses features grfsh implements.

Scripts with `#!/bin/bash` keep running under bash whatever your login shell is, so you only need to port what you want grfsh itself to run.

## Moving your rc file

| bash | grfsh |
| --- | --- |
| `~/.bashrc` | `~/.grfshrc` or `~/.config/grfsh/grfshrc` |
| `~/.bash_profile`, `~/.profile` | `~/.grfsh_profile` or `~/.config/grfsh/profile` |
| `~/.bash_history` | `~/.grfsh_history` |

Usually the quickest start is to copy the parts you care about:

```sh
grep -E '^(export|alias) ' ~/.bashrc >> ~/.grfshrc
```

then move functions over one by one and run `grfsh --check ~/.grfshrc`.

## What changes

| bash | grfsh |
| --- | --- |
| `PS1='\u@\h:\w\$ '` | `configure-prompt`, or `GRFSH_PROMPT='{user}@{host}:{cwd}$ '` |
| `PROMPT_COMMAND=fn` | `precmd() { fn; }` |
| `bind '"\C-g": ...'` | `bindkey '^G' action` or `bindkey -s '^G' 'text\n'` |
| `complete -F _func cmd` | `complete -C 'command that prints words' cmd`, `complete -W 'a b c' cmd` |
| `let x=x+1` | `(( x++ ))` or `x=$((x + 1))` |
| `shopt -s extglob` with `!(*.txt)` | `files \| where name !~ '\.txt$' \| get name`, or a loop with `case` |
| `declare -n ref=name` | `${!name}` for reading, `printf -v "$name"` for writing |
| `select choice in a b c` | `read -p` with a `case` |
| `history -c` | `history -c` |
| `fc` | `!!`, `!n` and `history` |

## Things grfsh adds

- Autosuggestions, highlighting and completion without bash-completion or ble.sh.
- `z` for frecent directories and auto cd.
- Typed tables: `files`, `procs`, `search`, `git-status`, `load`, `where`, `sort-by`, `to json`.
- `timeout` on macOS, `replace`, `write-file`, `explain` and agent mode.

## Bash features grfsh does not have

See [Compatibility with bash](/docs/compatibility/) for the full list.
