# @aganitha/atk-debug

> A powerful, thin wrapper around the popular `debug` package, enhanced with caller metadata (file/line) and advanced runtime controls.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)

## Why atk-debug?

`atk-debug` is designed for developers who love the `debug` namespace pattern but need more visibility into *where* logs are coming from, and more control over *when* they appear.

- 📂 **Automatic Caller Metadata**: Automatically capture and display the filename and line number for every log.
- 🛠️ **Runtime Control**: Enable/disable logging, caller metadata, and production-safety toggles on the fly.
- 🔄 **Core Compatibility**: 100% parity with the `debug` API. If you know `debug`, you already know `atk-debug`.
- 🚀 **Performance Focused**: Minimal overhead, with the ability to disable metadata capture for performance-critical paths.

## Installation

```bash
bun add @aganitha/atk-debug
# or
npm install @aganitha/atk-debug
```

## Quick Start

```ts
import atkDebug from '@aganitha/atk-debug';

// 1. Enable namespaces (programmatically or via DEBUG env var)
atkDebug.enable('workflow:*');

// 2. Create a logger
const log = atkDebug('workflow:api');

// 3. Log away!
log('Request received', { method: 'GET', url: '/health' });
// Output: workflow:api [index.ts:10] Request received { method: 'GET', url: '/health' } +0ms
```

## Essential Documentation

- 📘 **[Full Guide](./GUIDE.md)**: Deep dive into all features and configuration.
- 🧪 **[Examples](./examples/)**: 15+ runnable scripts demonstrating everything from structured logging to custom output redirection.

## Development

- **Build**: `bun run build`
- **Test**: `bun run test`
- **Examples**: `bun run example:basic`, `bun run example:namespaces`, etc.

---

Developed with ❤️ by [Aganitha](https://aganitha.ai).
