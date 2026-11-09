# Wedding-site

The wedding invitation website for **Dheeraj & Varsha**, 24 January 2027. It's built with React and Vite and is mobile-first.

**Live demo:** https://nikhilk70.github.io/Wedding-site/

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Content

| What | Where |
|---|---|
| All wedding details | `src/data/site.json` |
| Photos | `public/photos/`, listed under `photos` in site.json |
| Music | `public/music/song.mp3`; `music.startAt` is the start second |
| Invitation videos | `public/videos/*.mp4` |

Personalised guest link: `…/Wedding-site/?to=Mr.%20%26%20Mrs.%20Krishnan`. Skip the envelope with `?open=1`.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.

In this demo, RSVPs and wishes are saved in the guest's own browser. The production backend (Express, then Firebase) is kept separately.
