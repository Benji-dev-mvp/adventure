#!/usr/bin/env bash
# Unified automation to auto-fix frontend + backend code issues
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR"
BACKEND_DIR="$ROOT_DIR/backend"

log() { printf "\n[fix-all] %s\n" "$1"; }

log "Starting automated fixes across repo"

# ---- Frontend: install + lint + format + type-check ----
log "Frontend: installing deps (npm install)"
pushd "$FRONTEND_DIR" >/dev/null
if [[ -f package.json ]]; then
  npm install --legacy-peer-deps
  log "Frontend: ESLint auto-fix"
  npx eslint src --ext .js,.jsx,.ts,.tsx --fix || true
  log "Frontend: Prettier format"
  npx prettier "src/**/*.{js,jsx,ts,tsx,json,css,md}" --write || true
  log "Frontend: TypeScript type-check"
  npm run type-check || true
else
  log "Skipped frontend (no package.json found)"
fi
popd >/dev/null

# ---- Backend: create venv + install + autofix + format ----
log "Backend: setting up virtualenv"
pushd "$BACKEND_DIR" >/dev/null
python3 -m venv .venv || true
source .venv/bin/activate

log "Backend: installing requirements"
pip install -r requirements.txt
# Dev tools for auto-fixes
pip install black isort autoflake flake8

log "Backend: removing unused imports (autoflake)"
autoflake --remove-all-unused-imports --remove-unused-variables --expand-star-imports \
  --in-place --recursive app || true

log "Backend: sorting imports (isort)"
isort app || true

log "Backend: formatting (black)"
black app || true

log "Backend: static checks (flake8)"
flake8 app || true

log "Backend: running tests (pytest -q)"
pytest -q || true

deactivate
popd >/dev/null

log "All automated fix steps completed"
