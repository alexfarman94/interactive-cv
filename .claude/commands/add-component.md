# Add UI Component

Fetch, adapt, and implement a specific Aceternity UI or Magic UI component into the interactive CV project.

## Usage
`/add-component <component-name> [where to use it]`

Example: `/add-component "number ticker" hero stats`
Example: `/add-component "3d card" project cards`
Example: `/add-component "timeline" career history`

## Steps
1. Identify the component: $ARGUMENTS
2. Fetch its source from:
   - Aceternity: `https://ui.aceternity.com/components/[component-name]`
   - Magic UI: `https://magicui.design/docs/components/[component-name]`
3. Extract just the React/TSX component code
4. Save to `src/components/ui/[ComponentName].tsx`
5. Integrate it into the relevant section of the CV
6. Install any missing deps (usually none — Framer Motion + Tailwind already installed)
7. Run `npx tsc --noEmit` to verify
8. Take a screenshot to confirm

## Project Stack
React 18 + TypeScript + Tailwind CSS + Framer Motion + Lucide React
Utility function: use `cn` from `src/lib/utils.ts` (twMerge + clsx pattern)
