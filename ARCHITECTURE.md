# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React 19 / Next.js 16 App Router             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Pages:                Components:                    │   │
│  │  - Landing (/page)    - LoginForm                    │   │
│  │  - Login (/login)     - RegisterForm                 │   │
│  │  - Register (/reg)    - MealSearch (w/ autocomplete) │   │
│  │  - Dashboard (/dash)  - MealResult                   │   │
│  │                       - MealHistory                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  State Management (Zustand)                          │   │
│  │  ├─ auth.store (user, token, isAuthenticated)       │   │
│  │  └─ meal.store (history, results, loading)          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  LocalStorage (Zustand Persist)                      │   │
│  │  └─ Maintains auth session & meal history           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↑ HTTP/JSON ↓
┌─────────────────────────────────────────────────────────────┐
│           Backend API (USDA FoodData Central)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  POST /auth/register     → JWT Token               │   │
│  │  POST /auth/login        → JWT Token               │   │
│  │  POST /get-calories      → Calorie Data            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### Authentication Flow
```
1. Register/Login Form
   ↓
2. Zod Validation (client-side)
   ↓
3. API Call (api.ts)
   ↓
4. Backend: /auth/register or /auth/login
   ↓
5. Receive JWT Token
   ↓
6. Store in Zustand (auth.store)
   ↓
7. Persist to LocalStorage
   ↓
8. Redirect to Dashboard
```

### Meal Lookup Flow
```
1. User Types in MealSearch
   ↓
2. Get Suggestions from Utils (getSuggestedDishes)
   ↓
3. Show Autocomplete Dropdown
   ↓
4. User Submits Form
   ↓
5. Zod Validation
   ↓
6. API Call: /get-calories (with JWT token)
   ↓
7. Receive CaloriesResponse
   ↓
8. Store in Zustand (meal.store)
   ↓
9. Calculate Macros (calculateMacros utility)
   ↓
10. Render MealResult Component
```

### Meal History Flow
```
1. Each successful meal lookup
   ↓
2. Auto-add to mealHistory in Zustand
   ↓
3. Generate unique ID + timestamp
   ↓
4. Persist to LocalStorage
   ↓
5. Render in MealHistory component
   ↓
6. User can delete (removes from store & localStorage)
```

## State Management Architecture

### Auth Store (Zustand)
```typescript
interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}
```

**Persistence**: Configured with Zustand persist middleware
- Stores: `token`, `user`, `isAuthenticated`
- Storage: `localStorage` with key `auth-storage`
- Survives page refreshes

### Meal Store (Zustand)
```typescript
interface MealStore {
  mealHistory: MealEntry[];
  currentResult: CaloriesResponse | null;
  isLoading: boolean;
  error: string | null;
  setCurrentResult: (result) => void;
  addMealToHistory: (result) => void;
  removeMealFromHistory: (id) => void;
  setIsLoading: (bool) => void;
  setError: (error) => void;
}
```

**Persistence**: Stores only `mealHistory` in localStorage
- API calls: state, results, errors (not persisted)
- History: full meal entries with timestamps

## API Layer

### `lib/api.ts` - REST Client
```typescript
// Endpoints
registerUser(data) → POST /auth/register
loginUser(data) → POST /auth/login
getCalories(data, token) → POST /get-calories

// Error Handling
- Automatically includes Authorization header
- Catches network errors
- Formats API errors for UI
```

### Request Structure
```typescript
// Authentication
Headers: {
  "Content-Type": "application/json"
}

// Meal Lookup (Protected)
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

## Form Validation Strategy

### Zod Schemas
```typescript
// registerSchema
- firstName: min 2, max 50 chars
- lastName: min 2, max 50 chars
- email: valid email format
- password: min 8, uppercase, lowercase, number
- confirmPassword: must match password

// loginSchema
- email: valid email format
- password: required

// mealSchema
- dish_name: min 2, max 100 chars
- servings: 0.1-100, decimal support
```

### React Hook Form Integration
- Deferred validation (onChange)
- Field-level error messages
- Form-level submission validation
- No re-render bloat with `watch()`

## Component Architecture

### Page Components (React Server Components)
- `/app/page.tsx` - Landing page
- `/app/login/page.tsx` - Login page
- `/app/register/page.tsx` - Register page
- `/app/dashboard/page.tsx` - Protected dashboard

### Feature Components (Client Components)
```
components/
├── auth/
│   ├── LoginForm.tsx
│   │   ├─ Form handling
│   │   ├─ API integration
│   │   └─ Error display
│   └── RegisterForm.tsx
│       ├─ Multi-field form
│       ├─ Password validation
│       └─ Confirmation
├── meal/
│   ├── MealSearch.tsx
│   │   ├─ Autocomplete logic
│   │   ├─ Suggestion dropdown
│   │   └─ Form submission
│   ├── MealResult.tsx
│   │   ├─ Calorie display
│   │   ├─ Macro calculation
│   │   └─ Data formatting
│   └── MealHistory.tsx
│       ├─ Desktop table view
│       ├─ Mobile card view
│       └─ Delete functionality
└── common/
    ├── Button.tsx
    │   ├─ Loading state
    │   ├─ Variants (primary, secondary, outline)
    │   └─ Size options
    ├── Input.tsx
    │   ├─ Label + field
    │   ├─ Error state
    │   └─ Helper text
    └── Card.tsx
        ├─ Header, Content, Footer
        ├─ Shadow/border styling
        └─ Responsive padding
```

### Component Props Flow
```
Dashboard (Page)
├─ MealSearch
│  └─ onSearch: (data) => Promise<void>
├─ MealResult
│  ├─ result: CaloriesResponse
│  └─ timestamp: number
└─ MealHistory
   ├─ meals: MealEntry[]
   └─ onDeleteMeal: (id) => void
```

## Styling Architecture

### Tailwind CSS Configuration
- **Framework**: Tailwind CSS 4 (new CSS engine)
- **Utility-first**: No custom CSS, composable classes
- **Responsive**: `sm:`, `md:`, `lg:` prefixes
- **Colors**: Blue primary, Gray neutral, gradients for accents

### Design System
```
Colors:
- Primary: blue-600 (interactive elements)
- Success: green-600 (positive feedback)
- Warning: orange-600 (informational)
- Error: red-600 (validation, errors)
- Neutral: gray-* (text, backgrounds)

Spacing:
- Gap: 4px (1), 8px (2), 16px (4), 24px (6)
- Padding: scaled per component

Typography:
- Heading: font-bold, text-lg to text-6xl
- Body: font-normal, text-base to text-sm
- Mono: font-mono for code/values
```

## Error Handling Strategy

### API Errors
```
API Call
├─ Success → Store result → Render
├─ Network Error → Generic message → Retry prompt
├─ 401 Unauthorized → Redirect to login
├─ 400 Bad Request → User-friendly error
└─ 500 Server Error → Generic error
```

### Form Validation
```
User Input
├─ onChange → Real-time Zod validation
├─ onSubmit → Final validation
├─ If valid → API call
└─ If invalid → Show field errors
```

### User Feedback
```
Errors display as:
├─ Red banner/toast at top
├─ Red input border + help text
├─ Disabled submit button (with message)
└─ Clear call-to-action to retry
```

## Performance Optimizations

### Bundle Size
```
Dependencies: ~15 (minimal)
- react, react-dom
- next
- zustand
- zod
- react-hook-form
- lucide-react
- tailwindcss

No heavy libraries (moment, lodash, etc.)
```

### Runtime Performance
```
Zustand for state:
├─ No Redux bloat
├─ Minimal re-renders (selectors)
└─ Built-in devtools

Tailwind CSS:
├─ No runtime CSS-in-JS
├─ Compiled at build time
└─ ~200ms page load

Next.js optimizations:
├─ Code splitting per route
├─ Automatic image optimization
├─ Static generation where possible
└─ API routes as serverless functions
```

### Caching Strategy
```
localStorage:
├─ Auth state (token, user)
├─ Meal history (full entries)
└─ Persists across sessions

Session:
├─ React state for UI state
├─ Form validation errors
└─ Loading states
```

## Security Considerations

### Frontend Security
```
Token Storage:
├─ localStorage (vulnerable to XSS)
├─ Not in cookie (easier for this demo)
├─ Token scoped to API base URL
└─ Auto-cleared on logout

Validation:
├─ Client-side Zod validation
├─ Server-side validation required
├─ No secrets in client code
└─ Environment variables prefixed with NEXT_PUBLIC_

Headers:
├─ Content-Type: application/json
├─ Authorization: Bearer <token>
└─ CORS handling by backend
```

### Recommended Production Additions
- HTTPS only (automatic on Vercel)
- CSP headers (Content-Security-Policy)
- CSRF tokens (if using cookies)
- Rate limiting (at backend)
- Input sanitization (libraries: DOMPurify)

## Testing Strategy

### Unit Tests (Recommended)
```typescript
// Utility functions
calculateMacros() → correct macro breakdown
formatDate() → correct date formatting
getSuggestedDishes() → filters and sorts

// Components
MealSearch → renders form, accepts input
MealResult → displays data correctly
MealHistory → renders list, delete works
```

### Integration Tests (Recommended)
```typescript
// API integration
register flow → creates account, gets token
login flow → authenticates user
meal lookup → fetches and displays calories

// Store integration
dispatch action → updates store
persists to localStorage → survives refresh
```

### E2E Tests (Cypress recommended)
```javascript
// User journeys
register → login → search meal → delete
login → search → verify history → logout
```

## Monitoring & Debugging

### Development
```
npm run dev
→ Fast refresh on file changes
→ React DevTools for component inspection
→ Network tab for API calls
```

### Production
```
Vercel Analytics:
├─ Real user monitoring
├─ Core Web Vitals
├─ Performance metrics

Recommended: Sentry for error tracking
```

## Deployment Architecture

### Vercel Platform
```
Code Push
  ↓
GitHub Webhook
  ↓
Vercel CI/CD
  ├─ Install deps
  ├─ Build (npm run build)
  ├─ Run tests
  └─ Deploy Serverless Functions
  ↓
CDN Distribution
  ├─ Static assets
  ├─ Cached globally
  └─ Edge optimization
```

### Environment Separation
```
Development: http://localhost:3000
Staging: https://[project]-staging.vercel.app
Production: https://[project].vercel.app (or custom domain)
```

---

**Architecture Last Updated**: January 2026
