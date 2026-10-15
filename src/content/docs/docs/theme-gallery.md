---
title: "Theme gallery"
description: "Every preset prompt theme at a glance."
---

Each preset as it looks in a git repository right after a failed command. Colors are left out here; run `configure-prompt` to see them in your terminal.

## lean

The default. Text only, status and duration on the right.

```
…/Work/goRustlyFast ⎇ main ❯                                          ✘ 1
```

## classic

A dark bar with thin separators, and the time on the right.

```
 …/Work/goRustlyFast │ ⎇ main  ❯                              ✘ 1 │ 09:58:21
```

## rainbow

Colored blocks with powerline arrows. Needs a Nerd Font.

```
 …/Work/goRustlyFast   main  ❯                                ✘ 1   09:58:24
```

## pure

Two lines with the directory, branch and duration above the input line, and a transient prompt.

```
…/Work/goRustlyFast ⎇ main
❯
```

## minimal

The directory on the left, status and branch on the right, and a transient prompt.

```
…/Work/goRustlyFast ❯                                           ✘ 1 ⎇ main
```

## Your own

Start from any preset and override what you like:

```ini
preset = pure
icons = ascii
right = status time
color.dir = #e5c07b
```

Share a theme by sharing the file. It is plain text and has no code in it.
