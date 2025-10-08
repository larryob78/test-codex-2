# Random Video Remixer

This repository contains a small command-line video editor that randomly remixes
input videos and layers music on top of the final result. Each run shuffles the
clips, applies a different selection of visual effects, and optionally mixes in a
random audio track.

## Quick start

1. Install dependencies (requires Python 3.9+ and FFmpeg):
   ```bash
   pip install -r requirements.txt
   ```
2. Run the tool with one or more video files:
   ```bash
   python src/random_video_editor.py input1.mp4 input2.mp4 --music music_folder/
   ```

The command above will:
- Randomly trim each input clip to a sub-segment.
- Concatenate the clips in a different order each time.
- Apply between two and four random effects (speed changes, fades, zooms, etc.).
- Pick a music track (file or directory) and mix it with the original audio.
- Export the remixed video as an MP4 file using H.264 video and AAC audio.

Run `python src/random_video_editor.py --help` to see every option, including
volume control, effect counts, reproducible seeds, and the preview options:

```bash
python src/random_video_editor.py input.mp4 --preview --preview-duration 8
```

The command above renders a short 8-second preview (resized to 360p) before
exporting the full-quality remix, making it easy to check the random effects.
