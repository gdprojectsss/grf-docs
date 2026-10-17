---
title: "简介"
description: "grfsh 是什么，能为你带来什么。"
---

grfsh 是一个用 Rust 编写的 Unix shell。它能运行 bash 风格的脚本，无需任何插件就提供舒适的交互体验，还带有一组表格命令，让管道中传递的是带类型的行。

```sh
$ files src -r | where name =~ .rs | sort-by size -r | first 3 | select name size
name        size
shell.rs   14 KB
sys.rs     13 KB
check.rs  8.7 KB
```

你会得到：

- **脚本能力**：支持大多数脚本常用的 bash 语法，包括函数、`[[ ]]`、`case`、索引数组和关联数组、参数展开运算符、算术运算、花括号展开、here document、进程替换、`trap` 以及 `set -euo pipefail`。
- **交互式 shell**：自动建议、语法高亮、上下文感知的补全、`z` 命令、缩写（abbreviation），以及支持右侧提示符和瞬态提示符的主题。
- **作业控制**：Ctrl-Z、`fg`、`bg`、`jobs` 和 `wait`。
- **带类型的表格**：`files`、`procs`、`search`、`load` 和 `from` 产生表格，再用 `where`、`sort-by`、`select`、`group-by` 和 `math` 过滤和变换。管道中的其他程序收到的仍是纯文本。
- **面向编程代理的模式**：不打开分页器、不等待输入、控制输出长度、以 JSON 返回结果，还有持久会话、`timeout`、`explain` 和精确的文件编辑。
- **脚本检查器**：`grfsh --check script.sh` 会列出语法错误和 grfsh 不支持的 bash 特性，而不会执行任何内容。

grfsh 只依赖两个 crate：`rustyline` 和 `libc`。启动时间约 2 毫秒，在 Linux 上是一个静态二进制文件。

接下来请阅读[安装](/zh-cn/docs/installation/)，如果想先了解现有配置需要做哪些改动，请看[从 bash 迁移](/zh-cn/docs/migrating-from-bash/)。

:::note
中文文档目前覆盖最常用的几页，其余页面暂时显示英文原文。欢迎通过每页底部的“编辑此页”链接帮助翻译。
:::
