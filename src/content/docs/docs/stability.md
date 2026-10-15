---
title: "Stability promise"
description: "What grfsh 1.x keeps stable, and how features are deprecated."
---

grfsh follows [semantic versioning](https://semver.org) starting with 1.0.0.

## What 1.x keeps stable

Within the 1.x series, these keep working the way they are documented:

- **Script syntax and semantics.** A script that runs correctly on grfsh 1.0 runs the same on every 1.x release. Bug fixes that make grfsh behave more like bash are the exception, and each one is listed in the changelog.
- **Builtins and their options.** Existing builtins keep their names, options and exit statuses.
- **Table commands.** Command names, column names and the `to` formats keep working. New columns may be added.
- **Configuration.** Startup file locations, the theme file format and environment variables such as `GRFSH_PROMPT` and `NO_COLOR`.
- **Command line options.** `-c`, `-l`, `-i`, `--check`, `--agent`, `--json`, `--explain`, `--serve` and `--client`.
- **Agent interfaces.** The fields of `--json` results and `--serve` replies. New fields may be added, existing ones keep their names and meaning.

## What may change in a minor release

- Prompt rendering details, colors and icons in the presets
- Completion candidates and their order
- The wording of error messages, warnings and `--check` findings
- Performance
- The internal table wire format between table commands
- The Rust library API. grfsh is published as a binary, and its library crate is not meant for other programs to depend on.

## Deprecations

A feature is never removed in a minor release. When something needs to go:

1. It is marked deprecated in the changelog and the docs, and grfsh prints a warning once per session when it is used.
2. It keeps working for at least two minor releases and six months.
3. It is removed in the next major release.

## Supported platforms

Linux on x86_64 and aarch64, and macOS 13 or newer on Intel and Apple silicon. Each release is tested on all of them before it ships. The minimum supported Rust version for building from source is 1.88, and raising it counts as a minor change.
