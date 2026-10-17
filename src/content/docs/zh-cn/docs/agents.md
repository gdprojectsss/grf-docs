---
title: "在代理和脚本中使用 grfsh"
description: "代理模式、JSON 结果、会话服务器、timeout、explain、replace 和 search。"
---

可以让代理直接读取 [grf.sh/llms.txt](/llms.txt)，那里有本页内容的精简版（英文），格式遵循 [llms.txt](https://llmstxt.org)。

编程代理、CI 任务和编辑器集成使用 shell 的方式和坐在终端前的人不同：没有人去退出分页器或回答提示，每一行输出都会占用上下文，一个卡住的命令会阻塞一切。grfsh 为此提供了专门的模式。

## 代理模式

```sh
grfsh --agent -c 'git log -3; npm test'
GRFSH_AGENT=1 grfsh -c '...'
```

在代理模式下：

- `PAGER`、`GIT_PAGER` 和 `MANPAGER` 被设为 `cat`，同时设置 `GIT_TERMINAL_PROMPT=0`、`GIT_EDITOR=true`、`DEBIAN_FRONTEND=noninteractive` 和 `PIP_NO_INPUT=1`，工具不会停下来询问。
- 设置 `NO_COLOR=1` 和 `CLICOLOR=0`，输出中不含转义序列。
- 如果标准输入原本是终端，会改为 `/dev/null`。
- 每个命令都在没有控制终端的新会话中运行。试图从 `/dev/tty` 读取密码的程序（例如 `sudo` 或 `ssh`）会立即报错退出，而不是一直等待。
- 后台作业的输出写入日志文件，并打印文件路径，因此它们不会占用调用方的输出管道。
- 嵌套的 shell 会继承 `GRFSH_AGENT=1`。

## 输出预算

在代理模式下，超过 `GRFSH_OUTPUT_LINES` 行（默认 400 行）的输出只保留开头和结尾各一半：

```
line 1
...
line 200
[grfsh: 3121 lines omitted]
line 3322
...
[grfsh: full output saved to /tmp/grfsh-output-501/1792221036692-83340-output.log]
```

完整输出保存在一个只有你能读取的文件中，之后可以用 `search` 或 `tail` 查看。超过 2000 个字符的单行也会被截短。设置 `GRFSH_OUTPUT_LINES=0` 可关闭限制。

## JSON 结果

```sh
$ grfsh --json -c 'cd /tmp; export MODE=test; echo out; echo err >&2; exit 3'
{"status":3,"stdout":"out\n","stderr":"err\n","duration_ms":4,"cwd":"/tmp","env":{"MODE":"test"},"truncated":false,"stdout_log":null,"stderr_log":null}
```

每次运行输出一个对象，其中标准输出和标准错误分开保存，并包含退出状态、耗时、最终所在目录以及所有发生变化的环境变量。`--json` 隐含 `--agent`。

## 持久会话

```sh
grfsh --serve ~/.grfsh.sock &
grfsh --client ~/.grfsh.sock 'cd ~/project; source .env'
grfsh --client ~/.grfsh.sock 'make test'
grfsh --client ~/.grfsh.sock -t 60 'cargo build'
```

`--serve` 在一个只有你能打开的 Unix 套接字后面运行一个代理模式的 shell。当前目录、变量、函数和别名会在请求之间保留。发送到套接字的每一行都是一个请求，可以是普通命令，也可以是 JSON：

```json
{"command": "npm test", "timeout": 120, "id": 7}
```

每个回复是一行 JSON，字段与上文相同，另加 `id`、`timed_out` 和 `exited`。请求超时后，正在运行的命令会先收到 SIGTERM，两秒后收到 SIGKILL，内置命令的循环也会被中断，并返回状态 124。运行 `exit` 会停止服务器并删除套接字。每个请求都会写入命令日志，因此 `history --table` 也可以当作审计记录。

## 时间限制

```sh
timeout 30 npm test
timeout -k 5 2m ./slow-script.sh
timeout 10 my_function arg
```

内置的 `timeout` 用法与 GNU timeout 相同，在系统自带不了它的 macOS 上同样可用。它在独立的进程组中运行命令，并向整个进程组发送信号，因此命令启动的子进程也会一起停止。除了外部程序，它也适用于函数和内置命令。

## 运行前先查看

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

`--explain` 和内置命令 `explain` 会打印每条命令展开后的样子，包括 glob 匹配到的路径，但不执行任何内容。命令替换保持原样不展开。赋值和 `cd` 会被应用，因此后面的行能按实际情况展开。提示信息会指出删除操作、`git reset --hard`、强制推送、被覆盖的文件以及并非命令的名称。在会话中，`explain` 能看到你当前的变量。

## 编辑文件

```sh
replace src/main.rs 'let retries = 3;' 'let retries = 5;'
replace --all README.md grfsh-old grfsh
printf 'line one\nline two\n' | write-file -p notes/today.txt
```

除非要替换的文本恰好出现一次，否则 `replace` 会失败；文本缺失或重复时，错误信息会指出相关的行号。多行编辑时只传入文件名，并通过标准输入发送替换块：

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

所有替换块要么全部生效，要么全部不生效。`-n` 只打印改动而不写入文件。两个内置命令都先写入临时文件再重命名到目标位置，并保留文件权限，读取方永远不会看到写了一半的文件。与 `sed -i` 不同，它们在 Linux 和 macOS 上的行为完全一致。

## 把搜索和状态当作数据

```sh
search 'fn main' src
search -l TODO . | replace TODO DONE
git-status | where state == modified | get path
ports | where port == 3000
```

`search` 会跳过 `.git`、隐藏文件、二进制文件以及 `.gitignore` 中的所有内容。当输出交给其他程序或写入文件时，它会像 grep 一样打印 `path:line:text`；在表格管道中则输出列。参见[表格管道](/zh-cn/docs/tables/)。
