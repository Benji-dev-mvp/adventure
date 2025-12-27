# Artisan - AI-Powered Sales Outreach Platform

A comprehensive, full-featured SaaS application for automating B2B sales outreach with AI assistance.

## 🚀 Features

### Core Platform Features

#### 1. **Landing Page** (`/`)
- Modern hero section with value proposition
- Feature showcase grid with 6 key features
- Statistics bar highlighting platform capabilities
- Customer testimonials with ratings
- Pricing tables (Starter, Professional, Enterprise)
- "How it Works" walkthrough
- Call-to-action sections
- Professional footer with navigation

#### 2. **Dashboard** (`/dashboard`)
- Real-time KPI cards (Emails Sent, Reply Rate, Meetings Booked, Active Leads)
- AI-powered insights and recommendations
- Performance charts (Area charts with email metrics)
- Active campaigns overview with status tracking
- Recent activity feed
- Quick action buttons
- Ava AI status indicator

#### 3. **Campaign Builder** (`/campaigns`)
- Multi-step campaign creation wizard
- Campaign details configuration
- Multi-channel sequence builder (Email, LinkedIn, Call, SMS)
- Delay timing between steps
- Subject line and content editors
- AI-powered optimization suggestions
- Email preview functionality
- Template library
- Send scheduling

#### 4. **Leads Management** (`/leads`)
- Comprehensive lead table with rich data
- Lead scoring (Hot, Warm, Cold)
- Detailed lead profiles with:
  - Contact information (email, phone, LinkedIn)
  - Company details and enrichment data
  - Activity timeline
  - Tech stack information
  - Recent news
- Search and filtering capabilities
- Bulk actions
- Lead detail modals

#### 5. **Lead Database** (`/lead-database`)
- Access to 300M+ verified B2B contacts
- Advanced search filters:
  - Job Title
  - Company Size
  - Industry
  - Location
- AI-powered lead discovery
- CSV/Excel upload functionality
- Recent uploads tracking
- Saved searches
- Export capabilities
- Lead verification badges

#### 6. **AI Assistant** (`/ai-assistant`)
- Interactive chat interface with Ava AI
- Quick action templates:
  - Write cold emails
  - Generate subject lines
  - Analyze campaigns
  - Create follow-up sequences
  - Craft value propositions
  - Write LinkedIn messages
- Tone customization (Professional, Casual, Enthusiastic, Formal)
- Length settings (Short, Medium, Long)
- AI impact metrics
- Suggestion chips for follow-up questions
- Variable highlighting in generated content

#### 7. **Analytics** (`/analytics`)
- Conversion funnel visualization
- Performance trend charts
- Channel distribution (Email, LinkedIn, Phone, SMS)
- Best performing subject lines
- AI optimization insights:
  - Send time optimization
  - A/B test results
  - Personalization impact
  - Deliverability alerts
- Exportable reports
- Time range filters

#### 8. **Integrations** (`/integrations`)
- Integration marketplace with 12+ platforms:
  - **CRM**: Salesforce, HubSpot, Pipedrive, Zapier
  - **Email**: Gmail, Outlook
  - **Communication**: LinkedIn Sales Navigator, Slack, Zoom, Calendly, Intercom
  - **Analytics**: Google Analytics
- Connection status tracking
- Integration ratings and user counts
- Popular integrations highlighting
- Category filtering
- Search functionality
- Custom integration requests

#### 9. **Settings** (`/settings`)
- Tabbed interface with sections:
  - Email & Sending accounts
  - Integrations management
  - Team management
  - Billing & subscription
  - Security settings
  - Notifications preferences
- Connected email accounts display
- Email warmup settings
- Domain health monitoring
- API key management

#### 10. **Team Management** (`/team`)
- Team member listing with roles
- Invitation system
- Role-based permissions (Owner, Admin, Member)
- Member activity tracking
- Pending invitations
- Seat availability
- Team statistics

#### 11. **Onboarding** (`/onboarding`)
- Multi-step guided setup (5 steps)
- Progress indicator
- Role selection
- Company information
- ICP (Ideal Customer Profile) definition
- Email account connection
- Goal setting
- Smooth animations and transitions

### UI Components

#### Reusable Components
- **Card** - Flexible card container with header and content
- **Button** - Multiple variants (primary, outline, ghost) and sizes
- **Input/Textarea** - Labeled form inputs with validation
- **Badge** - Status indicators with color variants
- **Modal** - Accessible dialog system
- **Tabs** - Tabbed navigation component
- **Progress** - Progress bar with gradient
- **Avatar** - User avatars with fallbacks
- **StatsCard** - KPI display with trends
- **EmailPreview** - Live email preview with variable highlighting
- **CampaignCard** - Campaign summary cards
- **ActivityFeed** - Timeline of recent activities
- **QuickActions** - Action buttons grid

#### Layout Components
- **DashboardLayout** - Consistent layout with sidebar and header
- **Sidebar** - Navigation sidebar with menu items and AI status
- **Header** - Top header with notifications and user menu

### Styling & Design

- **Tailwind CSS** for utility-first styling
- **Gradient color scheme** (Accent: #7C3AED, Primary: #3B82F6)
- **Responsive design** - Mobile, tablet, and desktop optimized
- **Smooth animations** and transitions
- **Custom utility functions** using `clsx` and `tailwind-merge`
- **Lucide React icons** throughout the application
- **Recharts** for data visualization

### Technical Features

- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **Lazy loading** for code splitting and performance
- **Error boundaries** for graceful error handling
- **Toast notifications** system
- **Loading states** with branded spinner
- **Type-safe** component props
- **Modular architecture** with feature-based organization

## 📁 Project Structure

```
src/
├── components/
│   ├── features/
│   │   ├── ActivityFeed.jsx
│   │   ├── CampaignCard.jsx
│   │   ├── EmailPreview.jsx
│   │   ├── QuickActions.jsx
│   │   └── StatsCard.jsx
│   ├── layout/
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── ui/
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Progress.jsx
│   │   └── Tabs.jsx
│   ├── ErrorBoundary.jsx
│   ├── Loading.jsx
│   └── Toast.jsx
├── pages/
│   ├── AIAssistant.jsx
│   ├── Analytics.jsx
│   ├── CampaignBuilder.jsx
│   ├── Dashboard.jsx
│   ├── Integrations.jsx
│   ├── LandingPage.jsx
│   ├── LeadDatabase.jsx
│   ├── Leads.jsx
│   ├── NotFound.jsx
│   ├── Onboarding.jsx
│   ├── Settings.jsx
│   └── Team.jsx
├── lib/
│   └── utils.js
├── App.jsx
└── index.jsx
```

## 🎨 Design System

### Colors
- **Accent**: Purple (#7C3AED)
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: System font stack
- **Headings**: Bold, varying sizes (text-4xl to text-sm)
- **Body**: Regular weight, comfortable line-height

### Spacing
- Consistent padding and margin using Tailwind spacing scale
- Card padding: p-6 for content, p-4 for compact
- Grid gaps: gap-4 to gap-8

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_APP_NAME=Artisan
```

## 📊 Data Structure Examples

### Lead Object
```javascript
{
  id: 1,
  name: 'Sarah Johnson',
  title: 'VP of Sales',
  company: 'TechCorp Inc.',
  industry: 'SaaS',
  location: 'San Francisco, CA',
  score: 92,
  status: 'hot',
  email: 'sarah.j@techcorp.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'linkedin.com/in/sarahjohnson',
  enrichment: {
    companySize: '500-1000',
    revenue: '$50M-$100M',
    techStack: ['Salesforce', 'HubSpot', 'Slack'],
    recentNews: 'Just raised Series C funding'
  }
}
```

### Campaign Object
```javascript
{
  name: 'Q1 Enterprise Outreach',
  status: 'active',
  leads: 324,
  sent: 1240,
  replies: 94,
  replyRate: 7.6,
  steps: [
    {
      id: 1,
      type: 'email',
      delay: 0,
      subject: 'Quick question about {{company}}',
      content: 'Hi {{firstName}}, ...'
    }
  ]
}
```

## 🔐 Security Features

- Client-side route protection
- Error boundary for runtime errors
- Input validation on forms
- Secure API communication patterns
- Role-based access control structure

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Metrics Tracked

- Email sent count
- Open rate
- Click-through rate  
- Reply rate
- Meeting booking rate
- Campaign performance
- Lead scoring
- Team activity

## 🔄 Future Enhancements

- Real-time WebSocket updates
- Advanced A/B testing framework
- Calendar integration for meetings
- Email template builder
- Webhook system
- Advanced reporting dashboard
- Mobile app
- API documentation

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For support, contact: support@artisan.com

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
