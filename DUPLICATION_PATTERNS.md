# Identified Code Duplication Patterns

This document catalogs the specific code duplication and inefficiency patterns identified in the codebase, with concrete examples and solutions.

## Backend Duplication Patterns

### Pattern 1: Identical Error Handling (50+ instances)

**Location**: `backend/app/api/routes/*.py`

**Duplication Example**:
```python
# Found in ai_advanced.py, advanced_features.py, enrichment.py, etc.
try:
    result = await some_operation()
    return result
except Exception as e:
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Operation failed: {str(e)}"
    )
```

**Impact**: 
- ~200 lines of duplicate code across 30+ route files
- Inconsistent error messages
- No centralized logging

**Solution**: Use `@handle_api_errors` decorator

---

### Pattern 2: Permission Checking (15+ instances)

**Location**: `backend/app/api/routes/admin.py`, `approval_workflow.py`, etc.

**Duplication Example**:
```python
# Repeated in every admin endpoint
if current_user.role != "admin":
    raise HTTPException(
        status_code=403,
        detail="Insufficient permissions"
    )
```

**Solution**: Use `@require_permission("admin")` decorator

---

### Pattern 3: Not Found Checking (30+ instances)

**Location**: Most route files

**Duplication Example**:
```python
resource = session.get(Resource, resource_id)
if not resource:
    raise HTTPException(status_code=404, detail="Resource not found")
return resource
```

**Solution**: Use `@handle_not_found("Resource")` decorator

---

## Frontend Duplication Patterns

### Pattern 4: Manual State Management (187+ instances)

**Location**: `src/pages/*.jsx`

**Duplication Example**:
```javascript
// Repeated in AIAssistant.jsx, Dashboard.jsx, Leads.jsx, etc.
const [leads, setLeads] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchLeads();
}, []);
```

**Impact**:
- 187+ useState declarations
- 41+ useEffect hooks doing similar data fetching
- Inconsistent error handling

**Solution**: Use `useLeads()`, `useCampaigns()`, `useAI()` hooks

---

### Pattern 5: Form Field Boilerplate (50+ instances)

**Location**: `src/pages/CampaignBuilder.jsx`, `Settings.jsx`, `Onboarding.jsx`, etc.

**Duplication Example**:
```javascript
// Repeated for every form field
<div className="space-y-2">
  <label htmlFor="fieldName" className="block text-sm font-medium">
    Field Label
  </label>
  <input
    id="fieldName"
    type="text"
    value={fieldName}
    onChange={(e) => setFieldName(e.target.value)}
    className="w-full px-3 py-2 border rounded-md..."
  />
  {errors.fieldName && (
    <p className="text-sm text-red-600">{errors.fieldName}</p>
  )}
</div>
```

**Impact**:
- ~1500 lines of repetitive form code
- Inconsistent styling
- Missing accessibility features

**Solution**: Use `<FormField>`, `<FormSelect>`, `<FormCheckbox>` components

---

### Pattern 6: Uncached API Calls (100+ instances)

**Location**: Throughout `src/pages/*.jsx` and `src/components/*.jsx`

**Duplication Example**:
```javascript
// Same request made multiple times
const data1 = await fetch('/api/leads').then(r => r.json());
// ... later in same session
const data2 = await fetch('/api/leads').then(r => r.json()); // Duplicate!
```

**Impact**:
- Redundant API calls (estimated 50-80% waste)
- Slower performance
- Higher server load

**Solution**: Use `optimizedRequest()` with automatic caching

---

### Pattern 7: Manual Search Debouncing (20+ instances)

**Location**: Search components throughout the app

**Duplication Example**:
```javascript
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    performSearch(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

**Solution**: Use `useDebounce()` hook

---

### Pattern 8: Manual Pagination Logic (10+ instances)

**Location**: List views (Leads.jsx, Campaigns.jsx, etc.)

**Duplication Example**:
```javascript
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 20;
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedData = data.slice(startIndex, endIndex);
const totalPages = Math.ceil(data.length / pageSize);
```

**Solution**: Use `usePagination()` hook

---

### Pattern 9: Expensive Computations Without Memoization

**Location**: `src/pages/Dashboard.jsx`, `Analytics.jsx`, etc.

**Duplication Example**:
```javascript
// Recalculated on every render
const sortedLeads = leads.sort((a, b) => b.score - a.score);
const filteredLeads = sortedLeads.filter(l => l.status === 'hot');
const topLeads = filteredLeads.slice(0, 10);
```

**Impact**:
- Unnecessary recalculations on every render
- Poor performance with large datasets

**Solution**: Use `useMemo()` or `useSortedArray()`, `useFilteredArray()` hooks

---

## Performance Inefficiencies

### Inefficiency 1: No Request Deduplication

**Problem**: Multiple components requesting same data simultaneously

```javascript
// Component A
const leads = await fetch('/api/leads');

// Component B (mounted at same time)
const leads = await fetch('/api/leads'); // Duplicate request!
```

**Solution**: `optimizedRequest()` tracks in-flight requests and deduplicates

---

### Inefficiency 2: No Response Caching

**Problem**: Same GET requests made repeatedly

```javascript
// User navigates: Dashboard → Leads → Dashboard
// Each time: new API call for same data
```

**Solution**: `optimizedRequest()` caches GET responses for 5 minutes

---

### Inefficiency 3: Unthrottled Event Handlers

**Problem**: Event handlers called too frequently

```javascript
window.addEventListener('resize', () => {
  // Called hundreds of times during resize
  updateLayout();
});
```

**Solution**: Use `useThrottle()` hook

---

### Inefficiency 4: No Lazy Loading

**Problem**: All components render immediately, even off-screen

```javascript
return (
  <div>
    {/* All rendered at once, even if user never scrolls */}
    {items.map(item => <ExpensiveComponent item={item} />)}
  </div>
);
```

**Solution**: Use `useIntersectionObserver()` for lazy loading

---

## Specific File Analysis

### Top 10 Files by Duplication Potential

1. **src/pages/AIAssistant.jsx** (1040 lines)
   - 15+ useState declarations
   - Manual state management
   - No memoization
   - **Potential reduction**: 30-40%

2. **src/pages/Templates.jsx** (710 lines)
   - Repeated form fields
   - Manual validation
   - **Potential reduction**: 40-50%

3. **src/pages/Settings.jsx** (678 lines)
   - 20+ form fields without components
   - Manual state management
   - **Potential reduction**: 50-60%

4. **src/pages/Dashboard.jsx** (588 lines)
   - Multiple uncached API calls
   - Expensive computations without memo
   - **Potential reduction**: 30-40%

5. **backend/app/api/routes/ai_advanced.py** (477 lines → 345 after refactor)
   - Already refactored: **28% reduction**

6. **backend/app/api/routes/admin.py** (~200 lines)
   - 15+ permission checks
   - 10+ try-except blocks
   - **Potential reduction**: 40-50%

7. **backend/app/api/routes/ab_testing.py** (~300 lines)
   - 8+ try-except blocks
   - 5+ not found checks
   - **Potential reduction**: 30-40%

8. **backend/app/api/routes/autonomous.py** (~300 lines)
   - 10+ error handling blocks
   - **Potential reduction**: 30-40%

9. **backend/app/api/routes/battle_cards.py** (~250 lines)
   - Repeated error patterns
   - **Potential reduction**: 30-40%

10. **src/pages/CampaignBuilder.jsx** (572 lines)
    - Multiple form sections
    - Manual validation
    - **Potential reduction**: 40-50%

---

## Recommended Refactoring Priority

### Phase 1: High Impact, Low Risk (Completed ✓)
1. ✓ Backend error handling decorator
2. ✓ Frontend custom hooks (useLeads, useCampaigns, useAI)
3. ✓ Request optimization with caching
4. ✓ Form components
5. ✓ Performance hooks

### Phase 2: High Impact, Medium Risk
1. Refactor all backend routes to use error decorators (est. 5-8 hours)
2. Migrate Dashboard.jsx to use custom hooks (est. 2-3 hours)
3. Migrate Settings.jsx to use form components (est. 3-4 hours)
4. Add memoization to large list components (est. 2-3 hours)

### Phase 3: Medium Impact, Low Risk
1. Split AIAssistant.jsx into smaller components (est. 4-6 hours)
2. Add lazy loading to list views (est. 2-3 hours)
3. Implement virtual scrolling for large lists (est. 3-4 hours)
4. Add error boundaries (est. 1-2 hours)

### Phase 4: Long-term Improvements
1. Create shared context for global state
2. Implement service workers for offline support
3. Add database indexes (backend)
4. Implement GraphQL for efficient data fetching
5. Add code splitting and dynamic imports

---

## Metrics & Goals

### Current State
- Backend route files: 30+
- Lines with duplicate try-catch: ~200+
- Frontend useState declarations: 187+
- Frontend useEffect hooks: 41+
- Uncached API calls: ~100+ potential duplicates

### After Phase 1 (Completed)
- ✓ Backend duplicate code eliminated: ~90 lines in ai_advanced.py (28% reduction)
- ✓ Frontend hooks created: 3 major hooks
- ✓ Form components created: 5 reusable components
- ✓ Performance hooks created: 10+ optimization hooks
- ✓ Caching implemented: Request-level and AI-level

### After Phase 2 (Target)
- Backend duplicate code eliminated: ~300+ lines (40% reduction in routes)
- Frontend duplicate code eliminated: ~2000+ lines (50% reduction in forms/state)
- API calls reduced: 60-80%
- Render performance improved: 30-50%

### After Phase 3 (Target)
- Large components split: 5-10 components
- Initial load time: 40-60% faster
- Scroll performance: 90% improvement for large lists

---

## Measuring Success

### Automated Metrics
```bash
# Count try-except blocks (should decrease)
grep -r "except Exception" backend/app/api/routes/*.py | wc -l

# Count useState declarations (should decrease)
grep -rn "useState" src/pages/*.jsx | wc -l

# Count FormField usage (should increase)
grep -rn "FormField" src/pages/*.jsx | wc -l
```

### Manual Testing
- [ ] API call count reduced (check Network tab)
- [ ] Cache hit rate >70% (check console with getCacheStats())
- [ ] Form field code reduced by 70%
- [ ] Error handling consistent across all endpoints

---

## Conclusion

We've identified and addressed major duplication patterns:

1. **Backend**: 200+ lines of duplicate error handling
2. **Frontend**: 187+ duplicate state management patterns
3. **Forms**: 1500+ lines of repetitive form code
4. **Performance**: 100+ uncached API calls

Phase 1 is complete with all core utilities created. The remaining phases involve migrating existing code to use these new patterns.

**Estimated Total Impact**:
- Code reduction: 30-50% across affected files
- Performance improvement: 40-80% for cached operations
- Maintainability: Significantly improved with consistent patterns
