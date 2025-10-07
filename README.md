# DevDay 2025 Drop-In Starter Pack

You’ve got the right stack. I bundled it into a *drop-in starter pack* you can wire up now—plus I sanity-checked each claim against OpenAI’s docs so you’re not building on rumor.

---

## What DevDay 2025 actually gives you (verified)

* **AgentKit**: Agent Builder (visual multi-agent canvas), ChatKit (embeddable chat UI), Connector Registry (governed access), and upgraded Evals. Agent Builder and Connector Registry are rolling out in beta; ChatKit + new Evals are GA. RFT is GA on **o4-mini** and in **private beta on GPT-5**.
* **Responses API** (successor path from Chat Completions): adds an *agentic* loop with **built-in tools**—**web search**, **file search** (vector stores), and **computer use**—and is the recommended starting point for new builds.
* **Computer use (CUA)**: the GUI-driving model behind Operator; exposed via Responses API for “click through UIs” tasks.
* **Realtime**: `gpt-realtime` is GA for production voice agents; supports **SIP calls**, **image input**, and **remote MCP servers**.
* **Video**: **Sora 2** is live; the **`v1/videos`** API is the programmatic surface for text→video with audio.
* **Multimodal & TTS**: **gpt-4o-mini-TTS** is available for natural-sounding VO.
* **Images**: use **`gpt-image-1`** (and **mini**) via the Images API or as a Responses tool.
* **Models**: **o3** (top reasoning), **o4-mini** (fast/cheap reasoning), and **GPT-5 / GPT-5-pro** (precision & control) are in the API lineup.
* **Best-practice rails**: **Structured Outputs** (strict JSON), **Guardrails**, **Moderation**, and **Evals** (incl. tool-use grading).
* **Cost/latency levers**: **Prompt Caching** (discounted cached tokens) and **Predicted Outputs**.

> Note: your line about “800M+ weekly ChatGPT users”—I can’t confirm that number from official sources, so I’ve left it out. If you have a source, I’ll incorporate it. I cannot confirm this.

---

## Download the starter pack (ready to use)

* **AgentKit config** – 11 agents (Orchestrator + 10 specialists), prompts, and strict JSON Schemas
  [Download `agentkit_config.json`](starter-pack/agentkit_config.json)

* **House-style evals dataset (12 examples)** – tone, claims, citations, readability  
  [Download `house_style_evals_dataset.jsonl`](starter-pack/house_style_evals_dataset.jsonl)

* **Grader specs (proposed)** – 4 graders with Structured Outputs (Tone, ClaimRisk, SourceCoverage, Readability)  
  [Download `house_style_graders.proposed.json`](starter-pack/house_style_graders.proposed.json)

* **README** – wiring checklist + 30/60/90
  [Open `README.txt`](starter-pack/README.txt)

> Import note: Agent Builder’s import schema isn’t public in detail; this config mirrors AgentKit/Responses concepts and may need minor field mapping in your org. Use it as your **single source of truth** for prompts, tools, schemas, and handoffs.

### Install the tooling locally

You can install the bundle tooling directly from this repository:

```bash
pip install -e .[dev]
```

This exposes an `agentkit` CLI entry point and brings in the optional test
dependencies so you can validate changes before shipping.

### Build the AgentKit bundle locally

Run the bundle builder to materialise an AgentKit-ready manifest and optional zip archive:

```bash
agentkit build --config starter-pack/agentkit_config.json --output dist/agentkit-bundle --archive dist/agentkit-bundle.zip
```

Or, if you prefer not to install the package, you can continue to invoke the
module directly:

```bash
python -m agentkit.cli build --config starter-pack/agentkit_config.json --output dist/agentkit-bundle --archive dist/agentkit-bundle.zip
```

After the build completes, run the automated checks to make sure the bundle is
ready for import:

```bash
pytest
```

The `dist/agentkit-bundle` directory contains the manifest and per-agent definitions that mirror the OpenAI AgentKit structure, making it easy to drag-and-drop into Agent Builder or push via API.

---

## How this maps to your flow (one-line per stage)

* **Orchestrator** → model **o3** (or **GPT-5-pro** if enabled) with built-in **web search**, **file search**, **computer use**, **guardrails**, **moderation**; returns a structured run-log + next-agent.
* **Brand Librarian** → **o4-mini** + **file search** only (web fallback) to build a BrandCard; marks unknowns instead of guessing.
* **Brief Architect / Strategist** → **o3** + **web search** with citations.
* **Media Planner** → **o4-mini** + **web search** for CPM/CPC benchmarks (always cited).
* **Creative Director** → **GPT-5/5-pro** for nuance; **o3** fallback.
* **Copywriter** → **GPT-5** (batch via **o4-mini** for variants).
* **Art Director** → **image tool** (`gpt-image-1` / mini) + **file search** for brand assets.
* **Storyboard & Sora Director** → **o3** planning + **Sora 2** via **`v1/videos`**; optional **TTS** for temp VO.
* **QA/Compliance** → **Guardrails + Moderation** with a pass/fail table; blocks risky assets and suggests minimal fixes.
* **Producer/Deck Builder** → **file search** + **computer use** for assembly/exports.

---

## Wiring checklist (quick)

1. **Models** – enable **o3**, **o4-mini**, **gpt-5**/**gpt-5-pro** in your project.
2. **Built-in tools** – turn on **web search**, **file search**, **computer use** in **Responses API**; keep tool calls within the agent loop.
3. **Connector Registry** – allow **Google Drive**, **SharePoint**, **Teams** to feed brand kits (read-only).
4. **ChatKit UI** – embed for internal/client reviews; it’s the fastest path to a production chat surface.
5. **Guardrails & Moderation** – enable PII masking, jailbreak detection, and block on moderation fails.
6. **Structured Outputs** – set `strict: true` with JSON Schema for *every* agent to stop flaky parsing.
7. **Evals** – upload the dataset and wire graders; tool-use grading is supported.
8. **Realtime room** – use **gpt-realtime** + **SIP** for live VO direction/approvals.
9. **Prompt Caching** + **Predicted Outputs** – cache long brand instructions; speed up templated docs.
10. **Sora path** – call **`v1/videos`** for animatics; Sora 2 supports synced audio and controllable shots.

---

## Risks & unknowns (so you’re not surprised)

* **Agent Builder import format**: not fully documented; expect light mapping from this JSON to your canvas. I cannot confirm a universal import schema.
* **GPT-5 access levels**: API model IDs differ from ChatGPT SKUs (e.g., GPT-5 Thinking/Instant vs `gpt-5`, `gpt-5-pro`). Verify which IDs are enabled in your org before hard-coding.
* **RFT scope**: GA on **o4-mini**; **GPT-5 RFT** is **private beta**—plan, don’t promise.

---

## If you want this tuned to a live brand

Send the **file names** (or upload) for the brandbook and legal lines. The Brand Librarian will auto-fill your BrandCard and the evals dataset will inherit tone/mandatories. No guessing, just what’s in the files. (Connector Registry governs access.)

---

### Sources (load-bearing)

* AgentKit (status, components, Guardrails, RFT GA/private beta):
* Responses API + built-in tools:
* Computer use (CUA):
* Realtime (SIP, MCP, image input):
* Sora 2 + `v1/videos`:
* ChatKit docs & samples:
* Structured Outputs:
* Evals + tool-use evals:
* Prompt Caching / Predicted Outputs:
* Models: **o3**, **o4-mini**, **GPT-5 / GPT-5-pro**:

If you want me to pre-seed the Brand Librarian with one of your lighthouse accounts, I can slot their tone/mandatories straight into the config and expand the evals set to 25–50 items per asset type.
