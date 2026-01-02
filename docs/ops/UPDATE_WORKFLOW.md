# Update Workflow - VS Code / Codespaces

## Quick Reset (Most Common)

When you encounter import errors, stale modules, or dev overlay issues:

```bash
# Use the reset script
./scripts/dev-reset.sh

# Or manually:
rm -rf node_modules/.vite dist .vite
npm run dev
```

Then in your browser:
- **Hard refresh**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open DevTools → Application → Clear storage → Clear site data

## Full Update from GitHub

### 1. Pull Latest Changes

```bash
# Ensure you're on the correct branch
git status

# Pull updates
git pull origin <branch-name>

# Or if on main
git pull origin main
```

### 2. Update Dependencies

```bash
# If package.json changed
npm install

# If package-lock.json has conflicts
rm package-lock.json
npm install
```

### 3. Clear Caches

```bash
# Quick way
./scripts/dev-reset.sh

# Or with full reinstall
./scripts/dev-reset.sh --full
```

### 4. Restart Dev Server

```bash
# Stop any running server (Ctrl+C)

# Start fresh
npm run dev
```

The dev server will run on: **http://localhost:3004**

### 5. Clear Browser State

**Option A - Hard Refresh (Fastest)**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Option B - Clear Storage**
1. Open DevTools (`F12`)
2. Go to Application tab
3. Click "Clear storage" in sidebar
4. Check all boxes
5. Click "Clear site data"
6. Close all tabs for the site
7. Reopen in new tab

## Common Issues

### "Failed to fetch dynamically imported module"

**Cause**: Browser cached old module paths after files were renamed.

**Fix**:
```bash
./scripts/dev-reset.sh
# Then hard refresh browser
```

### Port 3004 Already in Use

**Find and kill process**:
```bash
# On macOS/Linux
lsof -ti:3004 | xargs kill -9

# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3004).OwningProcess | Stop-Process
```

Or use the reset script:
```bash
./scripts/dev-reset.sh
```

### Import Errors After Git Pull

**Likely cause**: File renames or path changes.

**Fix**:
```bash
# Full reset
./scripts/dev-reset.sh --full

# Verify build
npm run build
```

### TypeScript Errors

```bash
# Check TypeScript
npm run typecheck

# If VSCode is out of sync
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"
```

## Codespaces Specific

### After Codespace Stops/Restarts

```bash
# Pull any updates
git pull

# Clear caches
./scripts/dev-reset.sh

# Start server
npm run dev
```

### Port Forwarding

Codespaces automatically forwards port 3004. If not visible:
1. Open Ports panel (View → Ports)
2. Ensure port 3004 is listed and public
3. Click the globe icon to open in browser

## VS Code Integration

### Recommended Extensions

Already configured in `.vscode/extensions.json`:
- ESLint
- Prettier
- Tailwind CSS IntelliSense

### Debugging

Use the pre-configured launch configurations:
1. Press `F5` or go to Run & Debug
2. Select "Launch Chrome against localhost"

## Verification Checklist

After update, verify:

```bash
# ✓ Lint passes
npm run lint

# ✓ Type check passes
npm run typecheck

# ✓ Build succeeds
npm run build

# ✓ Dev server starts
npm run dev
```

Then in browser:
- ✓ Dashboard loads without errors
- ✓ Navigation works
- ✓ No console errors
- ✓ Theme switcher works

## Getting Help

If issues persist:
1. Check browser console for specific errors
2. Check terminal for server errors
3. Verify you're on the correct branch: `git branch`
4. Check node version: `node --version` (should be 20.x)
5. Try full cleanup: `./scripts/dev-reset.sh --full`

## Emergency Full Reset

```bash
# Nuclear option - completely start over
rm -rf node_modules package-lock.json
npm install
./scripts/dev-reset.sh
npm run dev
```
