# Spheria Wiki Local Run Guide

This project uses `fetch()` in `overview.html` to load `Spheria_Wiki.json`.
Because of browser security rules, opening the HTML directly with `file://` will usually fail.

Use the npm workflow below (recommended), or one of the fallback options.

## Project Files

- `overview.html`
- `Spheria_Wiki.json`

## Option 1: npm run dev (recommended)

This repo includes a `package.json` with a `dev` script.

From the project folder:

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000/`

`npm run dev` serves the project folder. The root URL (`/`) opens `index.html`, which redirects to `overview.html`.
This keeps JSON requests like `./Spheria_Wiki.json` working.

To stop the server, press `Ctrl+C` in that terminal.

## Option 2: VS Code Live Server

1. Install the **Live Server** VS Code extension (`ritwickdey.LiveServer`).
2. In VS Code, open `overview.html`.
3. Right-click in the editor and select `Open with Live Server`.
4. Your browser should open something like:
  - `http://127.0.0.1:5500/overview.html`

## Option 3: Python HTTP Server

From the project folder:

```powershell
cd "c:\Users\jeff\OneDrive\Projects\Code\Websites\SpheriaWiki.info"
python -m http.server 8000
```

Then open:

- `http://localhost:8000/overview.html`

To stop the server, press `Ctrl+C` in that terminal.

## Option 4: Node.js `serve` (without npm scripts)

From the project folder:

```powershell
cd "c:\Users\jeff\OneDrive\Projects\Code\Websites\SpheriaWiki.info"
npx serve .
```

Open the local URL shown in terminal (commonly `http://localhost:3000`) and navigate to:

- `/overview.html`

To mirror npm behavior without scripts, you can run:

```powershell
npx serve .
```

## Troubleshooting

- If you see the message that JSON could not be loaded:
  - Confirm you are using `http://...`, not `file://...`.
  - Confirm `Spheria_Wiki.json` is in the same folder as `overview.html`.
  - Refresh the page after starting the server.
- If port `8000` is busy, use another port:

```powershell
python -m http.server 8080
```
