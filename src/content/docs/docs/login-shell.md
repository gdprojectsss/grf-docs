---
title: "Making grfsh your shell"
description: "Register grfsh in /etc/shells and make it your login shell."
---

Try grfsh for a while by running `grfsh` from your current shell. When you are happy with it, make it your login shell.

## 1. Register it in /etc/shells

`chsh` only accepts shells listed in `/etc/shells`. The `.deb`, `.rpm` and AUR packages add grfsh there for you. Otherwise:

```sh
command -v grfsh | sudo tee -a /etc/shells
```

## 2. Change your shell

```sh
chsh -s "$(command -v grfsh)"
```

Log out and back in, or quit your terminal app completely and reopen it. Some terminals, Ghostty among them, read the login shell once when they start. New terminals now start grfsh as a login shell, which reads `~/.config/grfsh/profile` or `~/.grfsh_profile` and then your rc file.

## Terminal apps

Some terminals start their own shell setting instead of your login shell:

- **macOS Terminal**: Settings, General, "Shells open with", then pick "Default login shell".
- **iTerm2**: Profiles, General, Command, then pick "Login Shell".
- **VS Code**: set `terminal.integrated.defaultProfile.linux` or `.osx` to a profile whose `path` is the grfsh binary.
- **tmux**: add `set -g default-shell /path/to/grfsh` to `~/.tmux.conf`.

## Going back

```sh
chsh -s /bin/bash
```

or `/bin/zsh`. If grfsh fails to start for some reason, open a terminal with a different shell from the terminal's own menu and run the command above.

## Keeping scripts on bash

Your login shell does not change how scripts run. A script with `#!/bin/bash` on its first line keeps running under bash. Scripts without a shebang that you run with `grfsh script.sh` use grfsh.
