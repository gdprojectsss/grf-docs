---
title: "Scripting"
description: "The bash syntax grfsh runs, with examples."
---

grfsh runs scripts written for bash as long as they stay within the features listed here. Run `grfsh --check script.sh` to find anything it cannot run before you try.

```sh
grfsh script.sh arg1 arg2
grfsh -c 'echo "$1 and $2"' name first second
```

## Commands and pipelines

```sh
make && echo built || echo failed
ls | grep -c rs
! grep -q TODO notes.txt && echo clean
{ echo one; echo two; } > both.txt
( cd /tmp && pwd )
time make
```

`$?` holds the last status and `PIPESTATUS` holds the status of every stage of the last pipeline. `set -o pipefail` makes a pipeline fail when any stage fails.

## Variables and parameters

```sh
name=grfsh
echo "${name}" "${#name}" "${name:1:3}"
echo "${missing:-default}" "${missing:=assigned}" "${name:+set}"
echo "${path#*/}" "${path##*/}" "${file%.txt}" "${file%%.*}"
echo "${text/old/new}" "${text//old/new}" "${text/#start/x}" "${text/%end/x}"
echo "${name^}" "${name^^}" "${NAME,,}"
echo "${text@Q}" "${text@U}" "${escaped@E}"
ref=name; echo "${!ref}"
echo "${!PREFIX_*}"
```

Positional parameters work as in bash: `$1`, `${10}`, `$#`, `"$@"`, `"$*"`, `shift`, `set -- a b c` and slices such as `${@:2}` and `${@:2:3}`. Special variables include `$$`, `$!`, `$0`, `$-`, `$LINENO`, `$SECONDS`, `$RANDOM`, `$PPID`, `$PWD`, `$OLDPWD` and `$IFS`.

## Arrays

```sh
fruits=(apple banana cherry)
fruits+=(date)
echo "${fruits[1]}" "${fruits[-1]}" "${#fruits[@]}" "${!fruits[@]}"
echo "${fruits[@]:1:2}"
unset 'fruits[0]'

declare -A ages=([ana]=31 [bo]=27)
ages[cy]=45
for name in "${!ages[@]}"; do echo "$name ${ages[$name]}"; done

mapfile -t lines < file.txt
read -ra words <<< "a b c"
```

Indexed arrays are sparse, like bash.

## Arithmetic

```sh
echo $((2 ** 10)) $((17 % 5)) $((x > 3 ? 1 : 0)) $((0xff)) $((2#1010))
(( count++ ))
(( total += size ))
for (( i = 0; i < 3; i++ )); do echo "$i"; done
declare -i n=5; n+=3
```

## Conditionals

```sh
if [[ $file == *.rs && -f $file ]]; then echo rust; fi
[[ $version =~ ^([0-9]+)\.([0-9]+) ]] && echo "major ${BASH_REMATCH[1]}"
[ -d "$dir" ] || mkdir -p "$dir"
test "$a" -lt "$b"

case $answer in
    y|yes) echo yes ;;
    n*) echo no ;;
    *) echo unknown ;;
esac
```

## Loops and functions

```sh
for file in *.txt; do wc -l "$file"; done
while read -r line; do echo "$line"; done < input.txt
until ping -c1 host >/dev/null; do sleep 1; done

greet() {
    local who=${1:-world}
    echo "hi $who"
    return 0
}
greet there
```

Function names may contain `-`, `.`, `:`, `+` and `@`, so names such as `nvm_ls-remote` work.

## Expansion

```sh
echo {a,b}{1..2} {01..10} {a..z..5}
echo ~ ~/src ~root
shopt -s globstar nullglob dotglob nocaseglob
echo src/**/*.rs
echo $(date +%Y) `whoami`
diff <(sort a.txt) <(sort b.txt)
tee >(gzip > out.gz) < input > /dev/null
```

Words are split on `IFS` after expansion. Double quotes prevent splitting and globbing, as in bash.

## Redirections and here documents

```sh
cmd > out.txt 2> err.txt
cmd >> log.txt 2>&1
cmd &> all.txt
cmd 2>/dev/null
exec 3> trace.log; echo hi >&3; exec 3>&-
cat <<EOF
Hello $USER
EOF
cat <<-'EOF'
	no $expansion, leading tabs removed
	EOF
grep x <<< "here string"
```

## Options and traps

```sh
set -euo pipefail
set -x
trap 'rm -f "$tmp"' EXIT
trap 'echo interrupted; exit 130' INT
trap 'echo "failed at line $LINENO"' ERR
```

## Builtins worth knowing

| Builtin | Notes |
| --- | --- |
| `printf` | `%s %d %i %f %e %g %x %o %c %b %q %%`, widths, precision, `-v var` |
| `read` | `-r -a -n -t -s -d -p` |
| `getopts` | standard option parsing with `OPTARG` and `OPTIND` |
| `declare`, `typeset`, `local` | `-a -A -i -l -u -r -x -p` |
| `mapfile`, `readarray` | `-t -n -s` |
| `type`, `command -v` | find out what a name resolves to |
| `ulimit`, `umask` | resource limits and file mode mask |

Run `help` inside grfsh for the full list and `help name` for one builtin.

## What is missing

See [Compatibility with bash](/docs/compatibility/) for the full list. The most common gaps are extended globs (`shopt -s extglob`), name references (`declare -n`), coprocesses, `select` and `let`. `grfsh --check` reports each of them with its line number.
