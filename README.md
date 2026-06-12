# FLORA — Plant Nursery Website

A frontend-only React + Vite website for FLORA nursery (Lucknow). Orders are handled via WhatsApp. No backend needed to run.

---

## Project Structure

```
PLANT/
└── client/          ← The entire website lives here
    ├── public/      ← Static assets (favicon, sitemap, robots.txt)
    ├── src/
    │   ├── components/
    │   │   ├── layout/    ← Navbar, Footer, SearchModal
    │   │   ├── product/   ← ProductCard, ProductCardSkeleton
    │   │   ├── sections/  ← Hero, FeaturedCategories, FeaturedCollection, AboutSection, SocialProofSection
    │   │   └── ui/        ← CustomCursor
    │   ├── pages/         ← HomePage, ShopPage, ProductDetailPage, AuthPages, ProfilePage, ContactPage, WishlistPage
    │   │   └── admin/     ← AdminDashboard, AdminProducts, AdminOrders, AdminCustomers
    │   ├── services/      ← api.js (axios instance + all API calls)
    │   ├── store/         ← authStore.js (Zustand auth state)
    │   ├── styles/        ← index.css (all design tokens + global styles)
    │   └── utils/         ← helpers.js (WhatsApp links, price formatting, etc.)
    ├── .env             ← Environment variables (WA number, API URL)
    ├── index.html       ← HTML entry point
    ├── vite.config.js   ← Vite configuration
    └── package.json
```

---

## Run Locally

```bash
cd client
npm install        # first time only
npm run dev        # starts at http://localhost:5173
```

---

## Deploy (Frontend Only)

The `client/` folder is a standard Vite + React app. Deploy the **built output** from `client/dist/`.

### Vercel (recommended)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- The `client/vercel.json` is already configured.

### Netlify
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`

### Build for production
```bash
cd client
npm run build      # outputs to client/dist/
npm run preview    # preview the production build locally
```

---

## Environment Variables

Copy `client/.env` and update values:

| Variable | Description |
|----------|-------------|
| `VITE_WA_NUMBER` | WhatsApp number with country code (e.g. `917054416071`) |
| `VITE_API_URL` | Backend API URL (only needed if backend is used) |
| `VITE_APP_URL` | Your deployed frontend URL |

---

## Key Features

- WhatsApp-based ordering (no cart/checkout backend needed)
- Product catalog with categories, search, and filters
- Admin panel (frontend UI only)
- Fully responsive, dark-themed design
- Framer Motion animations, Swiper carousels
