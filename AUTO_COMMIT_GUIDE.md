# 🤖 Auto-Commit & Auto-PR Setup

This project now has automatic commit and pull request creation configured.

## 🚀 How It Works

### 1. GitHub Actions Workflows

#### **Option A: Push-Triggered Auto-Commit** (`.github/workflows/auto-commit-pr.yml`)

- **Trigger:** Runs when you push to `main` branch
- **What it does:**
  - Detects any uncommitted changes
  - Creates a new timestamped branch
  - Commits all changes
  - Pushes to GitHub
  - Creates a pull request automatically

#### **Option B: Scheduled Watch** (`.github/workflows/watch-and-commit.yml`)

- **Trigger:** Runs every 30 minutes OR manually via GitHub Actions UI
- **What it does:**
  - Checks for uncommitted changes
  - If found, creates branch, commits, pushes, and opens PR
  - Labels PRs as `automated` and `scheduled`

### 2. Manual Scripts

#### **Quick Auto-Commit** (`auto-commit.sh`)

```bash
# Commit with auto-generated message
./auto-commit.sh

# Commit with custom message
./auto-commit.sh "feat: Add new feature"
```

#### **Continuous Watch** (`watch-and-commit.sh`)

```bash
# Watch current directory (checks every 5 minutes)
./watch-and-commit.sh

# Watch specific directory with custom interval (in seconds)
./watch-and-commit.sh ./src 120
```

## 📋 Setup Instructions

### Prerequisites

1. **GitHub Token Permissions**
   - Your repository must have Actions enabled
   - The `GITHUB_TOKEN` needs `contents: write` and `pull-requests: write` permissions (default in most repos)

2. **GitHub CLI (Optional for manual scripts)**

   ```bash
   # Install GitHub CLI if not already installed
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh

   # Authenticate
   gh auth login
   ```

### Enable the Workflows

1. **Commit and push these workflows:**

   ```bash
   git add .github/workflows/
   git commit -m "Add auto-commit workflows"
   git push origin main
   ```

2. **Verify workflows are enabled:**
   - Go to your GitHub repository
   - Click on "Actions" tab
   - You should see "Auto Commit and Create PR" and "Watch and Auto-Commit"

3. **Test manual trigger:**
   - Go to Actions → "Watch and Auto-Commit" → "Run workflow"

## ⚙️ Configuration

### Customize Workflow Schedule

Edit [.github/workflows/watch-and-commit.yml](.github/workflows/watch-and-commit.yml):

```yaml
schedule:
  - cron: '*/30 * * * *' # Every 30 minutes


  # Examples:
  # - cron: '0 * * * *'    # Every hour
  # - cron: '*/15 * * * *' # Every 15 minutes
  # - cron: '0 0 * * *'    # Daily at midnight
```

### Customize Commit Messages

Edit the workflow files to change auto-generated commit messages:

```yaml
git commit -m "🤖 Auto-commit: Updates from $(date '+%Y-%m-%d %H:%M:%S')"
```

### Change PR Labels

Edit workflow files:

```yaml
labels: |
  automated
  auto-pr
  bot-created  # Add custom labels
```

## 🎯 Usage Examples

### Scenario 1: Development Mode

You're actively developing and want changes auto-committed:

```bash
# Start the file watcher in a background terminal
./watch-and-commit.sh

# Make your changes...
# Every 5 minutes, changes are auto-committed and PR created
```

### Scenario 2: Quick Checkpoint

You want to quickly save your work:

```bash
./auto-commit.sh "WIP: Working on new feature"
```

### Scenario 3: Let GitHub Handle It

Just enable the scheduled workflow and forget about it:

- Make changes
- Push to main
- GitHub checks every 30 minutes and creates PRs if needed

## 🔒 Security Considerations

1. **Review PRs before merging** - Auto-commits might include sensitive data
2. **Use `.gitignore`** - Ensure sensitive files are excluded
3. **Branch protection** - Consider requiring reviews for auto-generated PRs:
   ```
   Settings → Branches → Add rule → Require pull request reviews
   ```

## 🛠️ Troubleshooting

### Workflow not running?

- Check Actions are enabled: `Settings → Actions → Allow all actions`
- Verify permissions: `Settings → Actions → Workflow permissions → Read and write`

### PR creation fails?

```bash
# Check GitHub CLI authentication
gh auth status

# Re-authenticate if needed
gh auth login
```

### Changes not detected?

```bash
# Verify git status
git status

# Check if files are staged
git diff --cached
```

## 📊 Monitoring

### View Auto-Commit Activity

```bash
# List all auto-commit branches
git branch -r | grep auto-update

# View recent auto-commits
git log --all --grep="Auto-commit" --oneline
```

### GitHub Actions Dashboard

- Navigate to Actions tab
- Filter by workflow name
- View run history and logs

## 🚫 Disable Auto-Commits

### Temporarily

```bash
# Disable scheduled workflow
# Go to Actions → Watch and Auto-Commit → "..." → Disable workflow
```

### Permanently

```bash
# Remove workflow files
rm .github/workflows/auto-commit-pr.yml
rm .github/workflows/watch-and-commit.yml
git commit -m "Disable auto-commits"
git push
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Cron Expression Reference](https://crontab.guru/)

---

**Note:** Auto-commits are powerful but should be used wisely. Always review changes before merging auto-generated PRs.
