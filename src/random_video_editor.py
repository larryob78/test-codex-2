"""Command-line tool for randomizing video edits and overlaying music.

This script uses MoviePy to apply a different sequence of randomized
transformations on each run.  Users can provide one or more input
videos and an optional directory or file with background music.  The
result is exported as an MP4 file.
"""
from __future__ import annotations

import argparse
import random
import sys
from pathlib import Path
from typing import Callable, Iterable, List, Optional

from moviepy import editor as mpy


Effect = Callable[[mpy.VideoFileClip], mpy.VideoFileClip]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Randomly remix one or more videos by applying visual effects,"
            " trimming clips, shuffling order, and mixing in background music."
        )
    )
    parser.add_argument(
        "inputs",
        nargs="+",
        help="One or more input video files to remix.",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output video path (defaults to ./random_mix_<timestamp>.mp4)",
    )
    parser.add_argument(
        "--music",
        type=Path,
        default=None,
        help="Optional path to a music file or directory of tracks to overlay.",
    )
    parser.add_argument(
        "--music-volume",
        type=float,
        default=0.7,
        help="Volume multiplier for the music track (default: 0.7)",
    )
    parser.add_argument(
        "--original-volume",
        type=float,
        default=0.6,
        help="Volume multiplier for the original clip audio (default: 0.6)",
    )
    parser.add_argument(
        "--mute-original",
        action="store_true",
        help="If provided, drop the original audio entirely.",
    )
    parser.add_argument(
        "--max-duration",
        type=float,
        default=None,
        help="Trim the remixed video to this many seconds if provided.",
    )
    parser.add_argument(
        "--min-effects",
        type=int,
        default=2,
        help="Minimum number of random effects to apply (default: 2)",
    )
    parser.add_argument(
        "--max-effects",
        type=int,
        default=4,
        help="Maximum number of random effects to apply (default: 4)",
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Render a short, low-resolution preview alongside the final export.",
    )
    parser.add_argument(
        "--preview-duration",
        type=float,
        default=10.0,
        help="Length of the preview clip in seconds (default: 10).",
    )
    parser.add_argument(
        "--preview-height",
        type=int,
        default=360,
        help="Vertical resolution for the preview render (default: 360).",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Random seed for reproducible results.",
    )
    return parser


def resolve_music_path(path: Path) -> Optional[Path]:
    if path is None:
        return None
    if path.is_file():
        return path
    if path.is_dir():
        candidates = sorted(
            p for p in path.iterdir() if p.suffix.lower() in {".mp3", ".wav", ".m4a", ".aac"}
        )
        if not candidates:
            raise SystemExit(f"No supported audio files found in directory: {path}")
        choice = random.choice(candidates)
        print(f"Selected music track: {choice}")
        return choice
    raise SystemExit(f"Music path does not exist: {path}")


def random_subclip(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    if clip.duration <= 2:
        return clip
    max_start = max(0, clip.duration - 2)
    start = random.uniform(0, max_start)
    end = random.uniform(start + 1, clip.duration)
    return clip.subclip(start, end)


def apply_random_effects(clip: mpy.VideoFileClip, effects: Iterable[Effect], min_n: int, max_n: int) -> mpy.VideoFileClip:
    pool: List[Effect] = list(effects)
    if not pool:
        return clip
    n_effects = random.randint(min_n, max_n)
    selected = random.choices(pool, k=n_effects)
    for effect in selected:
        clip = effect(clip)
    return clip


def _speed_change(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    factor = random.uniform(0.7, 1.4)
    print(f"Applying speed change: x{factor:.2f}")
    return clip.fx(mpy.vfx.speedx, factor)


def _color_shift(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    factor = random.uniform(0.7, 1.3)
    print(f"Adjusting colors with factor {factor:.2f}")
    return clip.fx(mpy.vfx.colorx, factor)


def _mirror(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    print("Applying horizontal mirror")
    return clip.fx(mpy.vfx.mirror_x)


def _rotate(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    angle = random.uniform(-10, 10)
    print(f"Rotating clip by {angle:.1f} degrees")
    return clip.fx(mpy.vfx.rotate, angle)


def _crop_zoom(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    zoom = random.uniform(1.05, 1.3)
    print(f"Applying random zoom x{zoom:.2f}")
    w, h = clip.size
    new_w = w / zoom
    new_h = h / zoom
    x_center = random.uniform(new_w / 2, w - new_w / 2)
    y_center = random.uniform(new_h / 2, h - new_h / 2)
    cropped = clip.fx(
        mpy.vfx.crop,
        x_center=x_center,
        y_center=y_center,
        width=new_w,
        height=new_h,
    )
    return cropped.resize((w, h))


def _fade(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    duration = min(clip.duration / 6, 1.5)
    if duration <= 0:
        return clip
    print(f"Adding fade-in/out with duration {duration:.2f}s")
    return clip.fadein(duration).fadeout(duration)


def _margin(clip: mpy.VideoFileClip) -> mpy.VideoFileClip:
    margin = random.randint(10, 80)
    color = tuple(random.randint(0, 255) for _ in range(3))
    print(f"Adding colored margin of {margin}px with color {color}")
    return clip.fx(mpy.vfx.margin, margin=margin, color=color)


def choose_effects() -> List[Effect]:
    return [
        _speed_change,
        _color_shift,
        _mirror,
        _rotate,
        _crop_zoom,
        _fade,
        _margin,
    ]


def mix_audio(
    clip: mpy.VideoFileClip,
    music_path: Optional[Path],
    music_volume: float,
    original_volume: float,
    mute_original: bool,
) -> mpy.VideoFileClip:
    if music_path is None:
        return clip
    music = mpy.AudioFileClip(str(music_path))
    music = music.volumex(music_volume).audio_loop(duration=clip.duration)

    tracks: List[mpy.AudioClip] = [music]
    if clip.audio and not mute_original:
        tracks.append(clip.audio.volumex(original_volume))
    if len(tracks) == 1:
        combined = tracks[0]
    else:
        combined = mpy.CompositeAudioClip(tracks)
    combined = combined.set_duration(clip.duration)
    return clip.set_audio(combined)


def concatenate_clips(clips: List[mpy.VideoFileClip]) -> mpy.VideoFileClip:
    if len(clips) == 1:
        return clips[0]
    random.shuffle(clips)
    print("Concatenating clips in random order")
    return mpy.concatenate_videoclips(clips, method="compose")


def ensure_output_path(path: Optional[Path]) -> Path:
    if path is not None:
        return path
    timestamp = mpy.tools.cvsecs_to_timestr(random.uniform(0, 99999)).replace(":", "-")
    return Path(f"random_mix_{timestamp}.mp4")


def main(argv: Optional[List[str]] = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.min_effects < 0 or args.max_effects < args.min_effects:
        parser.error("Invalid effect count range")

    if args.seed is not None:
        random.seed(args.seed)

    input_paths = [Path(p) for p in args.inputs]
    for path in input_paths:
        if not path.exists():
            parser.error(f"Input file does not exist: {path}")

    output_path = ensure_output_path(args.output)
    print(f"Output will be saved to: {output_path}")

    clips: List[mpy.VideoFileClip] = []
    for path in input_paths:
        print(f"Loading clip: {path}")
        clip = mpy.VideoFileClip(str(path))
        clip = random_subclip(clip)
        clips.append(clip)

    combined = concatenate_clips(clips)

    effects = choose_effects()
    remixed = apply_random_effects(combined, effects, args.min_effects, args.max_effects)

    if args.max_duration is not None and remixed.duration > args.max_duration:
        print(f"Trimming output to {args.max_duration} seconds")
        remixed = remixed.subclip(0, args.max_duration)

    music_path = resolve_music_path(args.music) if args.music else None
    remixed = mix_audio(
        remixed,
        music_path=music_path,
        music_volume=args.music_volume,
        original_volume=args.original_volume,
        mute_original=args.mute_original,
    )

    if args.preview and remixed.duration > 0:
        preview_duration = min(args.preview_duration, remixed.duration)
        preview_path = output_path.with_name(f"{output_path.stem}_preview{output_path.suffix}")
        print(
            "Rendering preview... This creates a shorter, lower-resolution clip "
            f"({preview_duration:.1f}s) at {args.preview_height}px height."
        )
        preview_clip = remixed.subclip(0, preview_duration).resize(height=args.preview_height)
        preview_clip.write_videofile(
            str(preview_path),
            codec="libx264",
            audio_codec="aac",
            bitrate="1200k",
            temp_audiofile=str(preview_path.with_suffix(".temp-audio.m4a")),
            remove_temp=True,
            fps=min(remixed.fps or 24, 30),
        )

    print("Rendering video... This may take a while depending on clip length.")
    remixed.write_videofile(
        str(output_path),
        codec="libx264",
        audio_codec="aac",
        temp_audiofile=str(output_path.with_suffix(".temp-audio.m4a")),
        remove_temp=True,
    )


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
