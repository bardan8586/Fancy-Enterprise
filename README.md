# Fancy Enterprise

![Fancy Enterprise logo](frontend/public/fancy-logo.webp)

**Full‑stack e‑commerce application built with React, Vite, Redux Toolkit, Express and MongoDB — a portfolio project demonstrating production‑oriented engineering patterns.**


---

Badges

[![React 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-vite-646cff?logo=vite)](https://vitejs.dev/) [![Node.js](https://img.shields.io/badge/Node.js-Node-green?logo=node.js)](https://nodejs.org/)

[![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)

[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK-764ABC?logo=redux)](https://redux-toolkit.js.org/) [![Tailwind](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)

[![Cloudinary](https://img.shields.io/badge/Cloudinary-uploads-FF5A00?logo=cloudinary)](https://cloudinary.com/) [![Sharp](https://img.shields.io/badge/Sharp-image--processing-111111?logo=sharp)](https://sharp.pixelplumbing.com/)

[![Jest](https://img.shields.io/badge/Jest-testing-C21325?logo=jest)](https://jestjs.io/) [![Vitest](https://img.shields.io/badge/Vitest-testing-5A6FF0?logo=vitest)](https://vitest.dev/)

---

Quick pitch

Fancy Enterprise is a portfolio‑grade, full‑stack e‑commerce codebase that demonstrates how to build and operate a modular online retail platform. The repository contains a React SPA (Vite), a Node.js + Express API, and MongoDB persistence with Mongoose models — plus an image upload + processing pipeline and test/seed workflows.

Why this project

- Shows end‑to‑end engineering: frontend, backend, persistence, media pipeline and operational docs.
- Uses production‑oriented patterns: modular routes, middleware, request validation, JWT auth, role checks and seedable test data.
- Designed so an engineer or hiring manager can review architecture and code quickly and run the app locally.


Product preview

This repo includes UI assets and a project logo under `frontend/public/`. There are no curated product screenshots in the repository; the logo above is the canonical project asset. The app is a React SPA with an admin surface (protected routes) and a storefront UI.


Core capabilities (implemented)

- Product catalog with rich filter/search endpoints (`/api/products`)
- Product CRUD endpoints (admin protected)
- User registration & JWT authentication with role checks
- Cart model and checkout workflow (Checkout model → final order conversion)
- Image upload pipeline: Cloudinary stream upload + local processing endpoints (multer + sharp)
- Seed scripts to populate sample data for development and tests
- Test tooling: Jest + Supertest (backend), Vitest (frontend)
- Security middleware: helmet, input sanitization, rate limiting, CORS and logging


Why this matters (engineering decisions)

- Modular Express routes (backend/routes/) keep domain logic separated and maintainable for growth.
- Centralized middleware (security, rate limiting, sanitization, logging) enforces consistent policies across APIs.
- JWT + role checks provide a simple, auditable authorization model for admin/user separation.
- Server‑side image processing (sharp) plus Cloudinary stream upload gives predictable media workflows and optimized assets for the UI.
- Seeders and test scripts enable reproducible local and CI testing.


Architecture

```mermaid
flowchart TD
  Browser[React SPA (Vite)] -->|HTTP JSON| API[Express API Server]
  API -->|Mongoose| DB[MongoDB]
  API --> Upload[Image pipeline: multer → sharp]
  Upload -->|optional| Cloudinary[Cloudinary upload (stream)]
  API --> Email[Email provider (optional)]
  API --> Tests[Jest / Supertest]
```


Request & data flow (summary)

- Client requests products → GET /api/products → Express route → Product model (Mongoose) → JSON response
- Add to cart → (client state with optional server sync) → Checkout POST /api/checkout (protected) → Checkout document created
- Payment state (frontend/provider) → mark checkout paid PUT /api/checkout/:id/pay → finalize to Order POST /api/checkout/:id/finalize


Frontend architecture (evidence)

- Stack: React 19, Vite, Redux Toolkit, React Router v7, Tailwind CSS, Vitest
- Entry: `frontend/src/main.jsx` → `frontend/src/App.jsx` (router + protected routes)
- State: Redux Toolkit (store in `frontend/src/redux`) — app uses Provider in App.jsx
- Tests: Vitest configured via `frontend/package.json` (scripts: `test`, `test:ui`, `test:coverage`)


Backend / API architecture (evidence)

- Stack: Node.js, Express 5, Mongoose
- Route modules: `backend/routes/` (userRoutes, productRoutes, cartRoutes, checkoutRoutes, orderRoutes, adminRoutes, uploadRoutes, etc.)
- Middleware: security (helmet, rate limit), sanitizeInput, CORS, morgan logging, centralized errorHandler
- Auth: JWT validated in `backend/middleware/authMiddleware.js` (protect and admin helpers)


Authentication & security (evidence)

- Password hashing via bcrypt (dependency) when users are created/updated
- JWT tokens (jsonwebtoken) used for auth; JWT_SECRET required (see env example)
- Input sanitization middleware strips HTML from inputs
- Helmet: CSP and other headers configured in `backend/middleware/security.js`
- Rate limiting: express-rate-limit configured (generalLimiter, authLimiter, paymentLimiter)
- CORS: configured in server with FRONTEND_URL and localhost allowances
- Logging: morgan used in development and production modes

Note: these controls are implemented in code; production hardening (secret rotation, webhook signature checks, fine‑tuned CSP, HSTS, and secure secret management) is still required before public deployment.


Image & media pipeline (evidence)

- Cloudinary stream upload endpoint: `POST /api/upload` uses `cloudinary.uploader.upload_stream` with streamifier (requires CLOUDINARY_* env vars).
- Local processing endpoints: `/api/upload/local/image` and `/api/upload/local/images` use disk upload handlers from `config/upload` and call `processImage` to produce optimized and thumbnail variants (sharp is in dependencies).
- Multer is used for multipart handling (memory storage for cloud endpoint, disk for local processing).


E‑commerce flows (what is implemented)

- Product browsing and filtering (public)
- Product create/update/delete (admin-protected)
- Cart model and APIs
- Checkout creation (Checkout document) and endpoints to mark paid and finalize to Order
- Order model and admin order management

Important: backend validates accepted payment methods and records payment status, but **provider‑specific server integrations (Stripe/PayPal webhooks or server SDK flows)** are not present in the server code — payment provider wiring is required for production.


Testing & seed data

- Backend: Jest + Supertest (backend/package.json includes test scripts and dependencies)
- Frontend: Vitest (configured in frontend/package.json)
- Seeders: `backend/seeder.js` and related seed files create sample users/products/orders; run via `npm run seed` in backend


Project structure (high level)

```
frontend/        # React app (Vite) - src/, public/, package.json
backend/         # Express API - server.js, routes/, models/, middleware/, config/, seeder.js
docs/            # Deployment & testing guides (operational checklists)
```


Local setup (short)

1. Clone
```bash
git clone git@github.com:bardan8586/Fancy-Enterprise.git
cd Fancy-Enterprise
```

2. Backend
```bash
cd backend
cp env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, CLOUDINARY_* (if using Cloudinary), email keys, etc.
npm install
npm run seed   # optional: populate sample data
npm start
```

3. Frontend
```bash
cd ../frontend
cp env.example .env
# set VITE API URL if needed
npm install
npm run dev
# open http://localhost:5173
```


Environment variables (authoritative)

See `backend/env.example` for the canonical backend variables. Examples present in the repository include:

- MONGODB_URI
- JWT_SECRET
- PORT
- NODE_ENV
- FRONTEND_URL
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- SENDGRID_API_KEY, MAILGUN_API_KEY, MAILGUN_DOMAIN, GMAIL_USER, GMAIL_PASS
- GOOGLE_CLIENT_ID

Frontend runtime variables are in `frontend/env.example` (copy to `frontend/.env`).


Current status

- The repository contains a complete, reviewable full‑stack implementation suitable as a flagship portfolio project: frontend SPA, modular API, persistence models, image processing pipeline, seeders and test tooling.
- The project is a portfolio/development project and **is not claimed as a running production deployment**.


Limitations & production hardening (next steps)

- Payment provider: backend records payment status, but provider‑specific server integrations (webhook verification) are not implemented and must be added for live payments.
- Secrets: ensure all provider keys are stored in a secret manager and rotated; do not commit them.
- Webhooks & signatures: add signature verification for payment/email webhooks in production.
- CSP & HSTS: tighten CSP and enable HSTS before public deployment.


Tech stack (short)

- Frontend: React 19, Vite, Redux Toolkit, React Router v7, Tailwind CSS, Vitest
- Backend: Node.js, Express 5, Mongoose (MongoDB), multer, sharp, Cloudinary (optional), bcrypt, jsonwebtoken, helmet, express-rate-limit, morgan, Jest + Supertest


Contact / next steps

This README focuses on engineering evidence and setup. If you want I will:

- add 2–3 curated UI screenshots from `frontend/public/images/` (if you confirm the best images to include),
- shorten or expand specific sections for hiring‑manager vs. engineer audiences,
- or prepare a concise one‑page PDF that you can attach to PRs or applications.

---

*Prepared from repository contents (routes, models, middleware, env examples and package files). No source files were modified.*
