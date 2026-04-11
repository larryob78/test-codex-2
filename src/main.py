from __future__ import annotations

import argparse
import asyncio

from rich.console import Console

from src.config import load_config
from src.core.orchestrator import run_campaign
from src.core.types import Brief


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="NemoClaw — AI Campaign Pipeline")
    parser.add_argument("brief", help="Campaign brief text")
    parser.add_argument("--video", choices=["runway", "luma"], default="runway")
    parser.add_argument("--llm", choices=["nvidia", "claude"], default="claude")
    parser.add_argument("--debug", action="store_true")
    parser.add_argument("--brand", default="Generic")
    parser.add_argument("--duration", type=int, default=30)
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    config = load_config()
    config.video_backend = args.video
    config.llm_backend = args.llm
    config.debug = args.debug

    brief = Brief(
        brand=args.brand,
        product="",
        objective=args.brief,
        audience="25-45",
        tone="warm, authentic",
        duration_seconds=args.duration,
    )

    console = Console()
    console.print(f"[green]NemoClaw[/] | LLM: [cyan]{args.llm}[/] | Video: [cyan]{args.video}[/]")
    result = asyncio.run(run_campaign(brief, config))

    if result.status == "killed":
        console.print("[red]Campaign killed — all concepts scored below 18/30[/]")
    else:
        console.print(f"[green]Winner:[/] {result.scored.winner.concept.concept_name}")
        console.print(f"[green]Score:[/] {result.scored.winner.total_score}/30")
        console.print(f"[green]Shots:[/] {len(result.shot_plan.shots)}")
        console.print(f"[green]Assets:[/] {len(result.assets)}")


if __name__ == "__main__":
    main()
