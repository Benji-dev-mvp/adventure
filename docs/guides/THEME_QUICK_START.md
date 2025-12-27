# Quick Start Guide - Dark Mode

## How to Use the New Theme System

### 1. Accessing Theme Settings

1. Open the application
2. Navigate to **Settings** (sidebar → Settings icon)
3. You'll see **Appearance** as the first tab
4. Click on either:
   - **Light Mode** (Sun icon) - Bright and clear
   - **Dark Mode** (Moon icon) - Easy on the eyes

### 2. What Changes

#### Dark Mode Features:
- ✨ **Beautiful gradient background** on all pages (matching AI Assistant)
- 🎨 **Glassmorphism cards** - Semi-transparent with blur effects
- 🌙 **Animated glowing orbs** - Accent, primary, and blue blur effects
- 📝 **White/light text** - Perfect contrast on dark backgrounds
- 🎯 **Consistent design** - Every page looks cohesive

#### Light Mode Features:
- ☀️ **Clean gray background** - Professional and familiar
- 📋 **White cards** - Traditional card design
- 🔤 **Dark text** - High contrast for readability
- 💼 **Business-ready** - Classic enterprise look

### 3. Where It Works

The theme applies to **ALL** pages:
- Dashboard
- AI Assistant
- Analytics
- Campaign Builder
- Leads & Lead Database
- Integrations
- Templates
- Settings
- And more!

### 4. Persistence

Your theme choice is **automatically saved**:
- Saved to browser's localStorage
- Persists across page refreshes
- Persists across browser sessions
- Works even after closing and reopening the app

### 5. Components That Support Dark Mode

✅ Cards
✅ Buttons (all variants)
✅ Badges (all colors)
✅ Input fields
✅ Text areas
✅ Select dropdowns
✅ Modals
✅ Sidebar navigation
✅ Header search
✅ Tables
✅ Charts and graphs

### 6. Text Visibility Fix

**Problem Solved**: White text on white backgrounds
- All text colors now automatically adjust
- Headings: White in dark mode, Dark gray in light mode
- Body text: Light gray in dark mode, Medium gray in light mode
- Placeholders: Adjusted for both themes

### 7. Tips for Best Experience

**For Dark Mode:**
- Best for long working sessions
- Reduces eye strain in low-light environments
- Great for evening/night work
- Shows off the gradient animations

**For Light Mode:**
- Best for bright environments
- Traditional business appearance
- Better for printing/screenshots
- Easier in high ambient light

### 8. Keyboard Shortcuts (Coming Soon)
- Cmd/Ctrl + Shift + D - Toggle dark mode
- Currently: Use Settings → Appearance

### 9. Troubleshooting

**If text is hard to read:**
1. Check you're using the latest version
2. Try switching themes (Settings → Appearance)
3. Refresh the page (Cmd/Ctrl + R)

**If theme doesn't persist:**
1. Check browser localStorage is enabled
2. Clear cache and try again
3. Try a different browser

**If animations are laggy:**
1. Animations only show in dark mode
2. Close other heavy browser tabs
3. Restart browser if needed

### 10. Developer Info

**Theme Context:**
```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

**Dark Mode Classes:**
```jsx
// Use Tailwind's dark: variant
<div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
  Content
</div>
```

---

## Summary

✅ **Dark mode toggle** in Settings → Appearance
✅ **All pages** have consistent dark/light themes
✅ **Text is always readable** in both modes
✅ **Preference saved** automatically
✅ **Beautiful gradients** in dark mode
✅ **Professional look** in both modes

**Enjoy your new dark mode experience!** 🌙✨
