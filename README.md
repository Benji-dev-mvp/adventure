# Artisan - AI BDR SaaS Platform

A production-ready AI Business Development Representative (BDR) platform built with React, featuring Ava - an intelligent AI assistant that automates outbound sales workflows.

## 🆕 Latest Updates (v2.0.0)

### New in This Release

**🤖 Kapa.ai Integration**
- AI-powered documentation assistant available on all pages
- Click the (?) icon to ask questions about the platform
- Get instant answers with source citations
- Conversation threading for complex queries

**📊 System Health Monitoring**
- Real-time backend service monitoring
- CPU, memory, and disk usage tracking
- Service status dashboard at `/system-status`
- Auto-refreshing health metrics

**🚀 Enhanced Deployment**
- Production-ready Docker Compose setup
- Kubernetes manifests with Helm charts
- Zero-downtime upgrade procedures
- Comprehensive deployment documentation

**📖 Complete Documentation**
- [Quick Reference Guide](docs/QUICK_REFERENCE.md) - Common commands and tips
- [Architecture Overview](docs/ARCHITECTURE.md) - System diagrams
- [Backend Connection Guide](docs/BACKEND_CONNECTION_GUIDE.md) - Setup instructions
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Production deployment
- [Upgrade Guide](docs/UPGRADE_GUIDE.md) - Version management
- [Enterprise Hardening Guide](docs/ENTERPRISE_HARDENING.md) - Security & observability ⭐ NEW

**🏢 Enterprise-Ready**
- Role-based access control (Admin/Operator/Viewer)
- Multi-tenancy support with isolated data
- Comprehensive audit logging and compliance
- OpenTelemetry distributed tracing
- SLO monitoring with error budgets
- Feature flags for gradual rollouts
- Load testing and performance budgets

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

### Error Handling
- **ErrorBoundary Component**: Catches React errors and displays user-friendly fallback UI
- Global error boundaries wrap the entire application
- Error logging and user guidance
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

### 404 Page & Error Pages
- Custom 404 error page with navigation
- Quick links to main sections
- Helpful suggestions for users
- Catch-all route for undefined pages

### System Health & Monitoring (NEW)
- Real-time backend service status monitoring
- System resource tracking (CPU, memory, disk)
- Service dependency health checks
- Response time measurements
- Auto-refreshing dashboard (30s interval)
- Accessible at `/system-status`

### AI-Powered Help Assistant (NEW)
- Kapa.ai integration for instant documentation help
- Available on all pages via (?) icon
- Conversation threading for complex queries
- Source citations for transparency
- User feedback mechanism
- Powered by AI trained on application documentation

## Tech Stack

### Frontend
- **Framework**: React 18.2 with Hooks
- **Routing**: React Router v7 with lazy code splitting
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React (50+ icons)
- **Charts**: Recharts (Area, Bar, Pie, Line)
- **Build Tool**: Vite 6.3.6
- **CSS Processing**: PostCSS + Autoprefixer
- **Utilities**: clsx, tailwind-merge

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL / SQLite
- **Cache**: Redis / In-memory
- **Authentication**: JWT + OAuth2
- **AI Integration**: Kapa.ai for documentation
- **Monitoring**: Prometheus, Sentry
- **API Documentation**: OpenAPI/Swagger

## Getting Started

### Quick Start (Development)

**Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend runs on `http://localhost:3004`

**Backend:**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --port 8000
```
The backend runs on `http://localhost:8000`

**Access:**
- Frontend: http://localhost:3004
- Backend API: http://localhost:8000/docs
- System Health: http://localhost:3004/system-status
- Help Assistant: Click (?) icon on any page

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# View logs
docker-compose logs -f
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Production Build

**Frontend:**
```bash
npm run build
```
Built files are in `dist/` directory

**Backend:**
```bash
# Set environment variables
export DATABASE_URL=postgresql://...
export SECRET_KEY=your-secret-key

# Run with production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 Documentation

All documentation has been organized for easy access:

### Quick References
- **[Quick Reference Guide](docs/QUICK_REFERENCE.md)** - Common commands, quick start, troubleshooting
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System diagrams and data flow

### Setup & Configuration
- **[Backend Connection Guide](docs/BACKEND_CONNECTION_GUIDE.md)** - Complete backend setup and Kapa.ai integration
- **[Complete Documentation Index](docs/README.md)** - Start here for all documentation
- **[Quick Start Guide](docs/guides/QUICK_START.md)** - Get up and running quickly

### Deployment & Operations
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Docker, Kubernetes, Helm, cloud platforms
- **[Upgrade Guide](docs/UPGRADE_GUIDE.md)** - Version upgrades, migrations, rollbacks
- **[Production Checklist](docs/deployment/PRODUCTION_CHECKLIST.md)** - Pre-launch checklist
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - Recent changes and features

### Features & Development
- **[Architecture Overview](docs/architecture/ARCHITECTURE.md)** - System design and architecture
- **[Features Documentation](docs/features/)** - Detailed feature guides

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

- [ ] Backend API integration
- [ ] Real email/SMS sending
- [ ] Advanced AI personalization with GPT
- [ ] Team collaboration features
- [ ] Advanced analytics with custom reports
- [ ] REST API for integrations
- [ ] Mobile app version
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Webhook support

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
