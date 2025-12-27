# Marketing Experience - Artisan Style

## Overview
A scroll-driven, single-page marketing experience inspired by artisan.co's choreography and interaction patterns, built entirely with our existing design system.

## 🎯 What's Included

### Components (`src/components/marketing/`)
1. **HeroScene.jsx** - Scroll-driven hero with product frame compression
2. **BeforeAfterCompare.jsx** - Side-by-side comparison with animated metrics
3. **HowItWorksStepper.jsx** - Multi-step walkthrough with Intersection Observer
4. **FeatureGrid.jsx** - Expandable feature tiles with hover interactions
5. **AIAgentShowcase.jsx** - AI agent narrative (Meet Ava style)
6. **TestimonialsCarousel.jsx** - Rotating testimonials + case studies
7. **FinalCTA.jsx** - Compelling final call-to-action band

### Configuration
- **`src/config/marketingContent.js`** - All copy, metrics, features, testimonials
- Single source of truth for content updates
- No hardcoded copy in components

### Utilities
- **`src/hooks/useScrollAnimation.js`** - GPU-optimized scroll animations
  - `useScrollAnimation` - IntersectionObserver-based visibility
  - `useScrollProgress` - Track scroll progress through elements
  - `useParallax` - Parallax scroll effects
  - `useStepProgress` - Multi-step progress tracking
  - `useCountUp` - Smooth counter animations

### Custom CSS Animations (`src/index.css`)
- `animate-float` - Floating elements
- `animate-fade-in` - Fade in transitions
- `animate-scale-in` - Scale in transitions
- `animate-bounce-slow` - Slow bounce for indicators
- Respects `prefers-reduced-motion`

## 🎨 Design System Integration

### Colors
All components use existing design tokens:
- `primary` - Main brand color (#0F2540)
- `accent` - Call-to-action color (#3B82F6)
- `artisan.purple` - Accent gradients (#7D37FF)
- `artisan.coral` - Complementary accents (#FFAEA5)

### Typography
- Font stack: Inter (primary), DM Sans, Space Grotesk
- Consistent heading scales (4xl → 6xl)
- Proper line heights for readability

### Components
Reuses existing UI components:
- `Button` - CTAs and interactions
- `Badge` - Labels and status indicators
- `Card` - Content containers
- All from `src/components/ui/`

### Motion
- GPU-accelerated transforms (`translate3d`, `transform`)
- Intersection Observer for scroll triggers
- Smooth easing curves matching product feel
- Respects accessibility preferences

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Stacked layouts on small screens
- Reduced animation complexity
- Touch-friendly interactive areas
- Optimized image loading

## 🚀 Usage

### View the Page
```
http://localhost:3005/marketing
```

### Update Content
Edit `src/config/marketingContent.js`:
```javascript
export const marketingContent = {
  hero: {
    headline: "Your new headline",
    subhead: "Your new subhead",
    // ...
  },
  // ...
};
```

### Customize Animations
Adjust animation settings in hooks:
```javascript
const { ref, isVisible } = useScrollAnimation({
  threshold: 0.2,        // % of element visible to trigger
  rootMargin: '0px',     // Offset from viewport
  triggerOnce: true,     // Only animate once
  enableMotion: true     // Respect prefers-reduced-motion
});
```

## 🎬 Interaction Patterns

### Hero
- **On Load**: Fade in with staggered elements
- **On Scroll**: Hero scales down, product frame compresses
- **Metrics**: Animate numbers on first view

### Before/After
- **On View**: Cards slide in from sides
- **Metrics**: Counter animations for numbers
- **Interaction**: Side-by-side comparison with clear visual contrast

### How It Works
- **Sticky Visual**: Right column stays fixed as steps scroll
- **Active Step**: Highlighted step changes content in visual frame
- **Progress Bar**: Fixed top bar shows scroll progress
- **Intersection**: Each step triggers on 50% visibility

### Features
- **Hover**: Cards elevate, show "Learn more"
- **Click**: Expand to modal with full details
- **Grid**: Responsive 1/2/3 column layout
- **Icons**: Dynamic icon mapping from lucide-react

### AI Agent
- **Gradient BG**: Purple-to-accent gradient with animated blobs
- **Persona**: Sticky card on desktop
- **Interactive Demo**: Click "Try it now" to see AI generation
- **Animation**: Typing indicator + result reveal

### Testimonials
- **Auto-rotate**: Changes every 6 seconds
- **Manual**: Click indicators to jump to testimonial
- **Case Studies**: Grid of before/after metrics
- **Metrics**: Highlighted key improvements

### Final CTA
- **Full-width**: Edge-to-edge gradient background
- **Trust Signals**: Security + support badges
- **Social Proof**: Live metrics with icons
- **Dual CTAs**: Primary (Start Trial) + Secondary (Talk to Sales)

## ⚡ Performance

### Optimization Strategies
1. **GPU Acceleration**: `translate3d` for transforms
2. **Lazy Loading**: Intersection Observer prevents premature animations
3. **Will-change**: Hints browser for animation properties
4. **Debouncing**: Scroll listeners use passive listeners
5. **Image Optimization**: Use next-gen formats (WebP, AVIF)

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

## ♿ Accessibility

### Features
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Keyboard Nav**: All interactive elements focusable
- **ARIA Labels**: Proper labels for controls
- **Color Contrast**: WCAG AA compliant
- **Semantic HTML**: Proper heading hierarchy

### Testing
```bash
# Run accessibility tests
npm run test:a11y

# Check with screen reader
# - NVDA (Windows)
# - JAWS (Windows)
# - VoiceOver (Mac)
```

## 🔧 Customization Guide

### Change Section Order
Edit `src/pages/Marketing.jsx`:
```jsx
<HeroScene content={marketingContent.hero} />
<FeatureGrid content={marketingContent.features} />
<HowItWorksStepper content={marketingContent.howItWorks} />
// Reorder as needed
```

### Add New Section
1. Create component in `src/components/marketing/`
2. Add content to `src/config/marketingContent.js`
3. Import and render in `src/pages/Marketing.jsx`

### Modify Colors
Update `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      accent: {
        DEFAULT: '#YourColor',
        // ...
      }
    }
  }
}
```

### Adjust Animations
Edit `src/hooks/useScrollAnimation.js`:
```javascript
// Change animation curves
transition: { 
  duration: 0.6, 
  delay, 
  ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier
}
```

## 📊 Analytics Integration

### Add Tracking
```javascript
// In any component
import { trackEvent } from '../lib/analytics';

const handleCTA = () => {
  trackEvent('marketing_cta_click', {
    section: 'hero',
    cta: 'Start Free Trial'
  });
  // Navigate...
};
```

### Scroll Depth Tracking
```javascript
// Already built into useScrollProgress
const { ref, progress } = useScrollProgress();

useEffect(() => {
  if (progress > 0.75) {
    trackEvent('scroll_depth', { section: 'features', depth: 75 });
  }
}, [progress]);
```

## 🐛 Troubleshooting

### Animations Not Working
1. Check `prefers-reduced-motion` setting
2. Verify Intersection Observer support (polyfill for IE11)
3. Inspect element with React DevTools

### Performance Issues
1. Reduce animation complexity on mobile
2. Lazy load images below the fold
3. Debounce scroll listeners
4. Use CSS transforms over layout properties

### Content Not Updating
1. Check `src/config/marketingContent.js` for typos
2. Hard refresh browser (Cmd/Ctrl + Shift + R)
3. Clear Vite cache: `rm -rf node_modules/.vite`

## 📚 Resources

### Inspiration
- [artisan.co](https://artisan.co) - Original reference
- [Awwwards](https://awwwards.com) - Award-winning designs
- [Codrops](https://tympanus.net/codrops/) - Interaction patterns

### Libraries Used
- React 18
- Tailwind CSS 3
- Lucide React (icons)
- Intersection Observer API
- Framer Motion (optional, not yet added)

### Further Reading
- [Web Animation Best Practices](https://web.dev/animations/)
- [Intersection Observer Guide](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [GPU Animation Performance](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)

## 🚢 Deployment Checklist

- [ ] Update content in `marketingContent.js`
- [ ] Replace placeholder images/logos
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Verify analytics tracking
- [ ] Check browser compatibility (Safari, Chrome, Firefox, Edge)
- [ ] Test with screen reader
- [ ] Optimize images (compression + next-gen formats)
- [ ] Set up proper meta tags for SEO
- [ ] Configure CDN for assets

## 📞 Support

For questions or issues:
- Check existing components in `src/components/marketing/`
- Review animation hooks in `src/hooks/useScrollAnimation.js`
- Update content in `src/config/marketingContent.js`
- Reference Artisan Platform documentation in `.github/copilot-instructions.md`
