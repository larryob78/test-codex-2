"""Text-based parodies of iconic television advertisements.

Run this module to view a playful, code-driven reinterpretation of several
famous commercials such as Cadbury's "Gorilla" or Guinness' "Surfer".
Each parody is rendered as a minimal console animation using ASCII art so the
"visual" is created purely with code.
"""
from __future__ import annotations

import os
import time
from typing import Dict, Iterable, List


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


def render_ad(ad: Dict[str, object]) -> None:
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
    play_animation(frames)
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


def main() -> None:
    for ad in ADS:
        render_ad(ad)


if __name__ == "__main__":
    main()
