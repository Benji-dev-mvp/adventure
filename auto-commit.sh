#!/bin/bash
# Auto-commit and create PR script
# Usage: ./auto-commit.sh [commit-message]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Auto-commit and PR Creation Script${NC}"
echo "========================================"

# Check if there are any changes
if [[ -z $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    exit 0
fi

# Get commit message from argument or use default
COMMIT_MSG="${1:-🤖 Auto-commit: Updates from $(date '+%Y-%m-%d %H:%M:%S')}"

# Generate branch name with timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRANCH_NAME="auto-update-${TIMESTAMP}"

echo -e "${GREEN}✓${NC} Creating branch: ${BRANCH_NAME}"
git checkout -b ${BRANCH_NAME}

echo -e "${GREEN}✓${NC} Staging all changes (new, modified, deleted)..."
git add -A .

echo -e "${GREEN}✓${NC} Committing with message: ${COMMIT_MSG}"
git commit -m "${COMMIT_MSG}"

echo -e "${GREEN}✓${NC} Pushing to remote..."
git push origin ${BRANCH_NAME}

# Try to create PR using GitHub CLI if available
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓${NC} Creating pull request..."
    gh pr create \
        --title "🤖 Auto-generated PR: Updates from $(date '+%Y-%m-%d')" \
        --body "## Automated Changes

This PR was automatically generated.

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Branch:** \`${BRANCH_NAME}\`

### Changes
$(git diff HEAD~1 --stat)

### Action Required
- [ ] Review the changes
- [ ] Merge if changes look good
- [ ] Close if this was triggered by mistake

---
*This PR was created automatically*" \
        --label "automated,auto-pr" \
        --base main
    
    echo -e "${GREEN}✅ Pull request created successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) not found. Branch pushed but PR not created.${NC}"
    echo -e "${BLUE}ℹ️  Install GitHub CLI: https://cli.github.com/${NC}"
    echo -e "${BLUE}ℹ️  Or create PR manually at: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/compare/main...${BRANCH_NAME}${NC}"
fi

echo -e "${GREEN}✅ Done!${NC}"
