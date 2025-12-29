# Repo Hygiene Summary

## What Changed

- Removed local artifacts (`node_modules/`, `dist/`, `.venv/`, notebook checkpoints) to keep the tree clean.
- Standardized ESLint on `eslint.config.js`; removed legacy `.eslintrc.*` files and the `eslintConfig` package.json block.
- Relocated root markdown reports into `docs/`, `docs/ops/`, and `docs/legacy/` to keep the root uncluttered.
- Moved helper scripts (auto-commit, start helpers, CI precheck, watchers) into `scripts/` and refreshed doc references.
- Grouped deployment assets under `infra/` (compose, frontend Dockerfile, Nginx config) and updated workflows/docs to match.
- Confirmed `.env.development.local` remains ignored via `.gitignore` (no tracked copy present).

## Notes for Contributors

- Run `npm install` before `npm run lint`, `npm run typecheck`, or `npm run build` after the cleanup.
- Use `docker compose -f infra/docker-compose.yml ...` for local stacks; CD builds use `infra/Dockerfile.frontend`.
- Auto-commit helpers now live under `scripts/`; commands in docs reflect the new paths.
