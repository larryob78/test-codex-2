# Built-in Nodes

This document summarizes the built-in nodes shipped with Weaverboard. Each node is implemented as a manifest in `packages/nodes` and includes metadata, IO schemas, property schema via Zod, and an execution handler.

| Node | Kind | Description |
| --- | --- | --- |
| Prompt | text | Emits a user-supplied prompt string. |
| Prompt Concatenator | text | Concatenates multiple prompt inputs with separators. |
| Prompt Enhancer | text | Calls the LLM adapter with a system prompt to refine an input prompt. |
| Run Any LLM | text | Delegates to configured adapters with dynamic params. |
| Image Describer | helper | Generates text description for an image asset via LLM. |
| Video Describer | helper | Generates text description for a video asset via LLM. |
| Compositor | image | Layer based composition with blend modes. |
| Crop | image | Crops image assets by bounding box. |
| Resize | image | Resizes image assets while maintaining aspect ratios. |
| Blur | image | Applies Gaussian blur to an image. |
| Import | helper | Generates signed upload URL for assets. |
| Export | helper | Emits signed download URL. |
| Preview | helper | Stores preview metadata and returns asset references. |
| Router | helper | Branches flow to multiple outputs. |
| Output | helper | Marks terminal outputs and exposes them in App mode. |
| Text Iterator | iterator | Fans out an array of prompts across a selected generation node. |

Additional nodes can be added by creating new manifests and registering them in the node registry.
