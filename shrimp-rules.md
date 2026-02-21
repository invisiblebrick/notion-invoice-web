# Invoice Web MVP - AI Agent Development Guidelines

## Project Overview

- **Purpose**: Notion-based invoice management web app with PDF export
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, TailwindCSS v4, shadcn/ui
- **Data Source**: Notion API with ISR caching
- **Authentication**: URL token-based (?token=SECRET_TOKEN)
- **PDF Generation**: react-to-print library

## Critical Architecture Rules

### TailwindCSS v4 Configuration

- **NEVER** create `tailwind.config.ts` - Tailwind v4 uses CSS-based configuration only
- All theme customization happens in `src/app/globals.css` within `@theme inline` block
- Colors use oklch format and CSS variables in `:root` and `.dark` selectors
- Font variables `--font-geist-sans` and `--font-geist-mono` are defined in `layout.tsx`
- Always use `--color-*` prefix in `@theme inline` to map to Tailwind classes

### Notion API Usage

- Notion API client **MUST ONLY** be used in server components or API routes
- **NEVER** import `@notionhq/client` in client components ('use client')
- Implement exponential backoff with 334ms base delay for rate limiting
- Cache responses using Next.js `fetch` with `revalidate: 60`
- All Notion data must pass through `src/lib/mapper.ts` with Zod validation

### File Structure Standards

```
src/
├── app/
│   ├── page.tsx              # Token auth entry page
│   ├── layout.tsx            # Root layout (Geist fonts)
│   ├── globals.css           # Tailwind v4 theme + print styles
│   ├── invoices/
│   │   ├── page.tsx          # Invoice list
│   │   └── [id]/
│   │       └── page.tsx      # Invoice detail
│   └── api/
│       └── invoices/
│           ├── route.ts      # List API
│           └── [id]/
│               └── route.ts  # Detail API
├── components/
│   ├── ui/                   # shadcn/ui components (DO NOT MODIFY INTERNALS)
│   └── invoices/             # Invoice-specific components
├── lib/
│   ├── notion.ts             # Notion client (server-only)
│   ├── mapper.ts             # Data transformation + Zod validation
│   └── utils.ts              # cn() utility
├── types/
│   └── invoice.ts            # TypeScript interfaces
└── middleware.ts             # Token validation middleware
```

## Component Implementation Rules

### shadcn/ui Components

- Install using: `npx shadcn@latest add [component-name]`
- Style: New York (configured in components.json)
- Base color: neutral
- Icons: lucide-react
- **NEVER** modify internals in `src/components/ui/` - use composition instead
- Use `cn()` from `@/lib/utils` for conditional class merging

### Invoice Components

- Place all invoice-specific components in `src/components/invoices/`
- Server components by default
- Use 'use client' only when needed:
  - react-to-print PDF functionality
  - Browser APIs (localStorage, window, etc.)
  - Client-side state management

### Status Badge Colors

| Status | Classes |
|--------|---------|
| 작성중 | `bg-muted text-muted-foreground` |
| 발행됨 | `bg-blue-100 text-blue-800` |
| 승인됨 | `bg-green-100 text-green-800` |
| 거절됨 | `bg-red-100 text-red-800` |

## Multi-file Coordination Requirements

### When Adding Invoice Types

- [ ] Update `src/types/invoice.ts`
- [ ] Update `src/lib/mapper.ts` with Zod schema
- [ ] Update Notion property mapping if needed

### When Modifying globals.css

- [ ] Check `@theme inline` block variables match `:root` CSS variables
- [ ] Verify print styles in `@media print` block
- [ ] Test both light and dark mode

### When Creating API Routes

- [ ] Implement token validation: `token === process.env.ACCESS_TOKEN`
- [ ] Add proper TypeScript return types
- [ ] Handle Notion API errors with exponential backoff
- [ ] Cache responses with `revalidate: 60`

### When Adding PDF Feature

- [ ] Create component with 'use client' directive
- [ ] Use react-to-print's `useReactToPrint` hook
- [ ] Wrap content in forwarded ref component
- [ ] Add `.no-print` class to hide non-print elements
- [ ] Test A4 page layout (15mm margins)

## Data Flow Standards

```
Notion Database
    ↓
Notion API Client (src/lib/notion.ts) - Server-only
    ↓
Mapper (src/lib/mapper.ts) - Zod validation
    ↓
TypeScript Types (src/types/invoice.ts)
    ↓
API Routes (src/app/api/invoices/) - Token validation + caching
    ↓
Client Components - Display + react-to-print
```

## Authentication Requirements

- Token passed via URL: `?token=SECRET_TOKEN`
- Middleware at `src/middleware.ts` validates token
- Protected routes: `/invoices/*`, `/api/invoices/*`
- Invalid token → redirect to `/`
- Root page (`/`) displays token input form

## Environment Variables

**Required in `.env.local`:**

```bash
NOTION_API_TOKEN=secret_xxx        # Notion integration token
NOTION_DATABASE_ID=xxx-xxx-xxx     # Invoice database ID
ACCESS_TOKEN=your-secret-token     # Client access token
```

**Rules:**
- **NEVER** hardcode tokens or API keys
- Always access via `process.env.VARIABLE_NAME`
- Server-side only for sensitive variables

## Print/PDF Standards

```css
/* In globals.css */
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }

  @page {
    size: A4;
    margin: 15mm;
  }
}
```

- Use `react-to-print` library for PDF generation
- Document title format: `견적서_${invoiceNumber}`
- Test print layout before committing

## Prohibited Actions

1. **NEVER** create `tailwind.config.ts`
2. **NEVER** import `@notionhq/client` in client components
3. **NEVER** hardcode tokens, API keys, or secrets
4. **NEVER** modify shadcn/ui component internals
5. **NEVER** use `@ts-ignore` or `any` type
6. **NEVER** skip Zod validation for Notion data
7. **NEVER** expose Notion API token to client

## API Error Handling

| Status | Scenario | Response |
|--------|----------|----------|
| 401 | Invalid/missing token | `{ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }` |
| 404 | Invoice not found | `{ error: { code: 'NOT_FOUND', message: 'Invoice not found' } }` |
| 429 | Rate limited | Implement exponential backoff |
| 500 | Server error | Log error, return generic message |

## AI Decision-Making Guide

### When Implementing Invoice Features

1. **Check types first** - Does `src/types/invoice.ts` have the required interface?
2. **Validate data** - Always use `src/lib/mapper.ts` with Zod for Notion data
3. **Server vs Client** - Use server components by default, 'use client' only for PDF/browser APIs
4. **Token validation** - All API routes must validate `process.env.ACCESS_TOKEN`
5. **Styling** - Use Tailwind classes, `cn()` for conditionals, avoid inline styles

### When Choosing Component Pattern

| Scenario | Pattern |
|----------|---------|
| Data fetching from Notion | Server Component + API Route |
| PDF download button | Client Component with react-to-print |
| Form input handling | Client Component with useState |
| Display static content | Server Component |

### When Modifying Files

- Check related files in the coordination checklist
- Maintain type safety throughout the data flow
- Follow existing naming conventions
- Test token authentication if modifying protected routes
