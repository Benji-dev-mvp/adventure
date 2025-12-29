# Quality Baseline - Sonar-Driven Convergence

**Generated:** 2025-12-29  
**Branch:** copilot/fix-frontend-ui-consistency  
**Mission:** Reduce Reliability + Maintainability issues while maintaining stability

---

## Current State (Baseline)

### Overall Metrics
- **Source Lines of Code:** ~107,000 LoC
- **Reliability Issues:** ~1,506
- **Maintainability Issues:** ~3,304
- **Security Hotspots:** ~234
- **Test Coverage:** ~1.8%
- **Total Issues to Address:** ~5,044

### Hard Gates (Must Pass Continuously)
- ✅ `npm run lint` - 0 errors
- ✅ `npm run typecheck` - 0 errors  
- ✅ `npm run build` - 0 errors
- ⚠️ Manual: Click every nav item → no crashes, no overlays (in progress)
- 🎯 New code must not increase Sonar issue count

---

## Phase 0: Baseline + Guardrails

### Objectives
1. ✅ Document current quality state
2. ⏳ Identify top 20 files by issue count
3. ⏳ Identify top 20 violated rules
4. ⏳ Establish batch tracking system
5. ⏳ Add CI quality gates

### Top Files by Issue Count
*To be populated after Sonar analysis*

| Rank | File | Reliability | Maintainability | Total | Notes |
|------|------|-------------|-----------------|-------|-------|
| 1 | TBD | TBD | TBD | TBD | Pending analysis |

### Top Violated Rules
*To be populated after Sonar analysis*

| Rank | Rule ID | Description | Count | Severity | Fix Priority |
|------|---------|-------------|-------|----------|--------------|
| 1 | TBD | TBD | TBD | TBD | TBD |

### Common TypeScript Error Patterns (From Recent Fixes)
| Error Code | Description | Count Fixed | Status |
|------------|-------------|-------------|---------|
| TS2307 | Cannot find module 'react' | 16 | ✅ Fixed |
| TS7026 | JSX element implicitly has type 'any' | Multiple | ✅ Fixed |
| TS6133 | Declared but never read | 9 | ✅ Fixed |
| TS2875 | JSX runtime path missing | Multiple | ✅ Fixed |

---

## Phase 1: Reliability Issues (Target: ~1,506)

### Bug Classes to Eliminate

#### 1. Invalid React Elements (Export/Import Mismatches)
**Pattern:** Default vs named export mismatches causing "element type is invalid" errors

**Action Items:**
- [ ] Audit all pages for consistent default exports
- [ ] Audit all components for consistent default exports  
- [ ] Normalize imports to match exports
- [ ] Add ESLint rule to prevent mismatches

**Batch Tracking:**
- Batch 1.1: Pages directory (estimated 50-100 issues)
- Batch 1.2: Components directory (estimated 100-200 issues)

#### 2. Objects Rendered as JSX Children
**Pattern:** Raw domain objects or arrays rendered directly causing "Objects are not valid as a React child"

**Action Items:**
- [ ] Add viewmodel/formatter layer for all domain objects
- [ ] Replace direct object rendering with formatted strings
- [ ] Add ESLint rule to detect object-in-JSX patterns

**Batch Tracking:**
- Batch 2.1: Dashboard/Analytics pages (estimated 50-100 issues)
- Batch 2.2: List/Table components (estimated 50-100 issues)

#### 3. Unsafe Null/Undefined Access
**Pattern:** Property access without null checks causing runtime errors

**Action Items:**
- [ ] Add optional chaining (?.) where appropriate
- [ ] Add null coalescing (??) for default values
- [ ] Add type guards for complex objects
- [ ] Add skeleton states for loading data

**Batch Tracking:**
- Batch 3.1: Data fetching components (estimated 100-200 issues)
- Batch 3.2: Nested object access (estimated 100-200 issues)

#### 4. Side Effects During Render
**Pattern:** setState, API calls, or other side effects directly in render body

**Action Items:**
- [ ] Move side effects to useEffect
- [ ] Move event handlers outside render
- [ ] Remove inline function definitions where possible

**Batch Tracking:**
- Batch 4.1: Large components (estimated 50-100 issues)

#### 5. React Hooks Violations
**Pattern:** Hooks called conditionally or in loops

**Action Items:**
- [ ] Refactor conditional hooks to top level
- [ ] Extract complex hook logic to custom hooks
- [ ] Enable react-hooks ESLint rules

**Batch Tracking:**
- Batch 5.1: Complex hooks usage (estimated 50-100 issues)

---

## Phase 2: Maintainability Issues (Target: ~3,304)

### Code Smell Categories

#### 1. Dead Code & Unused Modules
**Pattern:** Unused imports, variables, functions

**Action Items:**
- [ ] Run unused-exports analysis
- [ ] Remove unused imports (can be automated)
- [ ] Remove unused variables
- [ ] Remove commented-out code

**Batch Tracking:**
- Batch 6.1: Automated unused imports (estimated 200-400 issues)
- Batch 6.2: Dead functions/components (estimated 100-200 issues)

#### 2. Code Duplication
**Pattern:** Duplicate logic across files

**Action Items:**
- [ ] Identify duplicate components
- [ ] Extract shared utilities
- [ ] Consolidate similar pages

**Batch Tracking:**
- Batch 7.1: Duplicate components (estimated 100-200 issues)

#### 3. Layout Standardization
**Pattern:** Ad-hoc layouts, inconsistent spacing

**Action Items:**
- [x] PageScaffold component created ✅
- [x] SectionHeader component created ✅
- [ ] Migrate 53 pages to PageScaffold
- [ ] Remove legacy layout patterns

**Batch Tracking:**
- Batch 8.1: Revenue Engine pages (estimated 50-100 issues)
- Batch 8.2: Ops & Control pages (estimated 50-100 issues)
- Batch 8.3: Admin pages (estimated 50-100 issues)

#### 4. Theme Token Adoption
**Pattern:** Hardcoded hex colors, inconsistent theming

**Action Items:**
- [x] Theme token system created ✅
- [ ] Replace hardcoded colors with tokens
- [ ] Update chart color schemes
- [ ] Update badge color schemes

**Batch Tracking:**
- Batch 9.1: Core UI components (estimated 100-200 issues)
- Batch 9.2: Visualizations (estimated 50-100 issues)

#### 5. Component Complexity
**Pattern:** Large components with high cyclomatic complexity

**Action Items:**
- [ ] Extract pure subcomponents
- [ ] Reduce nested conditionals
- [ ] Simplify complex render logic

**Batch Tracking:**
- Batch 10.1: Dashboard components (estimated 50-100 issues)
- Batch 10.2: Large page components (estimated 50-100 issues)

---

## Phase 3: Security Hotspots (Target: ~234)

### Patterns to Review

#### 1. Unsafe HTML/Markdown
- [ ] Audit `dangerouslySetInnerHTML` usage
- [ ] Add sanitization where needed
- [ ] Review markdown rendering

#### 2. URL/Injection Risks
- [ ] Audit dynamic URL construction
- [ ] Validate user input in URLs
- [ ] Add XSS prevention where needed

#### 3. User Input Sanitization
- [x] Text input sanitization utility created ✅
- [ ] Apply to all user-facing inputs
- [ ] Apply to all text fields

**Batch Tracking:**
- Batch 11.1: Security hotspot review (estimated 50-100 issues)

---

## Phase 4: Minimal Regression Safety

### Smoke Test Coverage

**Playwright Tests to Add:**
- [ ] Top 15 route navigation tests
- [ ] Console error assertions
- [ ] Key UI element rendering checks
- [ ] CI integration

**Target:** Increase coverage to 10-15% with meaningful smoke tests (not unit test chasing)

---

## Batch Progress Tracking

### Completed Batches
| Batch | Description | Issues Fixed | Commit | Status |
|-------|-------------|--------------|--------|--------|
| 0.1 | TypeScript compilation fixes | 2785 errors → 0 | 3e4973d | ✅ Complete |
| 0.2 | Render safety infrastructure | N/A (preventive) | 73d4599 | ✅ Complete |
| 0.3 | Canvas crash fixes | 1 critical | d77948f | ✅ Complete |

### Planned Batches (Phase 1 - Reliability)
| Batch | Target Issues | Description | Est. Effort | Priority |
|-------|---------------|-------------|-------------|----------|
| 1.1 | 50-100 | Page export normalization | 2-3 hours | High |
| 1.2 | 100-200 | Component export normalization | 3-4 hours | High |
| 2.1 | 50-100 | Object-in-JSX fixes (dashboards) | 2-3 hours | High |
| 3.1 | 100-200 | Null safety (data fetching) | 3-4 hours | High |
| 4.1 | 50-100 | Side effect extraction | 2-3 hours | Medium |
| 5.1 | 50-100 | Hooks violations | 2-3 hours | Medium |

### Planned Batches (Phase 2 - Maintainability)
| Batch | Target Issues | Description | Est. Effort | Priority |
|-------|---------------|-------------|-------------|----------|
| 6.1 | 200-400 | Unused imports (automated) | 1-2 hours | High |
| 6.2 | 100-200 | Dead code removal | 2-3 hours | Medium |
| 8.1-8.3 | 150-300 | PageScaffold migration | 4-6 hours | High |
| 9.1-9.2 | 150-300 | Theme token adoption | 3-4 hours | Medium |

---

## Success Metrics

### Target Reduction Goals (3-Month Horizon)
- **Reliability Issues:** 1,506 → <500 (67% reduction)
- **Maintainability Issues:** 3,304 → <1,500 (55% reduction)
- **Security Hotspots:** 234 → <50 (79% reduction)
- **Test Coverage:** 1.8% → 10-15% (smoke tests)

### Weekly Milestones
- **Week 1:** Phase 0 complete, 200-300 issues fixed (batches 1.1, 1.2, 6.1)
- **Week 2:** 400-600 issues fixed (batches 2.1, 3.1, 8.1)
- **Week 3:** 600-800 issues fixed (batches 8.2, 8.3, 9.1)
- **Week 4:** 800-1000 issues fixed (batches 9.2, 10.1, 11.1)

### Quality Gates Per Batch
1. ✅ `npm run lint` passes
2. ✅ `npm run typecheck` passes
3. ✅ `npm run build` succeeds
4. ✅ Manual smoke test (key routes load)
5. ✅ Update this document with results
6. ✅ Commit and push

---

## CI/CD Integration Plan

### Required Checks (to be added)
```yaml
# .github/workflows/quality-gates.yml
- lint (must pass)
- typecheck (must pass)
- build (must pass)
- sonar-scan (informational, trends only)
- playwright-smoke (must pass, once implemented)
```

### PR Rules
- No merge if quality gates fail
- Sonar: New code must have 0 bugs/vulnerabilities
- Sonar: New code tech debt < 5% addition

---

## Notes & Observations

### What Works Well
- TypeScript strict mode catches many issues early
- Render safety utilities prevent entire classes of crashes
- Shared layout components enforce consistency

### What Needs Improvement
- Test coverage is too low for confident refactoring
- Many legacy patterns remain (pre-React 18)
- Duplication across similar pages
- Inconsistent error handling

### Lessons Learned
- Small batches (50-200 issues) are manageable
- Always verify build after each batch
- Automated fixes (unused imports) are quick wins
- Manual fixes (component refactoring) take longer

---

## Changelog

### 2025-12-29
- Initial baseline document created
- Phase 0 objectives defined
- Batch tracking structure established
- Success metrics defined
