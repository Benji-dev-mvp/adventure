# Artisan - AI BDR SaaS Platform

![CI Status](https://github.com/Benji-dev-mvp/adventure/actions/workflows/ci.yml/badge.svg)
![CD Status](https://github.com/Benji-dev-mvp/adventure/actions/workflows/cd.yml/badge.svg)

A production-ready AI Business Development Representative (BDR) platform built with React, featuring Ava - an intelligent AI assistant that automates outbound sales workflows.

## Features

### 🤖 AI Assistant - Ava
- Intelligent conversational AI assistant
- Real-time chat interface with prompt templates
- Multi-tone content generation (Professional, Casual, Enthusiastic)
- Smart lead personalization based on company data

### 📧 Multi-Channel Outreach
- **Email**: Personalized email campaigns with A/B testing
- **LinkedIn**: Direct message sequences with engagement tracking
- **SMS**: Short-form messaging with character optimization
- **Calls**: Automated call scripts with tone guidance

### 🎯 Campaign Builder (Production Ready)
- Drag-and-drop sequence builder
- Multi-channel campaign orchestration
- AI-powered content generation
- Delay scheduling between touchpoints
- **Auto-save with 30-second draft persistence**
- **Form validation and error handling**
- **Real-time campaign launch with success notifications**

### 👥 Lead Management
- 300M+ B2B database integration simulation
- Advanced lead scoring (0-100 scale)
- Intent signal detection (hot/warm/cold status)
- Lead enrichment with company data
- Real-time lead search and filtering
- Bulk import/export functionality
- Activity timeline tracking
- Engagement history monitoring

### 📊 Analytics & Reporting
- Email open rates and click tracking
- Campaign performance trends
- Multi-channel distribution analytics
- Funnel analysis with conversion metrics
- ROI tracking by campaign and channel
- Real-time dashboard updates

### ⚙️ Smart Settings
- Email configuration (SMTP, OAuth)
- CRM & tool integrations
- Team management with role-based access
- Billing and subscription management
- Security & authentication settings
- Notification preferences

### 🎓 Onboarding Wizard (Production Ready)
- 5-step guided setup process
- Email account connection
- ICP (Ideal Customer Profile) definition
- Campaign goal selection
- **Real-time validation and error feedback**
- **Auto-save of preferences to localStorage**

## Production-Ready Features ✨

### Dark Mode Support 🌓
- **Theme Toggle**: Sun/Moon icon in header for easy switching
- **Persistent Preference**: Theme saved to localStorage
- **System Integration**: Respects user's system preferences
- **Comprehensive Coverage**: All components support dark mode styling

### Error Handling
- **ErrorBoundary Component**: Catches React errors and displays user-friendly fallback UI
- **Enhanced Logging**: Detailed error tracking with timestamps and stack traces
- **SessionStorage Tracking**: Stores last 10 errors for debugging
- **Production Safety**: Error details hidden in production, visible in development
- Global error boundaries wrap the entire application
- Graceful degradation for failed operations

### User Notifications (Toast System)
- Context-based notifications with auto-dismiss
- 4 notification types: success, error, warning, info
- Non-intrusive slide-in animations
- Auto-dismiss after 5 seconds
- Used throughout: Campaign saves, lead actions, form submissions

### Form Validation
- Email validation with regex patterns
- Required field validation
- URL and phone number validation
- Min/max length validators
- Custom hook: `useFormValidation` for easy integration
- Real-time error clearing on input change
- Integrated in Campaign Builder and Onboarding

### Loading States
- **Skeleton Components**: Multiple pre-built skeleton layouts (cards, tables, lists, dashboards)
- Page-level loading spinner with messaging
- Inline loading indicators for async actions
- Smooth transitions and skeleton screens
- Loading states on buttons during form submission
- Implemented in: Leads page (800ms delay), export functionality, campaign launch

### Data Persistence
- Campaign draft auto-save every 30 seconds
- User preferences stored in localStorage
- Persistent ICP definitions
- Campaign recovery from drafts
- Storage utilities with CRUD operations
- Automatic recovery on page reload

### Performance Monitoring 🚀
- **Web Vitals Tracking**: Monitors CLS, FID, FCP, LCP, TTFB
- **Operation Metrics**: Tracks function execution times
- **Performance Summary**: Debug tools for identifying slow operations
- **SessionStorage Metrics**: Stores performance data for analysis
- **Debounce/Throttle**: Utility functions for optimization
- **Development Logging**: Warns about slow operations (>1000ms)

### 404 Page & Error Pages
- Custom 404 error page with navigation
- Quick links to main sections
- Helpful suggestions for users
- Catch-all route for undefined pages

## Tech Stack

- **Frontend Framework**: React 18.2 with Hooks
- **Routing**: React Router v7 with lazy code splitting
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React (50+ icons)
- **Charts**: Recharts (Area, Bar, Pie, Line)
- **Build Tool**: Vite 6.3.6
- **CSS Processing**: PostCSS + Autoprefixer
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites
- Node.js 20.x (see `.nvmrc`)
- Python 3.11.x (for backend)
- npm or yarn

### Installation
```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Development Server
```bash
# Frontend (runs on http://localhost:3004)
npm run dev

# Backend (runs on http://localhost:8000)
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend API runs on `http://localhost:8000` (proxy configured in Vite)

### Production Build
```bash
npm run build
```
Built files are in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
# Frontend tests
npm test            # Watch mode
npm run test:ci     # CI mode with coverage

# Backend tests
cd backend
pytest -v --cov=app

# E2E tests
npm run test:e2e         # Interactive
npm run test:e2e:ci      # CI mode
```

### Linting & Type Checking
```bash
# Frontend
npm run lint        # ESLint
npm run typecheck   # TypeScript

# Backend
cd backend
flake8 app          # Python linting
black app           # Format code
isort app           # Sort imports
```

## 📚 Documentation

All documentation has been organized for easy access:

- **[Complete Documentation Index](docs/README.md)** - Start here for all documentation
- **[Quick Start Guide](docs/guides/QUICK_START.md)** - Get up and running quickly
- **[Architecture Overview](docs/architecture/ARCHITECTURE.md)** - System design and architecture
- **[Features Documentation](docs/features/)** - Detailed feature guides
- **[Deployment Guide](docs/deployment/DEPLOYMENT.md)** - Production deployment instructions
- **[Production Checklist](docs/deployment/PRODUCTION_CHECKLIST.md)** - Pre-launch checklist

## 🚀 CI/CD Pipeline

This repository implements comprehensive continuous integration and deployment workflows.

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every pull request and push to `main`/`develop`:

**Frontend Checks:**
- ✅ ESLint (zero warnings enforced)
- ✅ TypeScript type checking
- ✅ Vitest unit tests with coverage
- ✅ Production build validation

**Backend Checks:**
- ✅ Flake8 linting (strict error mode)
- ✅ Black formatting validation
- ✅ isort import order checking
- ✅ Pytest with 80% coverage requirement
- ✅ Import smoke test

**E2E Tests:**
- ✅ Playwright browser tests against built artifacts

**Kubernetes:**
- ⚠️ Helm chart validation (informational)
- ⚠️ K8s manifest validation with kubeval

### CD Workflow (`.github/workflows/cd.yml`)

Triggers on push to `main` or version tags (`v*.*.*`):

**Docker Image Build & Push:**
- 🐳 Backend image → `ghcr.io/<repo>/backend`
- 🐳 Frontend image → `ghcr.io/<repo>/frontend`
- 📦 Multi-arch support (linux/amd64)
- ⚡ GitHub Actions cache for layer reuse
- 🏷️ Semantic versioning tags

### Running CI Checks Locally

Before pushing, verify your changes pass all CI checks:

```bash
# Frontend checks
npm run lint
npm run typecheck
npm run test:ci
npm run build

# Backend checks
cd backend
flake8 app --count --select=E9,F63,F7,F82 --show-source --statistics
black --check app
isort --check-only app
pytest -v --cov=app

# E2E tests (after building)
npm run build
npm run preview &
npm run test:e2e:ci
```

### Branch Protection

Recommended GitHub branch protection rules for `main`:

- ✅ Require status checks: `CI Success`
- ✅ Require branches to be up to date
- ✅ Require pull request reviews (1+ approvers)
- ✅ Dismiss stale reviews on new commits
- ✅ Require linear history

### Concurrency & Performance

- **Parallel job execution**: Frontend, backend, and K8s checks run concurrently
- **Concurrency groups**: Auto-cancel stale workflow runs on new commits
- **Caching**: npm and pip dependencies cached per branch
- **Docker layer caching**: GitHub Actions cache for faster image builds
- **Timeouts**: All jobs have 10-20 minute timeouts to prevent runaway builds

### Troubleshooting CI Failures

**Frontend lint fails:**
```bash
npm run lint:fix  # Auto-fix ESLint issues
```

**Backend formatting fails:**
```bash
cd backend
black app        # Auto-format with black
isort app        # Auto-sort imports
```

**Tests fail:**
- Check that you're using the correct Node/Python versions
- Clear caches: `npm ci` (frontend) or `pip install --force-reinstall -r requirements.txt` (backend)
- Run tests locally with same environment variables as CI

## Project Structure

```
/src
	/components
		/ui                      # Reusable UI components
			Button.jsx            # Button with 5 variants
			Card.jsx              # Composable card system
			Input.jsx             # Form inputs & textarea
/docs                          # Organized documentation
	/architecture               # System architecture docs
	/features                   # Feature documentation
	/guides                     # Quick start guides
	/deployment                 # Deployment guides
	/development                # Build and dev docs
	/marketing                  # Marketing pages docs
	/enterprise                 # Enterprise features
/backend                       # FastAPI backend
/e2e                          # End-to-end tests
/helm                         # Kubernetes Helm charts
/k8s                          # Kubernetes manifests
			Modal.jsx             # Dialog component
			Badge.jsx             # Status badges
		/layout                 # Layout components
			DashboardLayout.jsx   # Main dashboard layout
			Sidebar.jsx           # Navigation sidebar
			Header.jsx            # Top header bar
		ErrorBoundary.jsx       # Error boundary wrapper
		Toast.jsx               # Toast notification system
		Loading.jsx             # Loading spinners
	/pages                     # Page components
		LandingPage.jsx        # Marketing homepage
		Dashboard.jsx          # Main dashboard
		CampaignBuilder.jsx    # Campaign creation (w/ validation)
		Leads.jsx              # Lead management
		AIAssistant.jsx        # Chat with Ava
		Analytics.jsx          # Performance analytics
		Settings.jsx           # User settings
		Onboarding.jsx         # Setup wizard (w/ validation)
		NotFound.jsx           # 404 page
	/lib                       # Utility functions
		utils.js               # Classname utilities
		validation.js          # Form validators & hook
		storage.js             # localStorage wrapper
	App.jsx                    # Root component with routing
	index.jsx                 # React DOM render
	index.css                 # Global styles
```

## Key Integration Examples

### Using Toast Notifications
```jsx
import { useToast } from './components/Toast';

function MyComponent() {
	const { showToast } = useToast();
  
	const handleSave = async () => {
		try {
			// Save logic
			showToast('Saved successfully!', 'success');
		} catch (error) {
			showToast('Failed to save', 'error');
		}
	};
}
```

### Using Form Validation
```jsx
import { useFormValidation, validateEmail } from './lib/validation';

function MyForm() {
	const { errors, validate, clearError } = useFormValidation();
	const [email, setEmail] = useState('');
  
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateEmail(email)) {
			// Show error
		}
	};
}
```

### Using Data Persistence
```jsx
import { saveCampaignDraft, getCampaignDraft } from './lib/storage';

// Save
saveCampaignDraft({ name: 'Q1 Outreach', steps: [...] });

// Retrieve
const draft = getCampaignDraft();
```

## Performance Features

- **Code Splitting**: Pages lazy-loaded with React.lazy and Suspense
- **Route-based Bundles**: Each page is a separate chunk
- **CSS Optimization**: Tailwind purges unused styles
- **Icon Optimization**: Only used icons are bundled
- **Chart Optimization**: Recharts lazy-loaded only when needed

## Build Output

Production build produces optimized bundles:
- Main bundle: ~191 KB gzipped
- Pages: 2-27 KB each (gzipped)
- Total: ~650 KB gzipped

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Deployment Ready

The application is ready for deployment to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting

## Environment Variables

Create `.env.local` for configuration:
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Artisan
```

## Future Enhancements

- [ ] Backend API integration (FastAPI backend already available in `/backend`)
- [ ] Real email/SMS sending via SendGrid/Twilio
- [ ] Advanced AI personalization with GPT
- [ ] Team collaboration features
- [ ] Advanced analytics with custom reports
- [ ] REST API for integrations
- [ ] Mobile app version
- [x] Dark mode support (✅ Completed)
- [ ] Multi-language support (i18n)
- [ ] Webhook support
- [ ] Progressive Web App (PWA) features
- [ ] Real-time collaboration with WebSockets
- [ ] Advanced caching strategies
- [ ] Offline mode support

## License

Proprietary - All rights reserved

## Support & Contact

For issues and questions, please contact the development team.

---

**Built with ❤️ using React + Tailwind CSS + Vite**

The page will reload automatically when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn Vitest, a Vite-native testing framework, go to [Vitest documentation](https://vitest.dev/guide/)

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://sambitsahoo.com/blog/vite-code-splitting-that-works.html](https://sambitsahoo.com/blog/vite-code-splitting-that-works.html)

### Analyzing the Bundle Size

This section has moved here: [https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer)

### Making a Progressive Web App

This section has moved here: [https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf](https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf)

### Advanced Configuration

This section has moved here: [https://vitejs.dev/guide/build.html#advanced-base-options](https://vitejs.dev/guide/build.html#advanced-base-options)

### Deployment

This section has moved here: [https://vitejs.dev/guide/build.html](https://vitejs.dev/guide/build.html)

### Troubleshooting

This section has moved here: [https://vitejs.dev/guide/troubleshooting.html](https://vitejs.dev/guide/troubleshooting.html)
