# Development Ports Reference

## Primary Application Port

**Port 3004** - Frontend Development Server (Vite)

```bash
npm run dev
# Starts on http://localhost:3004
```

This is the **only** port you need for frontend development.

## Backend Port (Optional)

**Port 8000** - Backend API (FastAPI)

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The frontend proxies API requests to the backend automatically (configured in `vite.config.js`).

## Port Conflict Resolution

### Check What's Using a Port

**macOS / Linux:**
```bash
lsof -i :3004
# or
lsof -ti:3004
```

**Windows (PowerShell):**
```powershell
Get-NetTCPConnection -LocalPort 3004
```

### Kill Process on Port

**macOS / Linux:**
```bash
# Kill specific port
lsof -ti:3004 | xargs kill -9

# Or use the dev-reset script
./scripts/dev-reset.sh
```

**Windows (PowerShell):**
```powershell
$port = 3004
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
}
```

**Windows (Command Prompt):**
```cmd
FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :3004') DO TaskKill /PID %P /F
```

### Change Port (Not Recommended)

If you absolutely must use a different port:

1. Update `vite.config.js`:
```javascript
server: {
  port: 3005, // Change this
  // ...
}
```

2. Update documentation references
3. Update any hardcoded URLs
4. Inform your team

**Note**: Keeping port 3004 as standard ensures consistency across environments.

## Codespaces Port Forwarding

In GitHub Codespaces, port 3004 is automatically forwarded.

### View Forwarded Ports
1. Open "Ports" panel (View → Ports)
2. Port 3004 should be listed
3. Click globe icon to open in browser

### Make Port Public
By default, forwarded ports are private. To share:
1. Right-click port 3004
2. Select "Port Visibility" → "Public"

## Common Port Issues

### "Port already in use"

**Symptoms**:
```
Error: listen EADDRINUSE: address already in use :::3004
```

**Solution**:
```bash
./scripts/dev-reset.sh
```

Or manually kill the process (see above).

### "Cannot connect to localhost:3004"

**Check if server is running**:
```bash
# Should show the Vite dev server
ps aux | grep vite
```

**Check if port is listening**:
```bash
# macOS/Linux
lsof -i :3004

# Windows
netstat -ano | findstr :3004
```

**Restart server**:
```bash
npm run dev
```

### Browser shows "Connection Refused"

1. Verify server is running: `npm run dev`
2. Check correct port: http://localhost:3004
3. Check firewall isn't blocking port
4. Try 127.0.0.1:3004 instead of localhost

### Codespace port not accessible

1. Check port is forwarded (Ports panel)
2. Make port public if sharing
3. Use the Codespace URL, not localhost
4. Restart port forwarding:
   - Remove port 3004 from Ports panel
   - Restart dev server
   - Port should auto-forward

## Multiple Terminals

You can run multiple services:

**Terminal 1** - Frontend:
```bash
npm run dev
# Port 3004
```

**Terminal 2** - Backend (if needed):
```bash
cd backend
uvicorn app.main:app --reload --port 8000
# Port 8000
```

**Terminal 3** - Tests:
```bash
npm test
# No port (runs in-process)
```

## Docker / Containers

If running in Docker:

```yaml
# docker-compose.yml
services:
  frontend:
    ports:
      - "3004:3004"  # host:container
```

Ensure `-host 0.0.0.0` flag:
```bash
vite --host 0.0.0.0 --port 3004
```

## Network Access

### Access from other devices on network

The dev server runs on `0.0.0.0` (all interfaces):

```bash
npm run dev
# ➜  Local:   http://localhost:3004/
# ➜  Network: http://192.168.1.x:3004/
```

Access from phone/tablet using the Network URL.

### Firewall Rules

If can't access from network:
- macOS: System Preferences → Security & Privacy → Firewall
- Windows: Windows Defender Firewall → Allow an app
- Linux: `sudo ufw allow 3004`

## Quick Reference

| Service | Port | Command |
|---------|------|---------|
| Frontend Dev | 3004 | `npm run dev` |
| Backend API | 8000 | `cd backend && uvicorn app.main:app --reload` |
| Vite Preview | 4173 | `npm run preview` |

## Troubleshooting Commands

```bash
# Reset everything
./scripts/dev-reset.sh

# Check what's running
lsof -i :3004

# Kill port 3004
lsof -ti:3004 | xargs kill -9

# Verify server started
curl http://localhost:3004

# Check server logs
npm run dev # Look for "ready in Xms" message
```
