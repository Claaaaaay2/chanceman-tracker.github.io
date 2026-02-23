# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the main Vite app (router, pages, components, logic, styles, storage, types).
- `public/` holds static assets served as-is, including `public/data/` and `public/images/`.
- `docs/` stores documentation and notes.
- `bug-report-relay/` is a separate Cloudflare Worker project for relaying bug reports.
- Root `index.html` and `vite.config.ts` define the app shell and build config.

## Build, Test, and Development Commands
Main app (root):
- `npm run dev`: start the Vite dev server.
- `npm run build`: produce a production build in `dist/`.
- `npm run preview`: serve the production build locally.
- Agent instruction: do not run `npm run build`; the user will run build verification manually.

Bug report relay (`bug-report-relay/`):
- `npm run dev`: run the worker locally with Wrangler.
- `npm run deploy`: deploy the worker.
- `npm test`: run worker tests with Vitest.

## Coding Style & Naming Conventions
- JavaScript uses ES modules; prefer named imports and clear file-level responsibilities.
- Indentation is 4 spaces in `src/` (match existing files like `src/main.js`).
- Use `camelCase` for variables/functions, `PascalCase` for component-like exports, and `SCREAMING_SNAKE_CASE` for constants.
- Keep file names descriptive and aligned with folder intent (e.g., `src/pages/reportABug.js`).

## Testing Guidelines
- The main app currently has no automated tests; validate changes by running `npm run dev` and checking relevant routes.
- `bug-report-relay/` uses Vitest; name tests with `.test.js` and keep them near the worker logic.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and usually sentence case (e.g., "Implement the quest interface").
- Keep commits focused on one change area when possible.
- PRs should include: a clear description, testing notes (commands run), and screenshots for UI changes.
- If you touch data files in `public/data/`, call out data schema or formatting changes explicitly.

## Deployment
- The app is deployed to GitHub Pages at `https://chanceman-tracker.github.io/`.
- `npm run build` outputs static files to `docs/` (see `vite.config.ts`), and pushing `docs/` publishes the site.
- Verify the app works from a static host by running `npm run build` + `npm run preview`.
- Treat `docs/` as build output only. Do not edit files in `docs/` directly; update sources in `src/` or `public/` only.

## Configuration Tips
- Static assets in `public/` are served verbatim; avoid runtime writes there.
- Client state is stored via `src/storage/fileStore.js`, backed by IndexedDB in `src/storage/fileStoreHelpers.js`.
- For worker changes, keep `wrangler.jsonc` aligned with environment settings.
