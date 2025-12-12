# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sentinela** is a unified police intelligence platform (Web + Mobile Web) for registering and querying individuals and occurrences. The system serves multiple Brazilian police forces (PM, PC, PF, PRF, PP) with a focus on operational agility in the field and strict access control at the base.

**Frontend Stack:**
- React 19 with TypeScript
- Vite (build tool with SWC for Fast Refresh)
- Tailwind CSS v4 (new architecture with OKLCH colors)
- shadcn/ui components (New York style with slate base color)
- React Router v7 for routing
- Zustand for state management (especially auth)
- React Hook Form + Zod for form validation
- Axios for API communication
- Sonner for toast notifications
- next-themes for dark mode support

**Backend:** NestJS + PostgreSQL (already implemented, separate repository)

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Start development server with HMR
pnpm dev

# Build for production (TypeScript check + Vite build)
pnpm build

# Preview production build
pnpm preview

# Lint codebase
pnpm lint
```

## Architecture & Key Patterns

### Application Structure

The application is designed with a **responsive-first, mobile-priority approach**:
- **Desktop:** Administrative dashboard for user management and auditing
- **Mobile (browser-based):** App-like interface for field officers (data collection, photos, geolocation)

### Path Aliases

TypeScript is configured with path aliases via `@/*` pattern:
```typescript
// tsconfig.json and tsconfig.app.json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

Use `@/components/ui/button` instead of relative imports like `../../components/ui/button`.

### Component Organization

- `src/components/ui/` - shadcn/ui components (avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, radio-group, select, separator, sheet, sonner, table, textarea)
- `src/lib/utils.ts` - Utility functions, notably `cn()` for className merging with `clsx` and `tailwind-merge`

### Styling System

Using **Tailwind CSS v4** with the new inline theme configuration and OKLCH color space:
- Theme variables defined in `src/index.css`
- Custom variant for dark mode: `@custom-variant dark (&:is(.dark *))`
- CSS variables follow shadcn's design system (--background, --foreground, --primary, etc.)
- Professional color scheme with slate base color
- Dark mode support with comprehensive theme variables

### Form Handling Pattern

Forms use React Hook Form + Zod + shadcn Form components:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
```

### State Management

- **Zustand** for global state (auth, user session)
- Local component state with React hooks where appropriate
- No Redux - prefer simple, focused state stores

## Application Requirements (from instructions.md)

### Authentication & Authorization

Four role levels with different permissions:
1. `Administrador Geral` - Full system access
2. `Ponto Focal` - User management (cannot create Admin Geral)
3. `Gestor` - Management level access
4. `Usuário` - Field officer, basic access

**Password Policy:** Numeric only, 6-12 digits (use `type="password"` with `inputmode="numeric"`)

### Key Features & Business Rules

**Individual Registration:**
- Photo uploads: Face, full body
- Multiple tattoos with photo, body location, and description
- Personal data: Full name, alias (vulgo), CPF, mother's name, father's name
- Address with GPS capture (browser geolocation API for lat/long)
- Arrest warrant: checkbox with conditional textarea + PDF upload
- Confidentiality flag: `is_confidential` switch

**Security Rules:**
- Confidential records hidden from `usuario` role (filtered server-side)
- All records track: created by (user + police force + date), last edited by
- Duplicate detection before saving

**Search & Display:**
- Fuzzy search by name, alias, CPF, mother's name (server-side)
- Filter by police force
- Card display: thumbnail, name, alias, warrant indicator icon
- Detail view: photo gallery with zoom modal, mini-map (Leaflet), audit trail

### UI/UX Guidelines

**Mobile-First Approach:**
- Large touch-friendly buttons
- Thumb-accessible navigation
- Use `Drawer` component for mobile menus
- Forms in sections/accordion for easier mobile entry

**Color Scheme:**
- Professional dark tone (police institutional blue/slate)
- `bg-slate-950` for dark backgrounds
- `text-slate-50` for light text
- Primary: institutional dark blue
- Destructive: red for arrest warrant alerts

**Key Components:**
- `Card` - standard container
- `Form`, `FormControl`, `FormField` - Zod-validated forms
- `Drawer` - mobile menus
- `Toast` (via Sonner) - success/error feedback

## ESLint Configuration

Flat config format with TypeScript support:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended config
- React Hooks rules (`eslint-plugin-react-hooks`)
- React Refresh rules (`eslint-plugin-react-refresh`)
- `dist` directory ignored

## TypeScript Configuration

Strict mode enabled with additional strictness:
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `noFallthroughCasesInSwitch`: true
- `noUncheckedSideEffectImports`: true
- `erasableSyntaxOnly`: true

References architecture: split between `tsconfig.app.json` (src files) and `tsconfig.node.json` (build config).

## Important Notes

- **Icon Library:** Lucide React (`lucide-react`) - use this for all icons
- **Package Manager:** pnpm (lockfile: `pnpm-lock.yaml`)
- **Build Target:** ES2022 with DOM APIs
- **Vite Plugin:** Using SWC for React (not Babel) for faster builds
- **No React Compiler:** SWC is not compatible with React Compiler yet

When adding new features, refer to `src/instructions.md` for detailed screen specifications and business requirements in Portuguese.
