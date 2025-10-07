# Parody Advertisement Showcase

This repository contains a small Python program that recreates several famous
television advertisements as tongue-in-cheek console animations. Each spot is a
parody rendered entirely with ASCII art and code-driven timing—no video files
required.

## Included Parodies

The script riffs on classics such as:

* Cadbury's drumming gorilla (reimagined as **Cadbunny's Midnight Solo**)
* Sony BRAVIA's bouncing balls (now **Only Brighter Balls**)
* Guinness' surfer (transformed into **Guinness Coder Surfer**)
* Old Spice's swaggering spokesperson (reborn as **Old Syntax Guy**)
* Apple's "1984" (remixed into **April 2084**)
* Honda's "Cog" (croaking as **Honda Frog**)
* Nike's "Write the Future" (rewritten as **Write the Feature**)

## Running the Showcase

```bash
python parody_ads.py
```

Each parody will appear sequentially with simple terminal-clearing animations.
Use `Ctrl+C` if you want to exit early.

### Previewing the visuals

If you'd rather skim the ASCII art without the timing effects, use the
`--preview` flag. This prints each frame with labels so you can check the
visual gags at a glance.

```bash
python parody_ads.py --preview
```

### Focusing on specific parodies

Pass the title, slug, brand, or list number via `--ad` to preview or animate
specific spoofs. You can repeat the flag or provide comma-separated values to
queue multiple ads:

```bash
python parody_ads.py --ad surfer
python parody_ads.py --ad 3 --preview
python parody_ads.py --preview --ad 1,4 --ad "pear computers"
```

Run `python parody_ads.py --list` to see every available identifier, and use
`--delay` to tweak the animation speed if you prefer a faster or slower pace.
