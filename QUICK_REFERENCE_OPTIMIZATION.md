# Quick Reference: Code Optimization Patterns

Quick reference for using the new optimization utilities.

## Backend: Error Handling

### Basic Error Handling
```python
from app.core.error_handling import handle_api_errors

@router.post("/endpoint")
@handle_api_errors(error_prefix="Operation failed")
async def my_endpoint(request):
    result = await operation()
    return result
```

### Not Found Handling
```python
from app.core.error_handling import handle_not_found

@router.get("/resource/{id}")
@handle_not_found("Resource")
async def get_resource(id: int):
    resource = db.get(id)
    if not resource:
        raise ValueError(f"Resource {id} not found")
    return resource
```

### Permission Checking
```python
from app.core.error_handling import require_permission

@router.delete("/user/{id}")
@require_permission("admin")
async def delete_user(id: int, current_user: User = Depends(get_current_user)):
    # Only admin can access
    return db.delete(id)
```

---

## Frontend: Custom Hooks

### Lead Management
```javascript
import { useLeads } from '../hooks/useLeads';

const { leads, loading, error, updateStatus, search, refetch } = useLeads();

// Search leads
search('SaaS');

// Update status
await updateStatus(leadId, 'hot');
```

### Campaign Management
```javascript
import { useCampaigns } from '../hooks/useCampaigns';

const { campaigns, loading, save, getDraft } = useCampaigns();

// Save campaign
await save({ id: 1, name: 'Q1 Outreach' });

// Get draft
const draft = getDraft('campaign-1');
```

### AI Operations
```javascript
import { useAI } from '../hooks/useAI';

const { chat, scoreLead, generateEmail, loading, stats } = useAI();

// Chat (cached automatically)
const response = await chat('Generate email template');

// Score lead (cached)
const score = await scoreLead(lead);

// Generate email (not cached by default)
const email = await generateEmail(lead, prompt, 'professional', 'medium');
```

---

## Frontend: Optimized Requests

### Basic Usage
```javascript
import { optimizedRequest } from '../lib/optimizedRequest';

// GET request (cached automatically)
const leads = await optimizedRequest('/api/leads');

// POST request (not cached)
const result = await optimizedRequest('/api/campaigns', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Batch Requests
```javascript
import { batchRequests } from '../lib/optimizedRequest';

const [leads, campaigns, analytics] = await batchRequests([
  { path: '/api/leads' },
  { path: '/api/campaigns' },
  { path: '/api/analytics' }
]);
```

### Debounced Requests (Search)
```javascript
import { debouncedRequest } from '../lib/optimizedRequest';

const results = await debouncedRequest('/api/search', {
  method: 'POST',
  body: JSON.stringify({ query: searchTerm })
}, 300); // 300ms delay
```

### Cache Management
```javascript
import { clearCache, getCacheStats } from '../lib/optimizedRequest';

// Clear specific path
clearCache('/api/leads');

// Clear all cache
clearCache();

// Get statistics
const stats = getCacheStats();
// { totalEntries: 15, validEntries: 12, expiredEntries: 3, inflightRequests: 2 }
```

---

## Frontend: Form Components

### Basic Form Field
```javascript
import { FormField } from '../components/forms/FormComponents';

<FormField
  label="Campaign Name"
  name="name"
  value={name}
  onChange={e => setName(e.target.value)}
  error={errors.name}
  required
  placeholder="Enter campaign name"
  helpText="Choose a descriptive name"
/>
```

### Select Field
```javascript
import { FormSelect } from '../components/forms/FormComponents';

<FormSelect
  label="Campaign Type"
  name="type"
  value={type}
  onChange={e => setType(e.target.value)}
  options={[
    { value: 'email', label: 'Email' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'sms', label: 'SMS' }
  ]}
  error={errors.type}
  required
/>
```

### Checkbox
```javascript
import { FormCheckbox } from '../components/forms/FormComponents';

<FormCheckbox
  label="Enable auto-follow-up"
  name="autoFollowUp"
  checked={autoFollowUp}
  onChange={e => setAutoFollowUp(e.target.checked)}
  helpText="Automatically send follow-up emails"
/>
```

### Complete Form
```javascript
import { Form, FormGroup, FormField } from '../components/forms/FormComponents';

<Form onSubmit={handleSubmit}>
  <FormGroup
    title="Basic Information"
    description="Enter the campaign details"
  >
    <FormField label="Name" name="name" ... />
    <FormField label="Objective" name="objective" multiline rows={4} ... />
  </FormGroup>
  
  <FormGroup title="Targeting">
    <FormSelect label="Audience" name="audience" ... />
  </FormGroup>
  
  <button type="submit">Create Campaign</button>
</Form>
```

---

## Frontend: Performance Hooks

### Debounce
```javascript
import { useDebounce } from '../hooks/usePerformance';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Throttle
```javascript
import { useThrottle } from '../hooks/usePerformance';

const throttledSave = useThrottle(saveData, 1000);

// Can only be called once per second
<button onClick={throttledSave}>Save</button>
```

### Pagination
```javascript
import { usePagination } from '../hooks/usePerformance';

const { data, currentPage, totalPages, nextPage, prevPage, goToPage } = 
  usePagination(leads, 20);

return (
  <div>
    {data.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
    <span>Page {currentPage} of {totalPages}</span>
    <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
  </div>
);
```

### Memoized Computation
```javascript
import { useMemoizedComputation } from '../hooks/usePerformance';

const expensiveResult = useMemoizedComputation(
  () => performComplexCalculation(data),
  [data]
);
```

### Filtered Array
```javascript
import { useFilteredArray } from '../hooks/usePerformance';

const hotLeads = useFilteredArray(
  leads,
  lead => lead.status === 'hot',
  [leads]
);
```

### Sorted Array
```javascript
import { useSortedArray } from '../hooks/usePerformance';

const sortedLeads = useSortedArray(
  leads,
  (a, b) => b.score - a.score,
  [leads]
);
```

### Intersection Observer (Lazy Loading)
```javascript
import { useIntersectionObserver } from '../hooks/usePerformance';

const [ref, isVisible] = useIntersectionObserver();

return (
  <div ref={ref}>
    {isVisible && <ExpensiveComponent />}
  </div>
);
```

### Window Size (Responsive)
```javascript
import { useWindowSize } from '../hooks/usePerformance';

const { width, height } = useWindowSize();

return (
  <div>
    {width > 768 ? <DesktopView /> : <MobileView />}
  </div>
);
```

### Previous Value
```javascript
import { usePrevious } from '../hooks/usePerformance';

const prevCount = usePrevious(count);

useEffect(() => {
  console.log(`Count changed from ${prevCount} to ${count}`);
}, [count]);
```

### Local Storage
```javascript
import { useLocalStorage } from '../hooks/usePerformance';

const [theme, setTheme] = useLocalStorage('theme', 'light');

// Automatically syncs across tabs
<button onClick={() => setTheme('dark')}>Dark Mode</button>
```

---

## Common Patterns

### Loading State with Error Handling
```javascript
const { data, loading, error, refetch } = useLeads();

if (loading) return <Spinner />;
if (error) return <Error message={error} onRetry={refetch} />;
return <LeadsList leads={data} />;
```

### Search with Debouncing
```javascript
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 500);
const { leads, loading } = useLeads(debouncedQuery);

return (
  <>
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search leads..."
    />
    {loading ? <Spinner /> : <LeadsList leads={leads} />}
  </>
);
```

### Paginated List
```javascript
const { leads } = useLeads();
const { data, currentPage, totalPages, nextPage, prevPage } = 
  usePagination(leads, 20);

return (
  <>
    <LeadsList leads={data} />
    <Pagination
      current={currentPage}
      total={totalPages}
      onNext={nextPage}
      onPrev={prevPage}
    />
  </>
);
```

### Form with Validation
```javascript
import { Form, FormField } from '../components/forms/FormComponents';
import { validateRequired, validateEmail } from '../lib/validation';

const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!validateRequired(name)) {
    newErrors.name = 'Name is required';
  }
  if (!validateEmail(email)) {
    newErrors.email = 'Invalid email';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    // Submit form
  }
};

return (
  <Form onSubmit={handleSubmit}>
    <FormField
      label="Name"
      name="name"
      value={name}
      onChange={e => setName(e.target.value)}
      error={errors.name}
      required
    />
    <FormField
      label="Email"
      name="email"
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      error={errors.email}
      required
    />
    <button type="submit">Submit</button>
  </Form>
);
```

---

## Performance Tips

### ✅ Do's
- Use `optimizedRequest()` for all API calls
- Debounce search inputs with `useDebounce()`
- Paginate lists with >50 items
- Memoize expensive computations
- Use lazy loading for off-screen content
- Cache AI operations
- Use form components for consistency

### ❌ Don'ts
- Don't use raw `fetch()` - use `optimizedRequest()`
- Don't fetch same data multiple times - use cache
- Don't render 1000+ items at once - use pagination
- Don't recalculate on every render - use memoization
- Don't add event listeners without throttling
- Don't duplicate form field code - use components

---

## Migration Checklist

### Backend Route
- [ ] Import `handle_api_errors` decorator
- [ ] Remove try-except blocks
- [ ] Add decorator to endpoint
- [ ] Test endpoint works correctly

### Frontend Component
- [ ] Replace manual state with custom hooks
- [ ] Replace raw fetch with optimizedRequest
- [ ] Replace form fields with FormField components
- [ ] Add debouncing to search inputs
- [ ] Add pagination to large lists
- [ ] Add memoization to expensive operations

---

## Questions?

See full documentation:
- `CODE_OPTIMIZATION_GUIDE.md` - Complete guide with examples
- `DUPLICATION_PATTERNS.md` - Catalog of all patterns
