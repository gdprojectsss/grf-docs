---
title: "从 bash 迁移"
description: "把你的 bash 配置和脚本迁移到 grfsh。"
---

你掌握的大部分 bash 知识都可以直接沿用。本页说明需要迁移什么，以及有哪些不同。

## 先检查你的脚本

```sh
grfsh --check ~/.bashrc ~/bin/*.sh
```

`--check` 只解析脚本而不执行，并按行号列出语法错误、grfsh 不支持的 bash 特性以及找不到的命令。检查结果干净，说明脚本只用到了 grfsh 已实现的功能。

无论登录 shell 是什么，带有 `#!/bin/bash` 的脚本仍然由 bash 执行，所以你只需要迁移那些希望由 grfsh 运行的部分。

## 迁移 rc 文件

| bash | grfsh |
| --- | --- |
| `~/.bashrc` | `~/.grfshrc` 或 `~/.config/grfsh/grfshrc` |
| `~/.bash_profile`、`~/.profile` | `~/.grfsh_profile` 或 `~/.config/grfsh/profile` |
| `~/.bash_history` | `~/.grfsh_history` |

最快的起步方式通常是先复制你关心的部分：

```sh
grep -E '^(export|alias) ' ~/.bashrc >> ~/.grfshrc
```

然后逐个迁移函数，并运行 `grfsh --check ~/.grfshrc`。

## 有哪些变化

| bash | grfsh |
| --- | --- |
| `PS1='\u@\h:\w\$ '` | `configure-prompt`，或 `GRFSH_PROMPT='{user}@{host}:{cwd}$ '` |
| `PROMPT_COMMAND=fn` | `precmd() { fn; }` |
| `bind '"\C-g": ...'` | `bindkey '^G' action` 或 `bindkey -s '^G' 'text\n'` |
| `complete -F _func cmd` | `complete -C '输出候选词的命令' cmd`、`complete -W 'a b c' cmd` |
| `let x=x+1` | `(( x++ ))` 或 `x=$((x + 1))` |
| `shopt -s extglob` 配合 `!(*.txt)` | `files \| where name !~ '\.txt$' \| get name`，或用 `case` 写循环 |
| `declare -n ref=name` | 读取用 `${!name}`，写入用 `printf -v "$name"` |
| `select choice in a b c` | `read -p` 配合 `case` |
| `history -c` | `history -c` |
| `fc` | `!!`、`!n` 和 `history` |

## grfsh 额外提供的功能

- 无需 bash-completion 或 ble.sh，就有自动建议、语法高亮和补全。
- 用 `z` 跳转到常用目录，并支持直接输入目录名切换目录。
- 带类型的表格：`files`、`procs`、`search`、`git-status`、`load`、`where`、`sort-by`、`to json`。
- macOS 上也能用的 `timeout`，以及 `replace`、`write-file`、`explain` 和代理模式。

## grfsh 不支持的 bash 特性

完整列表请参阅[与 bash 的兼容性](/zh-cn/docs/compatibility/)。
