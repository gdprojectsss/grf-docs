---
title: "安装"
description: "通过安装脚本、软件包管理器、预编译二进制文件或 cargo 安装 grfsh。"
---

## 安装脚本

在 Linux 和 macOS 上运行：

```sh
curl -fsSL https://grf.sh | sh
```

脚本会下载适合你系统的最新版本，校验其 SHA-256 校验和，并把 `grfsh` 安装到 `~/.local/bin`。设置 `GRFSH_INSTALL_DIR` 可以安装到其他目录，设置 `GRFSH_VERSION` 可以指定版本，例如 `GRFSH_VERSION=v1.0.0`。

你也可以先阅读脚本再运行：

```sh
curl -fsSL https://grf.sh/install -o install.sh
less install.sh
sh install.sh
```

## 预编译二进制文件

每个[发布版本](https://github.com/gdprojectsss/goRustlyFast/releases)都为下列目标平台提供压缩包。`https://grf.sh/download/latest/TARGET` 始终指向最新版本，例如：

```sh
curl -fsSL -o grfsh.tar.gz https://grf.sh/download/latest/aarch64-apple-darwin
```

| 目标平台 | 说明 |
| --- | --- |
| `x86_64-unknown-linux-musl` | 静态链接，可在任何 x86_64 Linux 上运行 |
| `x86_64-unknown-linux-gnu` | glibc |
| `aarch64-unknown-linux-gnu` | glibc，适用于 ARM 服务器和树莓派 4 及更新型号 |
| `x86_64-apple-darwin` | Intel 芯片的 Mac |
| `aarch64-apple-darwin` | Apple 芯片的 Mac |

每个压缩包都包含二进制文件、man 手册页、README 和许可证。

### 校验下载文件

`SHA256SUMS`（也可通过 `https://grf.sh/download/latest/SHA256SUMS` 获取）列出了发布版本中每个文件的校验和，并由发布流程使用 [cosign](https://docs.sigstore.dev/) 无密钥签名：

```sh
cosign verify-blob SHA256SUMS \
  --bundle SHA256SUMS.sigstore.json \
  --certificate-identity-regexp 'https://github.com/gdprojectsss/goRustlyFast/.github/workflows/release.yml@.*' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
sha256sum --check --ignore-missing SHA256SUMS
```

## 软件包

| 系统 | 命令 |
| --- | --- |
| Debian、Ubuntu | 从发布页面下载 `.deb`，然后运行 `sudo apt install ./grfsh_*.deb` |
| Fedora、RHEL、openSUSE | 从发布页面下载 `.rpm`，然后运行 `sudo dnf install ./grfsh-*.rpm` |
| Arch Linux | `yay -S grfsh-git`，或用 `makepkg -si` 构建 `packaging/aur/PKGBUILD` |
| Nix | `nix run github:gdprojectsss/goRustlyFast` 或 `nix profile install github:gdprojectsss/goRustlyFast` |
| Homebrew | `brew install --HEAD gdprojectsss/tap/grfsh` |

`.deb`、`.rpm` 和 AUR 软件包会一并安装 man 手册页，之后即可使用 `man grfsh`。

## 从源码安装

需要 Rust 1.88 或更新版本。

```sh
cargo install grfsh
```

或者从克隆的仓库构建：

```sh
git clone https://github.com/gdprojectsss/goRustlyFast
cd goRustlyFast
cargo build --release
./target/release/grfsh
```

## 检查安装

```sh
grfsh --version
grfsh -c 'echo $((6 * 7))'
```

想把 grfsh 设为登录 shell，请参阅[将 grfsh 设为你的 shell](/zh-cn/docs/login-shell/)。
