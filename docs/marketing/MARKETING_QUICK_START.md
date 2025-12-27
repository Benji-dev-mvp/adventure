# Marketing Experience - Quick Start

## 🚀 View the New Page

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open in browser**:
   ```
   http://localhost:3005/marketing
   ```

3. **Scroll through the experience** to see all sections with their animations and interactions

## 📝 Common Tasks

### Update Headlines and Copy
Edit [`src/config/marketingContent.js`](src/config/marketingContent.js):

```javascript
// Change hero headline
hero: {
  headline: "Your new headline here",
  subhead: "Your new subhead here",
  // ...
}
```

### Change Metrics
```javascript
hero: {
  metrics: [
    { value: "10x", label: "Your metric" },
    { value: "3.5hr", label: "Another metric" },
    { value: "89%", label: "Third metric" }
  ]
}
```

### Update Features
```javascript
features: {
  grid: [
    {
      id: "your-feature",
      icon: "Sparkles", // From lucide-react
      title: "Feature Title",
      preview: "Short description",
      expanded: {
        description: "Full description",
        capabilities: ["Cap 1", "Cap 2", "Cap 3"],
        benefit: "Key benefit statement"
      }
    }
  ]
}
```

### Add Testimonials
```javascript
testimonials: {
  quotes: [
    {
      id: 1,
      quote: "Your testimonial quote",
      author: "Name",
      role: "Job Title",
      company: "Company Name",
      metrics: { 
        meetings: "+215%", 
        pipeline: "$2.4M" 
      }
    }
  ]
}
```

## 🎨 Customize Styling

### Adjust Colors
Edit [`tailwind.config.js`](tailwind.config.js):
```javascript
colors: {
  accent: {
    DEFAULT: '#YourColor',
    // Add more shades as needed
  }
}
```

### Modify Animations
Edit [`src/hooks/useScrollAnimation.js`](src/hooks/useScrollAnimation.js):
```javascript
// Change fade-in behavior
export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.6,  // Change duration
    delay,          // Stagger delay
    ease: [0.25, 0.46, 0.45, 0.94] // Custom easing
  }
});
```

### Change Section Order
Edit [`src/pages/Marketing.jsx`](src/pages/Marketing.jsx):
```jsx
<HeroScene content={marketingContent.hero} />
{/* Reorder these sections as needed */}
<FeatureGrid content={marketingContent.features} />
<HowItWorksStepper content={marketingContent.howItWorks} />
<BeforeAfterCompare content={marketingContent.beforeAfter} />
```

## 🔧 Advanced Customization

### Create Custom Section
1. Create new component in `src/components/marketing/YourSection.jsx`
2. Add content to `src/config/marketingContent.js`
3. Import and use in `src/pages/Marketing.jsx`

Example:
```jsx
// YourSection.jsx
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const YourSection = ({ content }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section ref={ref} className="py-24">
      {/* Your content */}
    </section>
  );
};

export default YourSection;
```

### Adjust Scroll Triggers
```javascript
// More sensitive (triggers earlier)
const { ref, isVisible } = useScrollAnimation({ 
  threshold: 0.1  // 10% visible
});

// Less sensitive (triggers later)
const { ref, isVisible } = useScrollAnimation({ 
  threshold: 0.5  // 50% visible
});

// Custom root margin (trigger before entering viewport)
const { ref, isVisible } = useScrollAnimation({ 
  rootMargin: '100px'  // Trigger 100px before
});
```

### Disable Animations
```javascript
// Globally disable for testing
const { ref, isVisible } = useScrollAnimation({ 
  enableMotion: false 
});

// Or use CSS
.no-animation * {
  animation: none !important;
  transition: none !important;
}
```

## 🎯 Testing Checklist

- [ ] Desktop (1920px+): All animations smooth
- [ ] Laptop (1440px): Layout adapts properly
- [ ] Tablet (768px): 2-column grids work
- [ ] Mobile (375px): Stacked layout, readable
- [ ] Slow 3G: Content loads progressively
- [ ] Screen reader: All content accessible
- [ ] Keyboard only: All interactions work
- [ ] Dark mode: Colors contrast properly

## 📚 Key Files Reference

```
src/
├── pages/
│   └── Marketing.jsx           ← Main page assembly
├── components/
│   └── marketing/
│       ├── HeroScene.jsx       ← Hero with scroll compression
│       ├── BeforeAfterCompare.jsx ← Before/After section
│       ├── HowItWorksStepper.jsx  ← Multi-step walkthrough
│       ├── FeatureGrid.jsx        ← Feature tiles
│       ├── AIAgentShowcase.jsx    ← AI agent narrative
│       ├── TestimonialsCarousel.jsx ← Testimonials
│       ├── FinalCTA.jsx           ← Final call-to-action
│       └── index.js               ← Export barrel
├── config/
│   └── marketingContent.js     ← ALL CONTENT HERE
├── hooks/
│   └── useScrollAnimation.js   ← Animation utilities
└── index.css                    ← Custom animations
```

## 🐛 Common Issues

### Animations Not Triggering
**Problem**: Elements not animating on scroll  
**Solution**: Check browser console for Intersection Observer errors. Ensure `threshold` is reasonable (0.1 - 0.5).

### Performance Lag
**Problem**: Scroll feels janky  
**Solution**: 
- Open DevTools Performance tab
- Check for layout thrashing
- Reduce number of simultaneous animations
- Use `will-change` sparingly

### Content Not Updating
**Problem**: Changes to `marketingContent.js` not appearing  
**Solution**:
- Hard refresh (Cmd/Ctrl + Shift + R)
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for JavaScript syntax errors in console

### Dark Mode Issues
**Problem**: Colors look wrong in dark mode  
**Solution**: Use `dark:` prefix for all color utilities:
```jsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

## 🚢 Pre-Launch Checklist

Before deploying to production:

1. **Content**
   - [ ] All copy proofread
   - [ ] Metrics are accurate
   - [ ] Links point to correct pages
   - [ ] Images optimized and compressed

2. **Performance**
   - [ ] Lighthouse score > 90
   - [ ] Images use WebP/AVIF
   - [ ] Lazy loading enabled
   - [ ] Critical CSS inlined

3. **SEO**
   - [ ] Meta tags configured
   - [ ] Open Graph images set
   - [ ] Structured data added
   - [ ] Sitemap updated

4. **Accessibility**
   - [ ] WCAG AA compliant
   - [ ] Screen reader tested
   - [ ] Keyboard navigation works
   - [ ] Color contrast verified

5. **Analytics**
   - [ ] Event tracking configured
   - [ ] Goal conversions set up
   - [ ] Heat mapping enabled
   - [ ] A/B tests ready

## 📞 Need Help?

1. Check [MARKETING_EXPERIENCE.md](MARKETING_EXPERIENCE.md) for full documentation
2. Review [MARKETING_VISUAL_GUIDE.md](MARKETING_VISUAL_GUIDE.md) for structure
3. Inspect existing components in `src/components/marketing/`
4. Reference animation hooks in `src/hooks/useScrollAnimation.js`

## 🎉 You're Ready!

The marketing experience is fully built and ready to customize. Navigate to:

```
http://localhost:3005/marketing
```

And start scrolling! 🚀
