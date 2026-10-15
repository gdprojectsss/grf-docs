---
title: "Using grfsh from agents and scripts"
description: "Agent mode, JSON results, the session server, timeout, explain, replace and search."
---

Coding agents, CI jobs and editor integrations drive a shell differently from a person at a terminal. Nobody is there to quit a pager or answer a prompt, every line of output costs context, and a command that hangs blocks everything. grfsh has a mode for this.

## Agent mode

```sh
grfsh --agent -c 'git log -3; npm test'
GRFSH_AGENT=1 grfsh -c '...'
```

In agent mode:

- `PAGER`, `GIT_PAGER` and `MANPAGER` are `cat`, `GIT_TERMINAL_PROMPT=0`, `GIT_EDITOR=true`, `DEBIAN_FRONTEND=noninteractive` and `PIP_NO_INPUT=1`, so tools do not stop to ask.
- `NO_COLOR=1` and `CLICOLOR=0`, so the output carries no escape codes.
- Standard input is `/dev/null` when it would otherwise be the terminal.
- Every command runs in a new session without a controlling terminal. Programs that try to read a password from `/dev/tty`, such as `sudo` or `ssh`, fail right away with an error instead of waiting forever.
- Background jobs write to a log file whose path is printed, so they never hold the caller's output open.
- Nested shells inherit `GRFSH_AGENT=1`.

## Output budget

In agent mode, output longer than `GRFSH_OUTPUT_LINES` lines (400 by default) keeps its first and last halves:

```
line 1
...
line 200
[grfsh: 3121 lines omitted]
line 3322
...
[grfsh: full output saved to /tmp/grfsh-output-501/1792221036692-83340-output.log]
```

The full output stays in a private file you can `search` or `tail` later. Single lines longer than 2000 characters are shortened too. Set `GRFSH_OUTPUT_LINES=0` to turn the limit off.

## JSON results

```sh
$ grfsh --json -c 'cd /tmp; export MODE=test; echo out; echo err >&2; exit 3'
{"status":3,"stdout":"out\n","stderr":"err\n","duration_ms":4,"cwd":"/tmp","env":{"MODE":"test"},"truncated":false,"stdout_log":null,"stderr_log":null}
```

One object per run, with standard output and error kept apart, the exit status, the time taken, the final directory and every environment variable that changed. `--json` implies `--agent`.

## A persistent session

```sh
grfsh --serve ~/.grfsh.sock &
grfsh --client ~/.grfsh.sock 'cd ~/project; source .env'
grfsh --client ~/.grfsh.sock 'make test'
grfsh --client ~/.grfsh.sock -t 60 'cargo build'
```

`--serve` keeps one agent mode shell behind a Unix socket that only you can open. Directory, variables, functions and aliases carry over from request to request. Each line sent to the socket is a request, either a plain command or JSON:

```json
{"command": "npm test", "timeout": 120, "id": 7}
```

and each reply is one JSON line with the fields above plus `id`, `timed_out` and `exited`. A request that passes its timeout has its running commands stopped, first with SIGTERM and two seconds later with SIGKILL, and builtin loops are interrupted. It reports status 124. Running `exit` stops the server and removes the socket. Every request goes into the command log, so `history --table` doubles as an audit trail.

## Time limits

```sh
timeout 30 npm test
timeout -k 5 2m ./slow-script.sh
timeout 10 my_function arg
```

The `timeout` builtin works like GNU timeout and also exists on macOS, where the system has none. It runs the command in its own process group and signals the whole group, so children the command started stop too. It works with functions and builtins as well as programs.

## Looking before running

```sh
$ grfsh --explain 'dir=; rm -rf "$dir"/*'
   1  sets dir=''
   1  rm -rf /Applications /Library /System /Users /Volumes /bin /cores /dev /etc /home /opt /private /sbin /tmp /usr /var
        pattern ${dir}/* matches 16 paths
        warning: $dir is empty or unset here
        deletes recursively: /Applications /Library /System /Users /Volumes /bin /cores /dev /etc /home and 6 more
        warning: this deletes 16 top level paths, starting with /Applications
        runs /bin/rm
```

`--explain` and the `explain` builtin print each command after expansion, with globs resolved, without running anything. Command substitutions are shown unexpanded. Assignments and `cd` are applied so later lines expand correctly. Notes point out deletions, `git reset --hard`, force pushes, overwritten files and names that are not commands. Inside a session, `explain` sees your current variables.

## Editing files

```sh
replace src/main.rs 'let retries = 3;' 'let retries = 5;'
replace --all README.md grfsh-old grfsh
printf 'line one\nline two\n' | write-file -p notes/today.txt
```

`replace` fails unless the text appears exactly once, and the error names the lines when it is missing or repeated. For multi-line edits, pass the file alone and send blocks on standard input:

```sh
replace src/config.rs <<'EOF'
<<<<<<< old
fn timeout() -> u64 {
    30
}
=======
fn timeout() -> u64 {
    std::env::var("TIMEOUT").ok().and_then(|value| value.parse().ok()).unwrap_or(30)
}
>>>>>>> new
EOF
```

All blocks apply or none do. `-n` prints the change without writing. Both builtins write to a temporary file and rename it into place, keeping the file mode, so a reader never sees half a file. They behave the same on Linux and macOS, unlike `sed -i`.

## Searching and status as data

```sh
search 'fn main' src
search -l TODO . | replace TODO DONE
git-status | where state == modified | get path
ports | where port == 3000
```

`search` skips `.git`, hidden files, binary files and everything in `.gitignore`. When its output goes to a program or file, it prints `path:line:text` like grep, and inside table pipelines it produces columns. See [Table pipelines](/docs/tables/).
