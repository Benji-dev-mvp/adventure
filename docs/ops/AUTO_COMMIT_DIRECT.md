# ⚡ Auto-Commit System - Direct to Main (Every 5 Minutes)

## 🎯 What Changed

Your auto-commit system now:

- ✅ **Runs every 5 minutes** (instead of 30)
- ✅ **Commits directly to `main`** (no PRs needed)
- ✅ **Monitors specific folders only** (`src/`, `backend/`, `.github/`, `public/`, `docs/`)
- ✅ **Fully automated** - no manual intervention required

## 🚀 How It Works

Every 5 minutes, GitHub Actions:

1. Checks for changes in monitored folders
2. If changes found → commits directly to `main`
3. If no changes → waits for next check

**You don't need to do anything!** Just work normally and changes are auto-saved.

## 📁 Monitored Folders

Currently watching:

- `src/` - Frontend source code
- `backend/` - Backend API and services
- `.github/` - GitHub workflows and configs
- `public/` - Public assets
- `docs/` - Documentation files

### Customize Monitored Folders

Edit `.autocommit.config`:

```bash
# Change this line to watch different folders
WATCH_FOLDERS="src/ backend/ .github/ public/ docs/"

# Example: Watch only src and backend
# WATCH_FOLDERS="src/ backend/"
```

Or edit `.github/workflows/watch-and-commit.yml` directly:

```yaml
# Line ~37: Update WATCH_PATHS
WATCH_PATHS="src/ backend/ .github/ public/ docs/"
```

## ⏱️ Customize Schedule

### Change Frequency

Edit `.github/workflows/watch-and-commit.yml`:

```yaml
schedule:
  - cron: '*/5 * * * *' # Current: Every 5 minutes
```

**Common schedules:**

```yaml
# Every 5 minutes (current)
- cron: '*/5 * * * *'

# Every 10 minutes
- cron: '*/10 * * * *'

# Every 15 minutes
- cron: '*/15 * * * *'

# Every 30 minutes
- cron: '*/30 * * * *'

# Every hour
- cron: '0 * * * *'

# Every 2 hours
- cron: '0 */2 * * *'
```

**Learn cron syntax:** [crontab.guru](https://crontab.guru/)

## 🎮 Manual Controls

### Manual Commit (Anytime)

```bash
# Commit all changes now
./auto-commit.sh

# With custom message
./auto-commit.sh "feat: Add new feature"
```

### Trigger Workflow Manually

1. Go to GitHub → Actions tab
2. Select "Auto-Commit to Main (Every 5 Min)"
3. Click "Run workflow"

### Check Workflow Status

```bash
# View recent workflow runs
gh run list --workflow="watch-and-commit.yml"

# View specific run details
gh run view <run-id>
```

## 🔍 What Gets Committed

**Included:**

- Changes in monitored folders (`src/`, `backend/`, etc.)
- New files in monitored folders
- Deleted files in monitored folders
- Modified files in monitored folders

**Excluded:**

- Files in `.gitignore`
- Changes outside monitored folders
- Files already committed
- Empty changes

## 📊 Commit Messages

Auto-generated format:

```
🤖 Auto-commit: 2025-12-29 13:45:00 UTC
```

### Customize Commit Message

**Option 1: In workflow file** (`.github/workflows/watch-and-commit.yml`)

```yaml
# Line ~50: Change this
COMMIT_MSG="🤖 Auto-commit: $(date '+%Y-%m-%d %H:%M:%S UTC')"

# Examples:
# COMMIT_MSG="🔄 Auto-save: $(date '+%H:%M')"
# COMMIT_MSG="💾 Checkpoint: $(date)"
# COMMIT_MSG="🚀 Auto-update"
```

**Option 2: Manual trigger with custom message**

```bash
# GitHub Actions UI → Run workflow → Enter custom message
```

## 🛡️ Safety Features

✅ **Only monitored folders** - Other files stay untouched
✅ **Respects `.gitignore`** - Sensitive files never committed
✅ **Pull before push** - Handles concurrent edits
✅ **Graceful failures** - Won't break if nothing to commit

## 📈 View Activity

### Recent Auto-Commits

```bash
# See recent auto-commits
git log --grep="Auto-commit" --oneline -10

# View details of last auto-commit
git log --grep="Auto-commit" -1 --stat
```

### GitHub Activity

- Go to repository → Commits
- Look for commits by `github-actions[bot]`
- Filter by commit message: "Auto-commit"

## 🔧 Troubleshooting

### Workflow not running?

```bash
# Check if workflows are enabled
# GitHub → Settings → Actions → Allow all actions

# Check workflow file syntax
gh workflow view "watch-and-commit.yml"
```

### Changes not being committed?

1. **Check if folder is monitored:** Add to `WATCH_PATHS` if needed
2. **Check .gitignore:** File might be excluded
3. **Check Actions logs:** GitHub → Actions → Latest run
4. **Verify schedule:** Wait 5 minutes or trigger manually

### Too many commits?

```bash
# Increase interval in .github/workflows/watch-and-commit.yml
# Change from */5 to */10 or */15
cron: '*/10 * * * *'  # Every 10 minutes instead
```

## ⚠️ Important Notes

### Direct to Main

- Changes go **directly to main branch**
- No pull requests created
- No approval process
- Instant deployment (if auto-deploy enabled)

### Best Practices

1. **Review commits regularly** - Check what's being auto-committed
2. **Use .gitignore** - Exclude sensitive/temporary files
3. **Monitor Actions logs** - Watch for errors
4. **Customize folders** - Only watch what you need

### When NOT to Use

- Production repos requiring code review
- Repos with strict commit standards
- Sensitive projects requiring manual approval
- Teams with specific branching strategies

## 🎯 Quick Reference

| Action                  | Command/Location                                     |
| ----------------------- | ---------------------------------------------------- |
| **Change schedule**     | Edit `.github/workflows/watch-and-commit.yml` line 5 |
| **Change folders**      | Edit `.autocommit.config` or workflow line 37        |
| **Manual commit**       | `./auto-commit.sh`                                   |
| **Disable auto-commit** | GitHub → Actions → Disable workflow                  |
| **View logs**           | GitHub → Actions → Latest run                        |
| **Config file**         | `.autocommit.config`                                 |

## 📚 Configuration Files

```
.autocommit.config                          # High-level config
.github/workflows/watch-and-commit.yml      # Workflow definition
.gitignore                                  # Excluded files
```

## 🆘 Need Help?

1. **Full Guide:** [AUTO_COMMIT_GUIDE.md](AUTO_COMMIT_GUIDE.md)
2. **Implementation Details:** [AUTO_COMMIT_IMPLEMENTATION.md](AUTO_COMMIT_IMPLEMENTATION.md)
3. **GitHub Actions Docs:** [docs.github.com/actions](https://docs.github.com/en/actions)
4. **Cron Syntax:** [crontab.guru](https://crontab.guru/)

---

**Status:** ✅ Active - Running every 5 minutes
**Mode:** Direct to main (no PRs)
**Folders:** `src/`, `backend/`, `.github/`, `public/`, `docs/`
**Last Updated:** December 29, 2025
