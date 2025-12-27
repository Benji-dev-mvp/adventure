# Artisan - AI-Powered Outbound Sales Platform

A comprehensive SaaS application inspired by Artisan, featuring an AI BDR assistant named Ava that automates outbound sales workflows. This is a full-featured MVP built with React, React Router, Tailwind CSS, and Recharts.

🎉 **Live Demo**: Open http://localhost:3000 after running `npm start`

## 🚀 Features

### 1. **Landing Page**
- Hero section with value proposition and AI assistant showcase
- Features overview with 6 key capabilities
- Stats bar highlighting platform metrics
- "How It Works" section with 4-step process
- Customer testimonials
- Pricing plans (Starter, Professional, Enterprise)
- Fully responsive design

### 2. **Dashboard Home**
- KPI cards: Emails Sent, Reply Rate, Meetings Booked, Active Leads
- AI Insights & Recommendations panel with actionable suggestions
- Email performance chart (7-day activity visualization)
- Active campaigns overview with metrics
- Recent activity timeline with lead interactions
- Quick actions sidebar

### 3. **Campaign Builder**
- Multi-channel sequence builder (Email, LinkedIn, Phone, SMS)
- Drag-and-drop step ordering
- AI content assistant with tone and length controls
- Personalization variable system
- A/B testing support
- Campaign settings and scheduling
- Real-time preview

### 4. **Lead CRM & Enrichment**
- Searchable lead database table
- Advanced filtering (Hot, Warm, Cold leads)
- Lead scoring badges (0-100 scale)
- Detailed lead modal with:
  - Contact information
  - Company insights (size, revenue, tech stack)
  - Recent news and updates
  - Activity timeline
- Bulk actions (export, import)

### 5. **AI Assistant Chat**
- Interactive chat interface with Ava
- Pre-built prompt templates:
  - Write cold emails
  - Generate subject lines
  - Analyze campaigns
  - Create follow-up sequences
  - Craft value propositions
  - LinkedIn messages
- Tone and length customization
- Real-time suggestions
- AI impact metrics

### 6. **Analytics & Optimization**
- Conversion funnel visualization (Sent → Opened → Clicked → Replied → Meetings)
- Multi-channel distribution pie chart
- Performance trends (6-week line chart)
- Top performing subject lines
- AI optimization insights
- Export capabilities

### 7. **Settings**
- Email & Sending configuration
- Domain warmup & deliverability monitoring
- CRM integrations (Salesforce, HubSpot, Pipedrive)
- LinkedIn integration
- Team management with roles & permissions
- Billing & subscription management
- Security settings (2FA, API keys)
- Notification preferences

### 8. **Onboarding Flow**
- 5-step wizard:
  1. Role selection
  2. Email connection (Gmail/Outlook)
  3. ICP definition
  4. CRM integration
  5. First campaign setup
- Progress tracking
- Beautiful gradient design

## 🎨 Design System

- **Colors**:
  - Primary: `#0F2540` (Dark Blue)
  - Accent: `#3B82F6` (Blue)
  - Extended color palette with 50-900 shades
- **Typography**: Inter font family
- **Border Radius**: 12px for cards and inputs
- **Shadows**: Soft elevation system
- **Components**: Full UI component library with variants

## 📦 Tech Stack

- **React 18.2** - UI framework
- **React Router Dom** - Navigation and routing
- **Tailwind CSS 3** - Styling and design system
- **Recharts** - Data visualization and charts
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

## 🛠️ Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```
   Open http://localhost:3000 to view it in the browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx      - Reusable button with 5 variants
│   │   ├── Card.jsx        - Card component system
│   │   ├── Input.jsx       - Form inputs with validation
│   │   ├── Modal.jsx       - Modal dialogs
│   │   └── Badge.jsx       - Status badges
│   └── layout/
│       ├── DashboardLayout.jsx  - Main app layout
│       ├── Sidebar.jsx          - Navigation sidebar
│       └── Header.jsx           - Top header bar
├── pages/
│   ├── LandingPage.jsx      - Marketing landing page
│   ├── Dashboard.jsx        - Main dashboard
│   ├── CampaignBuilder.jsx  - Campaign creation tool
│   ├── Leads.jsx            - Lead management
│   ├── AIAssistant.jsx      - AI chat interface
│   ├── Analytics.jsx        - Analytics & charts
│   ├── Settings.jsx         - App settings
│   └── Onboarding.jsx       - User onboarding
├── lib/
│   └── utils.js             - Utility functions
├── App.jsx                  - Main app with routing
└── index.jsx                - Entry point
```

## 🔗 Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Marketing homepage with features, pricing, testimonials |
| `/onboarding` | Onboarding Flow | 5-step setup wizard for new users |
| `/dashboard` | Dashboard Home | Main dashboard with KPIs and insights |
| `/campaigns` | Campaign Builder | Multi-channel campaign creation |
| `/leads` | Lead CRM | Lead database with enrichment data |
| `/ai-assistant` | AI Assistant | Chat interface with Ava |
| `/analytics` | Analytics | Performance metrics and charts |
| `/settings` | Settings | Account and platform settings |

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interactions

### Component Library
- **Button**: 5 variants × 3 sizes = 15 combinations
- **Card**: Composable system (Header, Content, Footer)
- **Input**: Text, Textarea, Select with validation
- **Modal**: 4 sizes with full customization
- **Badge**: 7 color variants

### Data Visualization
- Area charts for email performance
- Bar charts for conversion funnel
- Pie charts for channel distribution
- Line charts for performance trends
- Custom tooltips and legends

### Mock Data
- 4 detailed lead profiles
- Campaign metrics and KPIs
- AI-generated insights
- Activity timelines
- Performance benchmarks

## 💡 Usage Examples

### Navigate the App
1. Start at the landing page (`/`)
2. Click "Get Started" to go through onboarding
3. Explore the dashboard
4. Create a campaign
5. View leads and analytics
6. Chat with Ava AI assistant

### Try Different Features
- **Dashboard**: View KPIs and AI insights
- **Campaigns**: Build a multi-step email sequence
- **Leads**: Click on a lead to see full details
- **AI Assistant**: Try different prompt templates
- **Analytics**: Explore interactive charts
- **Settings**: Check all configuration options

## 🔧 Configuration

### Tailwind Config
Located at `tailwind.config.js` with custom:
- Color palette (primary, accent with shades)
- Font family (Inter)
- Border radius (12px default)
- Custom shadows

### PostCSS Config
Located at `postcss.config.js` with:
- Tailwind CSS processing
- Autoprefixer

## 🚧 Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication (JWT/OAuth)
- [ ] WebSocket for real-time updates
- [ ] Rich text email editor
- [ ] Advanced lead scoring ML model
- [ ] Calendar sync (Google/Outlook)
- [ ] Mobile app (React Native)
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Export to PDF reports

## 🐛 Known Issues

None! The app is fully functional as a frontend MVP.

## 📝 License

MIT License - feel free to use this for learning or as a starting point for your own projects.

## 🙏 Credits

- Inspired by Artisan's publicly available product information
- Built with modern React ecosystem
- UI components follow best practices from shadcn/ui
- Charts powered by Recharts
- Icons from Lucide React

---

**Note**: This is a frontend-only MVP with mock data. For production, you'll need:
- Backend API (Node.js/Python)
- Database (PostgreSQL/MongoDB)
- Authentication system
- Real AI integration (OpenAI/custom models)
- Email sending infrastructure
- Payment processing

**Created as a demonstration of modern SaaS UI/UX patterns and React development best practices.**

Run `npm start` and visit http://localhost:3000 to explore! 🚀
