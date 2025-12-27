# Developer Quick Start Guide

**Last Updated**: 2025-12-27  
**Audience**: New developers joining the Artisan platform

## Prerequisites

- **Node.js**: v20.x or higher
- **Python**: 3.11 or higher (for backend)
- **Git**: Latest version
- **IDE**: VS Code recommended (workspace settings included)

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Benji-dev-mvp/adventure.git
cd adventure

# Install frontend dependencies
npm install

# Setup backend (optional for frontend-only work)
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Verify Installation

```bash
# Check Node.js version
node --version  # Should be v20+

# Check npm version
npm --version

# Run type checking
npm run type-check  # Should pass with no errors

# Run tests
npm run test:run  # Should pass all tests
```

## Development Workflow

### Frontend Development

```bash
# Start development server (port 3004)
npm run dev

# The app will be available at:
# http://localhost:3004
```

### Backend Development (Optional)

```bash
cd backend
source .venv/bin/activate

# Start FastAPI server (port 8000)
python3 -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

# API will be available at:
# http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Running Both Simultaneously

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && source .venv/bin/activate
python3 -m uvicorn app.main:app --reload --port 8000
```

## Common Commands

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/__tests__/skeleton.test.jsx
```

### Code Quality

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format all code
npm run format

# Type checking
npm run type-check
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build output will be in dist/
```

## Project Structure Overview

```
adventure/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components (Button, Card, etc.)
│   │   ├── layout/               # Layout components (Header, Sidebar)
│   │   ├── campaigns/            # Campaign-related components
│   │   ├── leads/                # Lead management components
│   │   └── ...                   # Other feature components
│   ├── pages/                    # Route pages
│   ├── lib/                      # Utilities and helpers
│   │   ├── utils.js              # General utilities
│   │   ├── validation.js         # Form validation
│   │   ├── storage.js            # LocalStorage wrapper
│   │   └── performance.js        # Performance monitoring
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── __tests__/                # Test files
├── backend/                      # Python FastAPI backend
│   ├── app/
│   │   ├── api/routes/           # API endpoints
│   │   ├── core/                 # Core functionality (auth, db, config)
│   │   ├── models/               # Database models
│   │   └── services/             # Business logic
│   └── tests/                    # Backend tests
├── docs/                         # Documentation
├── e2e/                          # End-to-end tests (Playwright)
├── k8s/                          # Kubernetes manifests
├── helm/                         # Helm charts
└── .github/workflows/            # CI/CD pipelines
```

## Key Concepts

### Component Architecture

Components are organized by feature and complexity:
- **UI Components** (`src/components/ui/`): Reusable building blocks
- **Feature Components**: Domain-specific components
- **Page Components** (`src/pages/`): Top-level route components

### Styling

- **Framework**: Tailwind CSS
- **Component Library**: Custom components + Radix UI primitives
- **Dark Mode**: Supported via CSS classes
- **Responsive**: Mobile-first approach

### State Management

- **Local State**: React hooks (useState, useReducer)
- **Context**: For app-wide state (Toast, Theme)
- **Forms**: Controlled components with validation
- **Server State**: Ready for React Query integration

### Routing

- **Library**: React Router v7
- **Code Splitting**: Pages lazy-loaded with React.lazy
- **Routes**: Defined in `src/App.jsx`

### Testing

- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright
- **Coverage Goal**: ≥80% for critical paths

## Development Best Practices

### 1. Component Creation

```jsx
// Good: Functional component with proper types
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function MyComponent({ title, onSave }) {
  const [value, setValue] = useState('');

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <Button onClick={() => onSave(value)}>Save</Button>
    </div>
  );
}
```

### 2. Using Utilities

```jsx
// Import from centralized locations
import { cn } from '@/lib/utils';
import { validateEmail } from '@/lib/validation';
import { useToast } from '@/components/Toast';

function MyForm() {
  const toast = useToast();

  const handleSubmit = (email) => {
    if (!validateEmail(email)) {
      toast.error('Invalid email address');
      return;
    }
    toast.success('Email validated!');
  };
}
```

### 3. Loading States

```jsx
import { Skeleton, SkeletonTable } from '@/components';

function DataTable({ loading, data }) {
  if (loading) {
    return <SkeletonTable rows={5} columns={4} />;
  }

  return <Table data={data} />;
}
```

### 4. Error Handling

```jsx
import { ErrorBoundary } from '@/components';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Debugging

### Frontend Debugging

```bash
# Enable verbose logging
VITE_DEBUG=true npm run dev

# Check performance metrics
# Open browser console and look for:
# - Web Vitals logs
# - Performance measurements
# - Error boundary logs
```

### Backend Debugging

```bash
# Run with debug mode
uvicorn app.main:app --reload --log-level debug

# Or use Python debugger
python -m pdb -m uvicorn app.main:app --reload
```

### Common Issues

**Issue**: Port 3004 already in use
```bash
# Solution: Kill process or use different port
npx kill-port 3004
# or
PORT=3005 npm run dev
```

**Issue**: Module not found errors
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript errors in IDE
```bash
# Solution: Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## Git Workflow

### Branch Naming

```bash
# Feature branches
git checkout -b feature/add-campaign-analytics

# Bug fixes
git checkout -b fix/skeleton-component-exports

# Improvements
git checkout -b improve/performance-optimization
```

### Commit Messages

```bash
# Good commit messages
git commit -m "feat: Add skeleton loading components

- Implement SkeletonGroup, SkeletonCard, SkeletonTable
- Fix exports in components/index.js
- All tests passing"

# Use conventional commits
# feat: New feature
# fix: Bug fix
# docs: Documentation
# test: Tests
# refactor: Code refactoring
# perf: Performance improvement
```

### Before Pushing

```bash
# Run pre-push checks
npm run type-check
npm run lint
npm run test:run

# If all pass, you're good to push!
git push origin your-branch-name
```

## CI/CD

The project uses GitHub Actions for CI/CD:

- **On PR**: Runs tests, linting, builds
- **On Merge to Main**: Deploys to production
- **On Merge to Develop**: Deploys to staging

Check `.github/workflows/ci-cd.yml` for details.

## Resources

### Internal Documentation
- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](architecture/ARCHITECTURE.md) - System architecture
- [TECHNICAL_IMPROVEMENTS.md](TECHNICAL_IMPROVEMENTS.md) - Recent improvements

### External Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

## Getting Help

- **Code Questions**: Check the docs/ directory
- **Bugs**: Create an issue in GitHub
- **Features**: Discuss in team meetings
- **Architecture**: Review ADRs in docs/architecture/

## Quick Tips

1. **Hot Reload**: Vite has instant hot module replacement
2. **Type Hints**: Hover over code in VS Code for inline docs
3. **Component Explorer**: Check `src/pages/UIShowcase.jsx` for component demos
4. **Test Pattern**: Look at existing tests for examples
5. **Performance**: Use `npm run build` to check bundle sizes

## Next Steps

1. ✅ Complete this setup guide
2. Browse the component library in `/src/components`
3. Review a few test files to understand patterns
4. Check out the UI Showcase page
5. Pick a small task to get started
6. Ask questions early and often!

Happy coding! 🚀
