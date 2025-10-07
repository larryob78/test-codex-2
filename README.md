# AR GIF Studio

A lightweight web studio that lets you combine your phone's camera feed with animated GIFs from Nana Banana or any other source, plus live text overlays.

## Features

- Launch the rear or selfie camera using the browser (perfect for mobile use).
- Drop animated GIFs in real time from a URL, from your device, or from curated suggestions.
- Add colourful captions with adjustable size, colour and background.
- Drag, resize, and remove overlays directly on top of the live feed.
- Capture still frames that flatten the camera feed and overlays into a downloadable PNG snapshot.

> **Tip:** For the best experience, open the app from your phone's browser and add it to the home screen to get a fullscreen view.

## Getting started

This project is a static web experience—no build tools are required. Simply serve the repository and open it in your browser.

```bash
# from the project root
python -m http.server 8000
```

Then browse to [http://localhost:8000](http://localhost:8000).

### Using it on your phone

1. Make sure your phone and the computer that is serving the project are connected to the same Wi-Fi network.
2. Start the static server (for example `python -m http.server 8000`).
3. Find the computer's local IP address (for example `192.168.1.42`).
4. On your phone, open a modern browser such as Chrome, Safari, or Firefox and visit `http://192.168.1.42:8000` (replace with your actual IP and port).
5. Because the site is served over HTTP on your local network, browsers treat it like `localhost` and will still allow camera access. If you deploy it to the public web, make sure to use HTTPS so that camera permissions work.
6. Tap **Start camera**, allow the permission prompt, and then add GIF or text overlays as desired.

> **Tip:** Add the page to your home screen (Share → Add to Home Screen on iOS or the menu → Add to Home screen on Android) to enjoy a fullscreen experience.

### Using the studio

1. Tap **Start camera** and allow camera permissions.
2. Choose whether to use the rear camera before starting (toggle provided).
3. Add overlays:
   - Paste a GIF URL and press **Add**.
   - Upload a GIF/WebP file from your device.
   - Tap on one of the suggestion thumbnails.
   - Type a caption, tweak its colour/background/size, and press **Add text**.
4. Drag or resize overlays with one finger (mobile) or a mouse.
5. Press **Capture still** to grab the current frame with overlays and download it.

### Limitations

- Animated GIFs are flattened to their current frame when you capture a still. Recording video is out of scope for this demo, but can be added with MediaRecorder.
- Browsers do not allow direct control over Wi-Fi or Bluetooth networks, so connectivity management remains within the device OS. The app uses your existing internet connection for GIF URLs.

### Deployment options

- **GitHub Pages / Netlify / Vercel:** Drag-and-drop the repository folder to any static hosting provider to make it publicly available over HTTPS.
- **Local-first demos:** Keep the `python -m http.server` command running and send the local network URL to anyone on the same Wi-Fi to try the experience without deploying it.

## Customising

- Update the `SAMPLE_GIFS` array in `app.js` to change the default suggestion tiles.
- Adjust colours and layout by editing `styles.css`.
- Extend overlay logic inside `app.js` to add stickers, shape tools, or export-to-video functionality.

## License

MIT
