"""Text-based parodies of iconic television advertisements.

Run this module to view a playful, code-driven reinterpretation of several
famous commercials such as Cadbury's "Gorilla" or Guinness' "Surfer".
Each parody is rendered as a minimal console animation using ASCII art so the
"visual" is created purely with code.
"""
from __future__ import annotations

import argparse
import os
import textwrap
import time
from typing import Dict, Iterable, List, Sequence


def clear() -> None:
    """Clear the terminal for a simple animation effect."""
    # ``os.name`` check keeps things portable across environments where CLS is
    # required instead of the ANSI escape sequence.
    if os.name == "nt":
        os.system("cls")
    else:
        print("\033c", end="")


def play_animation(frames: Iterable[str], delay: float = 0.6) -> None:
    """Play a sequence of ASCII frames with a short delay."""
    for frame in frames:
        clear()
        print(frame)
        time.sleep(delay)


def render_ad(ad: Dict[str, object], delay: float = 0.6) -> None:
    """Render a single parody advertisement."""
    title = ad["title"]
    brand = ad["brand"]
    description = ad["description"]
    frames = ad["frames"]

    border = "=" * 80
    print(border)
    print(f"{title} — {brand}")
    print(border)
    print(description)
    time.sleep(1.5)
    play_animation(frames, delay=delay)
    print("\nEND CARD: " + ad["tagline"])
    print(border)
    time.sleep(2)


ADS: List[Dict[str, object]] = [
    {
        "title": "Cadbunny's Midnight Solo",
        "brand": "Cadbunny Confections (a wink to Cadbury)",
        "description": (
            "A moonlit office, a forgotten drum kit, and a zen bunny breaking into "
            "a chocolate-fueled groove."
        ),
        "frames": [
            r"""
             (\_/)
            =( '.' )=     *thump*
             (")(")   ──────────────┐
                       DRUM KIT    │
                       OF DESTINY  │
            """,
            r"""
             (\_/)
            =( '.' )=   *THUMP-THUMP*
             (")(")   ╔════════════╗
                       ║  SOLO MODE ║
                       ╚════════════╝
            """,
            r"""
             (\_/)
            =( '.' )=  *CRASH!*
             (")(")    ╔═╗ ╔═╗ ╔═╗
                        ╚═╝ ╚═╝ ╚═╝  "Because smooth gets loud."
            """,
        ],
        "tagline": "Smooth chocolate. Surprisingly percussive.",
    },
    {
        "title": "Only Brighter Balls",
        "brand": "Brazza Pixel TVs (nodding to Sony BRAVIA)",
        "description": (
            "Thousands of luminous emoji spheres tumble down a tech blogger's street "
            "to prove color accuracy."
        ),
        "frames": [
            r"""
            Street Level Cam
            ----------------
            😀 😀 😀 😀 😀 😀
              😀 😀 😀 😀 😀
            """,
            r"""
            Drone Cam
            ---------
            😀😃😄😁😆😅😂🤣
              🌈 Pixelated chaos below 🌈
            """,
            r"""
            Slow Motion Hero Shot
            --------------------
            😀     😃     😄
               😁     😆
            BRIGHTER. BOUNCIER. NERDIER.
            """,
        ],
        "tagline": "Turn your living room into a joyful avalanche of color.",
    },
    {
        "title": "Guinness Coder Surfer",
        "brand": "Stoutware",
        "description": (
            "Black-and-white waves become cascading lines of code as a lone surfer "
            "waits for the perfect deployment window."
        ),
        "frames": [
            r"""
            wait_for_wave()
            while tide < perfect_release:
                refactor(hope)
            """,
            r"""
            ///////\~~~~~~~~~~
            /////    \~~~~~~~~
            Surfboard = {"balance": 99, "pint": "ready"}
            """,
            r"""
            commit --amend --no-edit
            push --force
            pint.pour()
            """,
        ],
        "tagline": "Good things come to those who git fetch.",
    },
    {
        "title": "Old Syntax Guy",
        "brand": "Code Spice",
        "description": (
            "A swaggering developer shifts from debugging to publishing packages, all "
            "while addressing the audience directly."
        ),
        "frames": [
            r"""
            Look at your code.
            Now back to mine.
            Now back at your code.
            Sadly, it's not mine.
            """,
            r"""
            But if it stopped
            using tabs like it's 2003
            it could lint
            like mine.
            """,
            r"""
            Smell that? That's
            freshly compiled success.
            """,
        ],
        "tagline": "Code Spice: Smell like a freshly merged branch.",
    },
    {
        "title": "April 2084",
        "brand": "Pear Computers",
        "description": (
            "An athlete in neon sneakers storms a gray conference of algorithmic "
            "overlords to hurl a glowing debugging hammer."
        ),
        "frames": [
            r"""
            Citizens of 2084,
            Today we unveil
            The Infinite Meeting.
            """,
            r"""
             O
            /|\   *WHOOSH*
            / \   Hammer of Debugging
            """,
            r"""
            "This meeting could have
            been an email!"
            (crash)
            """,
        ],
        "tagline": "Pear: Why conform when you can alt+f4?",
    },
    {
        "title": "Honda Frog",
        "brand": "Hondoodle",
        "description": (
            "Instead of car parts knocking into each other, a single calm frog sets "
            "off a chain reaction of gentle ribbits that still starts the hybrid."
        ),
        "frames": [
            r"""
            Ribbit ->
              ribbit ->
                ribbit ->
                  ignition()
            """,
            r"""
            [Frog presses button]
            ⚙️  ⚙️  ⚙️  ⚙️
            Components whisper into place.
            """,
            r"""
            Silence.
            Then...
            *electric hum*
            """,
        ],
        "tagline": "Precision engineering, amphibian calm.",
    },
    {
        "title": "Write the Feature",
        "brand": "Nike.dev",
        "description": (
            "Rapid-fire cuts between athletes-turned-programmers shipping critical "
            "features seconds before launch."
        ),
        "frames": [
            r"""
            // Stadium lights flare
            deployFeature("clutch_mode")
            """,
            r"""
            sprint()
            merge()
            celebrate()
            """,
            r"""
            Just ship it.
            """,
        ],
        "tagline": "Legendary commits start with a single keystroke.",
    },
]


def slugify(text: str) -> str:
    """Create a simple slug from a title so it can be referenced via CLI."""
    cleaned = [ch.lower() if ch.isalnum() else "-" for ch in text]
    slug = "".join(cleaned)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


def list_ads() -> Sequence[str]:
    """Return human-friendly information about each available parody."""
    lines: List[str] = []
    for index, ad in enumerate(ADS, start=1):
        slug = slugify(ad["title"])
        lines.append(f"{index}. {ad['title']} (slug: {slug})")
    return lines


def find_ad(identifier: str) -> Dict[str, object]:
    """Find an advertisement by slug, title, or 1-based index."""

    normalized = identifier.strip().lower()

    if normalized.isdigit():
        index = int(normalized) - 1
        if 0 <= index < len(ADS):
            return ADS[index]

    matches: List[Dict[str, object]] = []
    for ad in ADS:
        if slugify(ad["title"]) == normalized:
            return ad
        if ad["title"].lower() == normalized:
            return ad
        if ad["brand"].lower() == normalized:
            return ad
        slug = slugify(ad["title"])
        if normalized and normalized in slug:
            matches.append(ad)
        elif normalized and normalized in ad["title"].lower():
            matches.append(ad)
        elif normalized and normalized in ad["brand"].lower():
            matches.append(ad)

    if len(matches) == 1:
        return matches[0]

    available = "\n".join(list_ads())
    raise ValueError(
        f"Unknown advertisement '{identifier}'. Try one of:\n{available}"
    )


def preview_ad(ad: Dict[str, object]) -> None:
    """Print a static preview of an advertisement without animations."""

    border = "=" * 80
    print(border)
    print(f"{ad['title']} — {ad['brand']}")
    print(border)
    wrapped = textwrap.fill(ad["description"], width=76)
    print(wrapped)

    for idx, frame in enumerate(ad["frames"], start=1):
        print("\n" + f"Frame {idx}".center(80, "-"))
        frame_text = textwrap.dedent(frame).rstrip()
        print(frame_text)

    print("\nEND CARD: " + ad["tagline"])
    print(border)


def run_showcase(selected: Dict[str, object] | None, preview: bool, delay: float) -> None:
    """Run the animated showcase or print previews depending on flags."""

    ads: Sequence[Dict[str, object]]
    if selected is None:
        ads = ADS
    else:
        ads = [selected]

    if preview:
        for ad in ads:
            preview_ad(ad)
    else:
        for ad in ads:
            render_ad(ad, delay=delay)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Animate or preview code-driven parodies of iconic television adverts."
        )
    )
    parser.add_argument(
        "--ad",
        metavar="IDENTIFIER",
        help=(
            "Render a single parody by number, title, slug, or brand. "
            "By default every ad plays in sequence."
        ),
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help=(
            "Show a static preview of the ASCII art instead of the animated "
            "sequence so you can skim the visuals quickly."
        ),
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.6,
        help="Seconds to wait between animation frames (default: 0.6).",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List the available parodies and exit without rendering.",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.list:
        print("Available parodies:\n")
        for line in list_ads():
            print(line)
        return

    try:
        selected_ad = find_ad(args.ad) if args.ad else None
        run_showcase(selected_ad, preview=args.preview, delay=args.delay)
    except ValueError as exc:
        parser.error(str(exc))
    except KeyboardInterrupt:
        print("\nShowcase interrupted. Thanks for visiting the parody reel!")


if __name__ == "__main__":
    main()
