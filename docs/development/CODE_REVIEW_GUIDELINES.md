# Code Review Guidelines

**Version**: 1.0  
**Last Updated**: 2025-12-27  
**Scope**: All code contributions to the Artisan platform

## Purpose

This document establishes standards for code reviews to maintain high code quality, consistency, and knowledge sharing across the development team.

## Review Process

### When to Request Review

- All pull requests require at least one approval
- Changes to critical paths require two approvals
- Emergency hotfixes can be merged with one approval + documentation

### Review Turnaround Time

- **Target**: 24 hours for first review
- **Complex PRs**: 48 hours acceptable
- **Urgent**: Tag with `urgent` label for same-day review

## What to Review

### 1. Functionality ✅

**Check**:
- [ ] Code does what the PR description says
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs
- [ ] Logic is sound and efficient

**Questions to Ask**:
- Does this solve the stated problem?
- What happens if inputs are null/undefined/invalid?
- Are there race conditions or timing issues?

### 2. Tests 🧪

**Check**:
- [ ] Tests are included for new features
- [ ] Tests cover happy path and edge cases
- [ ] Existing tests still pass
- [ ] Tests are readable and maintainable
- [ ] Test names clearly describe what they test

**Questions to Ask**:
- What would happen if this code broke?
- Are the most important behaviors tested?
- Can I understand what's being tested from the test name?

### 3. Code Quality 🎯

**Check**:
- [ ] Code follows project conventions
- [ ] No unnecessary complexity
- [ ] Variable/function names are clear
- [ ] Comments explain "why" not "what"
- [ ] No commented-out code
- [ ] No console.log statements (except in specific utils)

**Questions to Ask**:
- Can this be simplified?
- Would a junior developer understand this code?
- Is there duplication that could be extracted?

### 4. Performance ⚡

**Check**:
- [ ] No unnecessary re-renders (React)
- [ ] Expensive operations are memoized/cached
- [ ] Database queries are optimized (backend)
- [ ] Large data sets are paginated
- [ ] Images/assets are optimized

**Questions to Ask**:
- Will this scale to 10x the data?
- Are there unnecessary API calls?
- Could this cause memory leaks?

### 5. Security 🔒

**Check**:
- [ ] User inputs are validated
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Sensitive data is not logged
- [ ] Authentication/authorization is correct
- [ ] Dependencies are up to date

**Questions to Ask**:
- What if a malicious user sends bad data?
- Is any sensitive data exposed?
- Are permissions checked correctly?

### 6. Accessibility ♿

**Check**:
- [ ] Semantic HTML is used
- [ ] ARIA labels are present where needed
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible

**Questions to Ask**:
- Can this be used with a screen reader?
- Can this be navigated with keyboard only?
- Is the purpose of each element clear?

### 7. Documentation 📚

**Check**:
- [ ] PR description is clear
- [ ] Complex logic has comments
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Types/interfaces are documented

**Questions to Ask**:
- Would I understand this code in 6 months?
- Is there context that's missing?
- Are breaking changes documented?

## Review Comments

### Types of Comments

**1. Blocking Issues** (Must be fixed)
```markdown
**BLOCKING**: This will cause X error when Y happens.
```

**2. Suggestions** (Nice to have)
```markdown
**Suggestion**: Consider using `useMemo` here for better performance.
```

**3. Questions** (Seeking clarification)
```markdown
**Question**: Why do we need to check this twice?
```

**4. Praise** (Acknowledge good work)
```markdown
**Nice!** This is a clean solution to the problem.
```

### Writing Good Comments

**DO**:
- Be specific about the problem
- Suggest alternatives when possible
- Explain the "why" behind your feedback
- Acknowledge good patterns
- Ask questions to understand context

**DON'T**:
- Be vague ("This doesn't look right")
- Just point out problems without suggestions
- Nitpick formatting (use automated tools)
- Be condescending or harsh
- Assume malicious intent

### Example Comments

**Good**:
```markdown
**Suggestion**: This filter operation runs O(n²). Consider using a Set 
for O(n) lookup:

```javascript
const idSet = new Set(ids);
return items.filter(item => idSet.has(item.id));
```
```

**Bad**:
```markdown
This is slow.
```

**Good**:
```markdown
**Question**: I see we're fetching users twice here. Is there a reason 
we can't reuse the first result?
```

**Bad**:
```markdown
Why are you doing this?
```

## PR Size Guidelines

### Ideal PR Sizes

- **Small**: < 200 lines - Easy to review thoroughly
- **Medium**: 200-500 lines - Manageable in one sitting
- **Large**: 500-1000 lines - Break into multiple PRs if possible
- **Too Large**: > 1000 lines - Must be justified or split

### Large PRs

If you must create a large PR:
1. Provide extra detailed description
2. Add inline comments explaining sections
3. Consider recording a video walkthrough
4. Break into logical commits
5. List specific areas needing careful review

## Common Patterns to Watch For

### Anti-patterns

**1. Premature Optimization**
```javascript
// BAD: Micro-optimization before measuring
const sum = arr.reduce((a, b) => a + b, 0);

// GOOD: Clear and correct (optimize later if needed)
let sum = 0;
for (const num of arr) sum += num;
```

**2. Nested Ternaries**
```javascript
// BAD
const status = isActive ? isAdmin ? 'admin' : 'user' : 'inactive';

// GOOD
const status = !isActive ? 'inactive' 
             : isAdmin ? 'admin' 
             : 'user';
```

**3. Magic Numbers**
```javascript
// BAD
if (users.length > 100) { ... }

// GOOD
const MAX_USERS_PER_PAGE = 100;
if (users.length > MAX_USERS_PER_PAGE) { ... }
```

### Good Patterns

**1. Early Returns**
```javascript
// GOOD
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;
  
  return doProcessing(user);
}
```

**2. Descriptive Names**
```javascript
// GOOD
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const hasActiveSubscription = user => user.subscription?.status === 'active';
```

**3. Single Responsibility**
```javascript
// GOOD: Each function does one thing
function validateUser(user) { ... }
function saveUser(user) { ... }
function notifyUser(user) { ... }

function createUser(userData) {
  const user = validateUser(userData);
  saveUser(user);
  notifyUser(user);
  return user;
}
```

## Checklist for Reviewers

Before approving, ensure:

- [ ] PR description is clear and complete
- [ ] Tests pass in CI
- [ ] No linting errors
- [ ] Type checking passes
- [ ] Changes match the description
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Performance is acceptable
- [ ] Security is maintained
- [ ] Documentation is updated
- [ ] No breaking changes (or they're documented)
- [ ] Code is maintainable

## Checklist for Authors

Before requesting review:

- [ ] Self-review your changes
- [ ] Run tests locally
- [ ] Run linting/formatting
- [ ] Update documentation
- [ ] Add/update tests
- [ ] Write clear commit messages
- [ ] Fill out PR template completely
- [ ] Link related issues
- [ ] Add screenshots/videos for UI changes
- [ ] Consider breaking into smaller PRs

## Handling Disagreements

### If You Disagree with Feedback

1. **Understand**: Ask for clarification
2. **Explain**: Share your reasoning
3. **Discuss**: Have a conversation
4. **Escalate**: Involve a third party if needed
5. **Document**: Capture the decision

### Resolution Process

1. Discuss in PR comments
2. Jump on a call if needed
3. Involve tech lead if no consensus
4. Document the decision in code/ADR

## Review Response Times

### For Authors
- Respond to comments within 24 hours
- Push changes within 48 hours
- Re-request review after changes

### For Reviewers
- First review within 24 hours
- Follow-up reviews within 24 hours
- Approve promptly if all comments addressed

## Examples of Great PRs

### Example 1: Feature Addition

**Title**: "feat: Add skeleton loading components"

**Description**:
```markdown
## Summary
Implements comprehensive skeleton loading component library to fix failing tests 
and improve loading UX.

## Changes
- Created 6 skeleton component variants
- Fixed exports in components/index.js
- Removed duplicate skeleton.jsx file
- Updated 22 tests - all now passing

## Testing
- npm run test:run - all pass
- Verified dark mode support
- Tested responsiveness

## Screenshots
[Before/After screenshots]
```

### Example 2: Bug Fix

**Title**: "fix: Resolve race condition in lead scoring"

**Description**:
```markdown
## Problem
Lead scoring could return stale data when rapid updates occurred.

## Solution
Added request cancellation and debouncing to score calculations.

## Testing
- Added test for race condition scenario
- Verified fix in production-like environment
- No performance regression

## Related
Fixes #123
```

## Tools and Automation

### Available Tools
- **ESLint**: Catches code issues
- **Prettier**: Formats code
- **TypeScript**: Catches type errors
- **Vitest**: Runs tests
- **GitHub Actions**: Runs CI checks

### Before Requesting Review
```bash
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run type-check    # Check types
npm run test:run      # Run tests
npm run build         # Verify build works
```

## Continuous Improvement

This guide is living documentation:
- Suggest improvements via PR
- Share learnings from code reviews
- Update based on team feedback
- Review quarterly for relevance

## Resources

- [Google's Code Review Guidelines](https://google.github.io/eng-practices/review/)
- [Conventional Comments](https://conventionalcomments.org/)
- [Pull Request Size Study](https://www.microsoft.com/en-us/research/publication/modern-code-review-a-case-study-at-google/)

---

**Remember**: Code review is about improving code, not criticizing people. Be kind, be constructive, and assume good intent.
