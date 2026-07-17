# Clarity: Project Management SaaS

Clarity is a modern, full-stack project management MVP designed for focused teams. It features a complete user journey from a high-converting landing page to a fully interactive, multiplayer Kanban board.

## 🚀 Features

- **End-to-End User Journey:** Landing page, pricing, mock checkout, signup, and onboarding flows.
- **Multiplayer Kanban Board:** Drag-and-drop tasks across columns with real-time sync across connected clients.
- **Workspaces & Team Invites:** Create workspaces and invite team members using Supabase Edge Functions.
- **Enterprise-Grade Security:** Full PostgreSQL Row-Level Security (RLS) ensures users can only access data within their own workspaces.
- **Modern Checkout UI:** A beautifully designed checkout page simulating Stripe integration with a Developer Demo Mode.

## 🛠 Tech Stack

- **Frontend Framework:** React 18
- **Routing & Data Fetching:** [TanStack Router](https://tanstack.com/router) (SSR/Client routing) + React Query
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Radix UI (Shadcn-style components)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Realtime:** Supabase Realtime WebSockets
- **Serverless:** Supabase Edge Functions (Deno)

## 📦 Database Architecture

The application relies on a robust relational schema:
- `workspaces` - Core organization unit
- `workspace_members` - Role-based access control linking users to workspaces
- `boards` -> `columns` -> `tasks` - The Kanban hierarchy
- `subscriptions` - Manages SaaS billing state

*Security Note: Circular dependencies in RLS between Workspaces and Members are resolved using Postgres `SECURITY DEFINER` functions.*

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Supabase CLI (for local development or edge function deployment)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your Supabase project keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Run the complete schema migration in your Supabase SQL Editor:
```bash
# Copy and execute the contents of:
supabase/migrations/00000000_complete_schema.sql
```

### 4. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:8080`.

## 🧠 Edge Functions
If you wish to test the backend webhook and email simulation:
```bash
supabase login
supabase link --project-ref your_project_ref
supabase functions deploy send-invite
supabase functions deploy stripe-webhook
```

---
*Built with modern AI-First development workflows.*
