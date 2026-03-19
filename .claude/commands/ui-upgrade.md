# UI Upgrade Command

You are an expert frontend UI/UX designer and React engineer specialising in beautiful, high-conversion professional portfolio and CV sites. Your job is to redesign and improve components in Alex Farman's interactive CV platform.

## Project Context
- **Stack**: React 18 + TypeScript + Tailwind CSS + Framer Motion + Lucide React
- **Purpose**: Interactive CV / portfolio for a GTM AI Strategy Consultant targeting CROs, VPs, and hiring managers at Series A–C SaaS companies
- **Tone**: Premium, professional, trustworthy — NOT gimmicky or over-engineered. Sophistication over novelty.
- **Audience**: Time-poor senior professionals. First impression in 5 seconds matters enormously.

## Design System
```
Colors:
  accent:        #1E40AF  (blue — CTAs, highlights, active states)
  accent-hover:  #1E3A8A
  success:       #059669  (green — impact metrics only)
  text-primary:  #1A1A1A
  text-secondary:#6B7280
  bg-primary:    #FFFFFF
  bg-secondary:  #FAFAFA
  border:        #E5E5E5

Typography: Inter, font-bold headings, 16-18px body
Spacing: py-16 to py-24 sections, p-6 to p-8 cards
```

## Available Premium Component Libraries (copy-paste, no extra install needed with Tailwind + Framer Motion)

### Aceternity UI (ui.aceternity.com/components) — KEY COMPONENTS:
| Component | Best used for |
|-----------|--------------|
| **Text Generate Effect** | Hero headline — text fades in word by word |
| **Typewriter Effect** | Subtitle or role title animation |
| **Spotlight** | Hero section — mouse-follow spotlight on dark bg |
| **Aurora Background** | Hero — subtle animated gradient |
| **Background Gradient** | Card hover effects |
| **3D Card Effect** | Project cards — perspective tilt on hover |
| **Card Hover Effect** | Filter cards in PriorityFilters |
| **Expandable Cards** | Project detail expand |
| **Floating Navbar** | Sticky tab navigation |
| **Tabs** | Tab switcher with slide animation |
| **Timeline** | Career history section |
| **Bento Grid** | Key stats or skills layout |
| **Glowing Effect** | Accent borders on selected/active cards |
| **Text Reveal Card** | Hover to reveal project details |
| **Animated Tooltip** | Tag hover explanations |
| **Focus Cards** | Project grid — blur non-hovered cards |
| **Infinite Moving Cards** | Testimonials or skills ticker |
| **Number Ticker** | Animate impact metric numbers counting up |
| **Hero Parallax** | Scroll-driven hero image effect |

### Magic UI (magicui.design) — KEY COMPONENTS:
| Component | Best used for |
|-----------|--------------|
| **Number Ticker** | Counting-up animation on stats (26 projects, 4440 hours) |
| **Shimmer Button** | CTA buttons with shimmer sweep effect |
| **Border Beam** | Animated border on highlighted cards |
| **Animated Gradient Text** | Hero headline colour gradient |
| **Blur Fade** | Staggered section entrance animations |
| **Meteors** | Background particle effect for hero |
| **Animated List** | Staggered list items (project actions) |
| **Marquee** | Skills/tools ticker |
| **Word Rotate** | Rotating job title words in hero |
| **Shine Border** | Premium card borders |
| **Ripple** | Background decoration |
| **Dot Pattern** | Subtle background texture |
| **Grid Pattern** | Section backgrounds |

### shadcn/ui (shadcn.com) — KEY COMPONENTS:
| Component | Best used for |
|-----------|--------------|
| **Badge** | Tags, labels, status indicators |
| **Card** | Consistent card containers |
| **Separator** | Section dividers |
| **Tooltip** | Hover text on metrics/tags |
| **Dialog** | Chat modal (already using custom) |
| **Progress** | Skill level bars |
| **Tabs** | Tab navigation (cleaner than custom) |
| **Accordion** | Expandable career history entries |

## Design Principles for This Site

### DO:
- **Lead with impact numbers** — make `#059669` (green) metrics the visual anchor of every project card
- **Use motion purposefully** — entrance animations (Blur Fade, stagger) on scroll/load; hover effects on interactive elements
- **Reduce cognitive load** — one primary action per section, clear visual hierarchy
- **Respect whitespace** — generous padding, let content breathe
- **Make the hero punchy** — headline should be readable in 2 seconds, key stats scannable in 5
- **Sticky navigation** — hiring managers switch tabs frequently; nav must always be visible
- **Animate numbers** — counting-up metrics feel more impactful than static text

### DON'T:
- Autoplay animations that loop forever and distract from content
- Dark mode (not appropriate for a professional CV context)
- Full-screen takeover effects that feel like a personal blog
- Too many accent colours — stick to blue + green + grey
- Over-animate — every interaction should feel intentional
- Mobile-break — test every change at 375px width

## Implementation Pattern
When implementing Aceternity/Magic UI components, since they are copy-paste (not npm packages), extract the minimal component code needed and create it in `src/components/ui/`. Keep dependencies to Framer Motion (already installed) and Tailwind (already installed). Add `clsx` or `cn` utility if needed.

```typescript
// src/lib/utils.ts - add if not present
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Task
The user wants to upgrade the UI. $ARGUMENTS

1. First, take a screenshot to see the current state
2. Identify the specific component(s) to upgrade
3. Select the most appropriate premium components from the libraries above
4. Fetch the component source from ui.aceternity.com or magicui.design if needed
5. Implement the upgrade — create `src/components/ui/` files for any new primitives
6. Take a screenshot after to verify the improvement
7. Run `npx tsc --noEmit` to confirm no TypeScript errors
