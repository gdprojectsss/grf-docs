---
title: "从 zsh 和 oh-my-zsh 迁移"
description: "用 grfsh 的内置功能替代 oh-my-zsh、powerlevel10k 和常用的 zsh 插件。"
---

大多数人使用 oh-my-zsh 及其热门插件所追求的功能，grfsh 都已内置，无需插件或框架。

## 插件对照

| zsh 配置 | grfsh |
| --- | --- |
| zsh-autosuggestions | 内置 |
| zsh-syntax-highlighting、fast-syntax-highlighting | 内置 |
| powerlevel10k、spaceship、pure | `configure-prompt`，配合 `rainbow`、`classic`、`lean` 或 `pure` 预设 |
| p10k 的瞬态提示符 | 在主题中设置 `transient = true` |
| z、zoxide、autojump | 内置 `z` |
| git 插件的别名 | `abbr`，见下文 |
| zsh-abbr | 内置 `abbr` |
| starship | 在主题中设置 `engine = starship` |
| command-not-found | 内置“你是不是想输入”提示 |

运行 `configure-prompt`，选择最接近你当前主题的风格。和 p10k 一样，向导会实时预览每个选项。

## 迁移配置

| zsh | grfsh |
| --- | --- |
| `~/.zshrc` | `~/.grfshrc` |
| `~/.zprofile`、`~/.zlogin` | `~/.grfsh_profile` |
| `~/.zsh_history` | `~/.grfsh_history` |
| `$ZSH_CUSTOM/plugins/name` | `~/.config/grfsh/plugins/name/init.grfsh` |

别名和 export 可以原样复制。对于 oh-my-zsh 的 git 别名，使用缩写更合适，因为历史记录里会保存完整的命令：

```sh
abbr g git
abbr gst 'git status'
abbr gco 'git checkout'
abbr gcm 'git checkout main'
abbr gp 'git push'
abbr gl 'git pull'
abbr gd 'git diff'
abbr glog 'git log --oneline --graph --decorate'
```

## 钩子和按键

| zsh | grfsh |
| --- | --- |
| `precmd`、`preexec`、`chpwd` 函数 | 同名函数 |
| `add-zsh-hook precmd fn` | `precmd_functions+=(fn)` |
| `bindkey '^R' history-incremental-search-backward` | `bindkey '^R' reverse-search-history`，`bindkey -l` 列出所有动作 |
| `bindkey -v` | `set -o vi` |
| `setopt AUTO_CD` | 始终开启 |
| `setopt globstar` 风格的 `**` | `shopt -s globstar` |

## 需要注意的差异

- grfsh 的语法遵循 bash，因此 zsh 独有的特性并不存在，例如 glob 限定符（`*(.)`）、`${(s/:/)var}` 这类参数标志，以及从 1 开始的数组下标。和 bash 一样，数组从 0 开始。
- 没有 `setopt` 和 `autoload`。运行 `grfsh --check ~/.zshrc` 可以看到每一行需要处理的地方。
- 不会加载 zsh 主题。grfsh 根据主题文件自行绘制提示符，详见[提示符主题](/zh-cn/docs/themes/)。
