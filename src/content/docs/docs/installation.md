---
title: "Installation"
description: "Install grfsh with the install script, a package manager, a release binary or cargo."
---

## Install script

On Linux and macOS:

```sh
curl -fsSL https://grf.sh | sh
```

The script downloads the latest release for your system, checks its SHA-256 checksum and installs `grfsh` to `~/.local/bin`. Set `GRFSH_INSTALL_DIR` to install somewhere else and `GRFSH_VERSION` to pick a release, for example `GRFSH_VERSION=v1.0.0`.

You can read the script before running it:

```sh
curl -fsSL https://grf.sh/install -o install.sh
less install.sh
sh install.sh
```

## Release binaries

Every [release](https://github.com/gdprojectsss/goRustlyFast/releases) has tarballs for the targets below. `https://grf.sh/download/latest/TARGET` always points at the newest one, for example:

```sh
curl -fsSL -o grfsh.tar.gz https://grf.sh/download/latest/aarch64-apple-darwin
```

| Target | Notes |
| --- | --- |
| `x86_64-unknown-linux-musl` | static, runs on any x86_64 Linux |
| `x86_64-unknown-linux-gnu` | glibc |
| `aarch64-unknown-linux-gnu` | glibc, ARM servers and Raspberry Pi 4 or newer |
| `x86_64-apple-darwin` | Intel Macs |
| `aarch64-apple-darwin` | Apple silicon |

Each tarball holds the binary, the man page, the README and the license.

### Verifying a download

`SHA256SUMS` (also at `https://grf.sh/download/latest/SHA256SUMS`) lists the checksum of every file in the release and is signed with [cosign](https://docs.sigstore.dev/) keyless signing from the release workflow:

```sh
cosign verify-blob SHA256SUMS \
  --bundle SHA256SUMS.sigstore.json \
  --certificate-identity-regexp 'https://github.com/gdprojectsss/goRustlyFast/.github/workflows/release.yml@.*' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
sha256sum --check --ignore-missing SHA256SUMS
```

## Packages

| System | Command |
| --- | --- |
| Debian, Ubuntu | download the `.deb` from a release, then `sudo apt install ./grfsh_*.deb` |
| Fedora, RHEL, openSUSE | download the `.rpm` from a release, then `sudo dnf install ./grfsh-*.rpm` |
| Arch Linux | `yay -S grfsh-git`, or build `packaging/aur/PKGBUILD` with `makepkg -si` |
| Nix | `nix run github:gdprojectsss/goRustlyFast` or `nix profile install github:gdprojectsss/goRustlyFast` |
| Homebrew | `brew install --HEAD gdprojectsss/tap/grfsh` |

The `.deb`, `.rpm` and AUR packages install the man page, so `man grfsh` works afterwards.

## From source

grfsh needs Rust 1.88 or newer.

```sh
cargo install grfsh
```

or from a clone:

```sh
git clone https://github.com/gdprojectsss/goRustlyFast
cd goRustlyFast
cargo build --release
./target/release/grfsh
```

## Checking the install

```sh
grfsh --version
grfsh -c 'echo $((6 * 7))'
```
