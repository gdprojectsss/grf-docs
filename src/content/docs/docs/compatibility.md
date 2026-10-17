---
title: "Compatibility with bash"
description: "Which bash features grfsh supports, and the alternatives for the rest."
---

grfsh implements the bash features that real scripts use most. A compatibility suite runs 40 scripts through bash 5.3 and grfsh on every change and compares their output byte for byte, and installers for rustup, nvm, Homebrew, Docker and oh-my-zsh are checked with `grfsh --check` in CI.

## Supported

- Simple commands, pipelines, `&&`, `||`, `!`, `;`, `&`, subshells and groups
- `if`, `while`, `until`, `for`, C style `for (( ))`, `case` with `;;`, `;&` and `;;&`, functions
- `[[ ]]` with `==`, `!=`, `=~` and `BASH_REMATCH`, `<`, `>`, `-eq` and the file tests, `[` and `test`
- Parameter expansion: defaults, alternatives, errors, assignment, length, substrings, prefix and suffix removal, replacement, case changes, `${!name}`, `${!prefix*}`, `${!array[@]}` and the `@Q`, `@E`, `@U`, `@u`, `@L` and `@a` transforms
- Arithmetic: `$(( ))`, `(( ))`, all C operators, `**`, `base#digits`, hex and octal literals
- Indexed arrays (sparse, negative indexes, slices) and associative arrays
- Brace expansion with lists, ranges, padding and steps, tilde expansion
- Command substitution, process substitution, here documents, here strings
- Globs with `*`, `?`, `[...]`, character classes, `**` with globstar, nullglob, dotglob and nocaseglob
- Redirections on any file descriptor, including `2>&1`, `&>`, `>&-` and `exec 3>file`
- `set -e`, `-u`, `-x`, `-o pipefail`, `trap` for signals, `EXIT` and `ERR`
- `getopts`, `read` with its common flags, `printf` with `-v`, `mapfile`, `declare` and friends
- `$PIPESTATUS`, `$LINENO`, `$SECONDS`, `$RANDOM`, `$PPID`, `$BASH_REMATCH`, `$FUNCNAME`, `$BASH_SOURCE`
- Job control: `&`, `jobs`, `fg`, `bg`, `wait`, `kill %n`, Ctrl-Z

## Not supported

`grfsh --check` reports each of these with its line number.

| Feature | Alternative |
| --- | --- |
| `shopt -s extglob` patterns such as `!(x)` and `@(a\|b)` | `case` patterns, or `files \| where name =~ ...` |
| `declare -n` and `local -n` name references | `${!name}`, `printf -v "$name"` |
| `coproc` | process substitution or named pipes |
| `select` menus | `read -p` with `case` |
| `let` | `(( ))` |
| `trap ... DEBUG` | none |
| `caller`, `enable`, `hash`, `fc`, `bind`, `compgen`, `suspend`, `disown` | see `grfsh --check` hints |
| `$BASH_VERSINFO`, `$BASH_LINENO` | none yet |

## POSIX sh

grfsh is not a POSIX shell. It runs POSIX scripts that stay within the features above, which covers most of them, but it is not tested for strict POSIX conformance. Keep `/bin/sh` as it is.
