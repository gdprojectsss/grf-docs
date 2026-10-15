---
title: "Introduction"
description: "What grfsh is and what it gives you."
---

grfsh is a Unix shell written in Rust. It reads bash style scripts, gives you a comfortable interactive shell without plugins, and adds a set of table commands whose pipelines carry typed rows.

```sh
$ files src -r | where name =~ .rs | sort-by size -r | first 3 | select name size
name        size
shell.rs   14 KB
sys.rs     13 KB
check.rs  8.7 KB
```

What you get:

- **Scripting** with the bash syntax most scripts use: functions, `[[ ]]`, `case`, indexed and associative arrays, parameter expansion operators, arithmetic, brace expansion, here documents, process substitution, `trap` and `set -euo pipefail`.
- **An interactive shell** with autosuggestions, syntax highlighting, context aware completion, a `z` command, abbreviations and themed prompts with right and transient prompts.
- **Job control** with Ctrl-Z, `fg`, `bg`, `jobs` and `wait`.
- **Typed tables** from `files`, `procs`, `load` and `from`, filtered and reshaped with `where`, `sort-by`, `select`, `group-by` and `math`. Any other program in the pipeline receives plain text.
- **A script checker**, `grfsh --check script.sh`, that reports syntax errors and bash features grfsh does not support without running anything.

grfsh depends on two crates, `rustyline` and `libc`, starts in about 2 ms and is a single static binary on Linux.

Continue with [Installation](/docs/installation/), or read [Migrating from bash](/docs/migrating-from-bash/) if you want to know what changes for your existing setup.
