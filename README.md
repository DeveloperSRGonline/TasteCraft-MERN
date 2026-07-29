# TasteCraft — Product Requirement Document & Technical Architecture Spec

**Type:** Social Recipe Sharing + Gourmet Meal Ordering Platform
**Stack:** MERN (TypeScript) + Tailwind + Clerk + Zustand + Razorpay + OpenAI/Gemini
**Theme:** Dark Culinary (Obsidian / Charcoal / Crimson / Amber)

---

## 0. How to use this doc

Every phase is broken into microsteps. Each microstep has a checkbox — tick it off as you finish it. Don't skip ahead; each phase assumes the previous one is done and working.

---

## 1. App Identity & Value Prop

TasteCraft is a place where home chefs and food creators post recipes, build a following, and — if they want — sell those recipes as real orderable dishes or meal kits. Two audiences in one app:

- **Consumers:** browse recipes, save favorites, generate AI recipe ideas, order food from creators they trust.
- **Creators:** publish recipes, turn any recipe into a sellable product with portion sizes and add-ons, run their own mini storefront, track sales.

### Confirmed Tech Stack

| Layer | Choice |
|---|---|
| Language | TypeScript everywhere (client + server) |
| Frontend | React.js + Tailwind CSS |
| Icons/Motion | Lucide React, Framer Motion |
| Scroll | Lenis (smooth scroll on landing) |
| State | Zustand (cart, filters, UI/session state) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | Clerk (JWT + webhooks → Mongo sync) |
| Payments | Razorpay (Orders API + webhook signature verify) |
| AI | OpenAI / Gemini, structured JSON output mode |

> Note on state management: per architecture rule, Zustand owns browser-origin state (cart, filters, modals, portion-size selection). Server-origin data (recipes, orders, user profile) is fetched with React Query, not duplicated into Zustand.

---

## 2. UI/UX Design System — Dark Culinary Theme

### Color Tokens

```
--bg-primary:      #0B0C0E   /* Deep Obsidian */
--bg-surface:       #16181C  /* Charcoal Slate — cards, modals, drawers */
--accent-primary:   #FF385C  /* Vibrant Coral Red — primary CTA */
--accent-primary-2: #E63946  /* Crimson Flame — secondary CTA / badges */
--accent-secondary: #FFB703  /* Warm Amber — ratings, highlights */
--text-heading:     #FFFFFF
--text-body:        #A0AEC0
--border-muted:     #4A5568
```

### Component Rules

- Category tabs: pill-shaped, active state = `rounded-full bg-[--accent-primary-2] text-white`, inactive = ghost outline.
- Cart: persistent right-side drawer, slides in with Framer Motion, always shows live price breakdown.
- Portion selector: horizontal chip group (e.g. `380g / 480g / 560g`), selected chip gets a 2px accent border + subtle glow.
- Meal builder: addon checkboxes rendered as small image-preview cards, not plain checkboxes — user should recognize the addon visually.
- Header: `backdrop-blur-md bg-opacity-60` glass effect, sticky on scroll.
- All modals/drawers use `--bg-surface`, never pure black, to keep depth separation from `--bg-primary`.

### ✅ Phase 0 — Design Foundations

- [x] Set up Tailwind config with the color tokens above as custom theme colors
- [x] Install Lucide React, Framer Motion, Lenis
- [x] Build a base component library: Button, Chip, Card, Drawer, Modal, Input, Badge
- [x] Build the pill-tab component (category switcher) as a reusable primitive
- [x] Build the portion-size chip selector as a reusable primitive
- [x] Set up global dark theme in `tailwind.config.ts` (no light mode needed for v1)

---

## 3. Data Models (MongoDB / Mongoose)

### 3.1 `User.ts`

```ts
interface IUser {
  clerkId: string;        // indexed, unique
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers: ObjectId[];  // ref User
  following: ObjectId[];  // ref User
  savedRecipes: ObjectId[];   // ref Recipe
  archivedRecipes: ObjectId[]; // ref Recipe
  role: 'creator' | 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 `Recipe.ts`

```ts
interface IRecipe {
  title: string;
  description: string;
  category: string;     // 'Main Dish' | 'Vegan' | 'Street Food' | 'Desserts' | ...
  tags: string[];        // freeform, but validated against a controlled tag list
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    isOptional: boolean;
  }[];
  steps: {
    stepNumber: number;
    instruction: string;
    image?: string;
  }[];
  pricing: {
    isOrderable: boolean;
    price: number;
    portionSizes: { label: string; priceOffset: number }[];
  };
  mealAddons: { name: string; price: number; iconUrl: string }[];
  author: ObjectId;      // ref User
  stats: {
    likesCount: number;
    ordersCount: number;
    averageRating: number;
  };
  status: 'published' | 'archived' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 `Order.ts`

```ts
interface IOrder {
  customer: ObjectId;    // ref User
  creator: ObjectId;     // ref User
  items: {
    recipeId: ObjectId;
    portionSize: string;
    customAddons: string[];
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  discountCode?: string;
  deliveryFee: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.4 `Cart.ts`

```ts
interface ICart {
  userId: ObjectId;      // ref User
  items: {
    recipeId: ObjectId;
    portionSize: string;
    customAddons: string[];
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  updatedAt: Date;
}
```

### ✅ Phase 1 — Database Setup & Clerk Auth Hookup

- [x] Initialize MongoDB Atlas cluster + connect via Mongoose in `server/config/db.ts`
- [x] Create `User`, `Recipe`, `Order`, `Cart` models exactly as above
- [x] Add compound indexes: `Recipe.author + status`, `Recipe.category`, `User.clerkId` (unique)
- [x] Set up Clerk project, get publishable + secret keys
- [x] Wrap frontend in `<ClerkProvider>`, protect routes with `<SignedIn>` / `<SignedOut>`
- [x] Build Clerk webhook endpoint `POST /api/v1/webhooks/clerk` to sync `user.created` / `user.updated` / `user.deleted` into MongoDB
- [x] Verify webhook signatures using Clerk's svix secret
- [x] Add a `role` field default (`'user'`) on user creation; manually promote to `'creator'`/`'admin'` for testing
- [x] Test full auth loop: sign up → webhook fires → Mongo user doc created → login persists session

---

## 4. Core Features & Flows

### A. Pre-Auth Landing Page

- Lenis-powered smooth scroll.
- Hero banner: "Recipe of the Day" — picked dynamically by a weighted score of likes + rating + recent order velocity, not just highest likes alone (so a great new recipe can surface too).
- Feature highlight sections with parallax recipe cards.
- Primary CTA → Clerk sign-up/sign-in modal.

### B. Home Dashboard (Post-Login)

- Tab switcher: `My Recipes` (things this user authored) vs `Explore Feed` (community feed, default view).
- Global search bar: custom debounce hook, 300ms delay, searches title + ingredients + category.
- Feed: infinite scroll via Intersection Observer, 10 recipes per page, backed by React Query for caching.
- Right-side cart drawer: persistent, shows subtotal, discount, delivery fee, total — triggers Razorpay checkout.

### C. AI Recipe Generator

- User gives a prompt (e.g. a themed dinner idea).
- LLM call constrained to structured JSON output matching the `Recipe` schema fields: `title`, `description`, `ingredients`, `steps`, `category`, `prepTime`.
- Response pre-fills the Create Recipe form — user reviews, edits, and publishes. AI never publishes directly.

### D. Creator / Admin Dashboard

- Metrics: total sales, active orders, revenue graph (recharts), top performing recipes.
- Order tracker: creator moves orders through `Preparing → Out for Delivery → Delivered`.
- Content management: edit / archive / delete recipes, toggle `isOrderable`.

### ✅ Phase 2 — CRUD Recipe Engine & Zustand Store Setup

- [x] Build `recipeStore.ts` (Zustand) for UI-only state: active filters, active tab, search input value
- [x] Build recipe CRUD API routes (create, read, update, delete, list-by-author)
- [x] Build the Create/Edit Recipe form (multi-step: basic info → ingredients → steps → pricing → addons)
- [x] Build the Explore Feed page with React Query pagination
- [x] Implement the debounced search hook (`useDebounce`, 300ms) and wire it to the search bar
- [x] Implement Intersection Observer infinite scroll on the feed
- [x] Build the recipe detail page (ingredients, steps, ratings, "Add to Cart" if orderable)
- [x] Build save/like/follow toggles with optimistic UI updates

### ✅ Phase 3 — AI Prompt Pipeline & Custom Meal Builder

- [ ] Design the system prompt that forces strict JSON schema output (no prose, no markdown fences)
- [ ] Build `POST /api/v1/recipes/ai-generate` — calls OpenAI/Gemini, validates JSON shape server-side before returning
- [ ] Add a JSON schema validator (e.g. Zod) to reject malformed AI output before it reaches the client
- [ ] Wire AI output into the Create Recipe form as pre-filled (editable) fields
- [ ] Build the portion-size chip selector + live price recalculation
- [ ] Build the "Build Your Meal" addon picker (image-preview checkboxes) with live subtotal update
- [ ] Wire portion + addon selections into the Zustand cart store

### ✅ Phase 4 — Razorpay Checkout & Creator Dashboard

- [ ] Build `POST /api/v1/orders/create-razorpay-order` (creates Razorpay order, returns order id to client)
- [ ] Integrate Razorpay Checkout widget on the frontend cart drawer
- [ ] Build `POST /api/v1/orders/verify-payment` — verify signature server-side, update `Order` status on success
- [ ] Build Razorpay webhook listener as a backup confirmation path (in case client-side verify is missed)
- [ ] Build the Creator Dashboard shell: sidebar nav (Overview, Orders, Recipes, Payouts)
- [ ] Build the Revenue Graph + Top Recipes widgets (recharts)
- [ ] Build the Order Status Tracker UI with status-update action for creators
- [ ] Build Content Management table (edit / archive / delete recipes)

### ✅ Phase 5 — Landing Page, Search Polish, Performance

- [x] Build the Lenis-powered landing page with hero + parallax sections
- [x] Build the "Recipe of the Day" scoring query (weighted: likes + rating + order velocity)
- [ ] Add skeleton loaders for feed, recipe detail, dashboard graphs
- [ ] Add image lazy-loading + compression pipeline for recipe/step images
- [ ] Run a Lighthouse pass — fix any LCP/CLS issues from the glassmorphism header or hero banner
- [ ] Add error boundaries + toast notifications (success/error) app-wide

---

## 5. API Routes Architecture

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/v1/webhooks/clerk` | Sync Clerk user events → MongoDB |
| POST | `/api/v1/recipes/ai-generate` | LLM call → structured JSON recipe |
| GET | `/api/v1/recipes/explore` | Paginated feed (`?page&limit&search&category`) |
| GET | `/api/v1/recipes/hero-recipe` | Fetch "Recipe of the Day" |
| GET | `/api/v1/recipes/:id` | Recipe detail |
| POST | `/api/v1/recipes` | Create recipe |
| PATCH | `/api/v1/recipes/:id` | Update recipe |
| DELETE | `/api/v1/recipes/:id` | Delete/archive recipe |
| POST | `/api/v1/users/toggle-like/:recipeId` | Like/unlike, updates stats |
| POST | `/api/v1/users/toggle-follow/:userId` | Follow/unfollow |
| POST | `/api/v1/cart` | Add/update cart item |
| GET | `/api/v1/cart` | Fetch current user's cart |
| POST | `/api/v1/orders/create-razorpay-order` | Create Razorpay order |
| POST | `/api/v1/orders/verify-payment` | Verify signature, finalize order |
| POST | `/api/v1/webhooks/razorpay` | Backup payment confirmation |
| GET | `/api/v1/orders/creator` | Creator's incoming orders |
| PATCH | `/api/v1/orders/:id/status` | Update order status |
| GET | `/api/v1/dashboard/metrics` | Sales/revenue/top-recipes for creator dashboard |

---

## 6. Directory Structure

```
tastecraft/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Button, Chip, Card, Drawer, Modal, Badge
│   │   │   ├── recipe/        # RecipeCard, RecipeForm, StepEditor
│   │   │   ├── cart/          # CartDrawer, CartItem, PriceBreakdown
│   │   │   ├── dashboard/     # RevenueGraph, OrderTracker, MetricCard
│   │   │   └── layout/        # Header, Sidebar, Footer
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Explore.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── CreateRecipe.tsx
│   │   │   ├── Dashboard/
│   │   │   └── Profile.tsx
│   │   ├── store/             # Zustand stores (cart, filters, ui)
│   │   ├── hooks/             # useDebounce, useInfiniteScroll, useRazorpay
│   │   ├── lib/                # axios instance, query client, clerk config
│   │   ├── types/              # shared TS interfaces
│   │   └── App.tsx
│   └── tailwind.config.ts
├── server/
│   ├── src/
│   │   ├── config/             # db.ts, clerk.ts, razorpay.ts
│   │   ├── models/             # User.ts, Recipe.ts, Order.ts, Cart.ts
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/         # auth.ts, errorHandler.ts, validate.ts
│   │   ├── services/           # aiService.ts, razorpayService.ts
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
└── README.md
```

### ✅ Phase 1a — Project Scaffolding (do this before Phase 1)

- [ ] Create the folder structure exactly as above
- [ ] Set up TypeScript configs for both client and server
- [ ] Set up ESLint + Prettier shared config
- [ ] Set up `.env.example` files for both client and server (see §7)

---

## 7. Deployment Strategy

- **Frontend:** Vercel — connect repo, set root to `client/`, add env vars (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`).
- **Backend:** Render — connect repo, root `server/`, build command `npm run build`, start command `npm start`. Add env vars (`MONGO_URI`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `OPENAI_API_KEY` or `GEMINI_API_KEY`).
- **Database:** MongoDB Atlas, whitelist Render's static IP (or 0.0.0.0/0 for early dev only).
- **Webhooks:** point Clerk + Razorpay webhook URLs at the deployed Render backend, not localhost.

### ✅ Final Phase — Deployment

- [ ] Deploy backend to Render, confirm health-check route works
- [ ] Deploy frontend to Vercel, confirm it talks to the live backend
- [ ] Update Clerk webhook URL to production backend
- [ ] Update Razorpay webhook URL to production backend
- [ ] Test full flow live: sign up → browse → AI generate → publish → order → pay → status update
- [ ] Set up basic uptime monitoring on the backend

---

*End of PRD. Build phase by phase — don't start Phase 2 until Phase 1's checklist is fully ticked.*