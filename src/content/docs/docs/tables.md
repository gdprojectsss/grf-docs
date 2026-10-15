---
title: "Table pipelines"
description: "Typed table pipelines: sources, filters, values and output formats."
---

Some commands in grfsh produce tables with typed columns. Table commands pass rows to each other in a compact typed format and print text when the next command is anything else, so you can mix them freely with `grep`, `awk` and friends.

```sh
$ load servers.csv | where cpu -gt 50 | sort-by cpu -r
host   region  cpu  uptime_days
db-1   us       91          203
web-1  eu       72           41

$ load servers.csv | group-by region
region  count
eu          2
us          2

$ load servers.csv | math avg cpu
47

$ load servers.csv | where region == eu | to json
[{"host":"web-1","region":"eu","cpu":72,"uptime_days":41},{"host":"web-2","region":"eu","cpu":18,"uptime_days":41}]
```

## Sources

| Command | Columns |
| --- | --- |
| `files [path...] [-a] [-r]` | name, type, size, modified |
| `procs` | pid, ppid, cpu, mem, rss, name |
| `search [-i] [-F] [-H] [-l] [-g glob] pattern [path...]` | path, line, text |
| `git-status [--ignored] [path...]` | path, state, staged, unstaged, from |
| `ports` | protocol, address, port, pid, process |
| `load file` | read from `.csv`, `.tsv`, `.json` and `.jsonl` files, anything else as lines |
| `from csv\|tsv\|json\|jsonl\|ws\|lines` | parsed from text on standard input |
| `history --table` | when, duration, status, directory, command |

`from ws` splits on whitespace and treats the first line as the header, which suits `ps`, `df`, `docker ps` and similar tools. When a table command receives text that is not a table, it guesses: JSON if it looks like JSON, whitespace separated columns otherwise.

```sh
ps aux | where %CPU gt 5 | select PID %CPU COMMAND
docker ps | select NAMES STATUS
curl -s https://api.github.com/repos/gdprojectsss/goRustlyFast/releases | select tag_name published_at
```

## Filters and reshaping

| Command | What it does |
| --- | --- |
| `where column op value [and\|or ...]` | keep matching rows |
| `sort-by column... [-r]` | sort by one or more columns |
| `select column...`, `reject column...` | keep or drop columns |
| `first [n]`, `skip [n]`, `reverse` | slice rows |
| `uniq-by column` | keep the first row for each value |
| `update column value` | set or add a column |

`where` operators are `==`, `!=`, `=~` (regular expression), `!~`, `eq`, `ne`, `lt`, `le`, `gt` and `ge`, plus the `-eq` style spellings from `test`. Write `-gt` or quote the condition, since `<` and `>` are redirections in every shell:

```sh
files -r | where size -gt 10mb
files | where 'modified > 2d'
procs | where name =~ ^post and cpu gt 1
```

## Values

Each cell has a type: text, integer, float, size, date, boolean or empty. Comparisons follow the column type:

- Sizes accept units: `10mb`, `1.5 GB`, `512k`.
- Dates accept ages such as `2d`, `3h` or `90m`, and calendar dates such as `2026-01-31`.
- Numbers compare as numbers, so `10` is greater than `9`.

## Aggregates and output

| Command | Output |
| --- | --- |
| `count` | the number of rows |
| `get column` | one column as plain lines, ready for `xargs` |
| `group-by column` | a count per value |
| `math sum\|avg\|min\|max\|median column` | one number, sizes stay sizes |
| `to csv\|tsv\|json\|md\|html\|table` | the table as text in that format |

```sh
files src -r | where name =~ '\.rs$' | math sum size
search TODO src | group-by path
git-status | where state == modified | get path | xargs git add
```

## Search results feed replace

`replace` understands the `path` and `line` columns from `search`, so the two combine into a project wide rename that only touches the lines you looked at:

```sh
search 'old_name\(' src | replace -n old_name new_name   # preview
search 'old_name\(' src | replace old_name new_name
search -l old_name . | replace old_name new_name          # every occurrence in each file
```

## Name clashes

If a table command shadows a program you want, run the program with `command`, for example `command ports`.
