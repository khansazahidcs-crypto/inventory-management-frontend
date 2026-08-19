# Inventory Management System — Frontend (React)

React-based frontend providing authentication, dashboard layout, and profile management, consuming the Laravel API backend.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Setup Instructions

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

The app runs at http://localhost:5173

Note: The Laravel backend must be running at http://127.0.0.1:8000 for authentication to work.

## Features (Week 1)

- User registration and login (token-based authentication via Laravel Sanctum)
- Persistent auth token stored in localStorage
- Protected routes (redirect to /login if not authenticated)
- Application layout: header, sidebar, footer
- Profile page showing authenticated user details
- Change password functionality

## Project Structure

src/
- api/           Axios instance and API configuration
- components/    Header, Sidebar, Footer, Layout, ProtectedRoute
- pages/         Login, Register, Dashboard, Profile, Logout
- App.jsx        Route definitions
- main.jsx       App entry point

## Available Routes

| Route | Description | Protected |
|-------|--------------|-----------|
| /login | Login page | No |
| /register | Registration page | No |
| /dashboard | Main dashboard | Yes |
| /profile | User profile and password change | Yes |
| /logout | Logs out and redirects to login | Yes |
## Features (Week 2)
- Master data CRUD modules: Categories, Brands, Suppliers, Customers, Products
- Reusable components: DataTable, FormModal, SearchInput, Pagination, ConfirmDialog
- Image upload for Brand logo and Product image
- Generic API service factory (src/api/services.js) shared across all modules

## Features (Week 3)
- **Purchases** — record a purchase from a supplier with one or more product line items, set status (pending/received/cancelled)
- **Automatic stock update** — marking a purchase as received automatically increases stock for every line item
- **Inventory levels** — view current stock for every product, with a low-stock filter
- **Stock history** — view the full movement log (before/after quantities, type, note) for any product

## Features (Week 4)
- **Sales invoices** — record a sale to a customer (or a walk-in) with one or more product line items; unit price auto-fills from the product's sale price but can be overridden
- **Live totals** — the grand total is calculated as you type, before the invoice is even saved
- **Automatic stock deduction** — completed sales immediately decrease stock for every line item; the form warns inline if a requested quantity exceeds current stock
- **Sales history** — searchable, filterable (by status) list of every invoice, with a "Mark Completed" action for pending sales
- **Printable invoice** — a dedicated invoice view (`/sales/:id`) formatted for `window.print()`, with a "Cancel Sale" action that restores stock

## Features (Week 5)
- **Dashboard** — real KPI cards (products, customers, suppliers, low stock, sales revenue, purchase cost, pending sales/purchases), a month-over-month sales comparison, a 7-day sales trend chart, recent sales/purchases, and a top-selling-products table
- **Reports** — three report pages (Sales, Purchases, Stock), each with filters (date range, or low-stock only), summary cards, a data table, a CSV export button, and a "Print / Save as PDF" button (the browser's native print-to-PDF, since a server-generated PDF library couldn't be installed — see the backend README for why)

## Features (Week 6) — Administration
- **Roles** (`/roles`) — create/edit roles and choose exactly which permissions each one grants, via a checkbox list grouped by area (Master Data, Purchases, Sales, Inventory, Reports, Administration). A role still assigned to a user can't be deleted.
- **Users** (`/users`) — create user accounts directly, assign a role, and activate/deactivate accounts. You can't deactivate or delete your own account.
- **Settings** (`/settings`) — a simple form for the app-wide settings the backend exposes (company name, currency symbol, invoice footer note, default reorder level, low-stock alerts toggle).
- **Activity Logs** (`/activity-logs`) — a read-only, filterable audit trail (by action type and date range) of who did what, across every module.
- **Permission-aware navigation** — a new `usePermissions()` hook (`src/hooks/usePermissions.js`) fetches the current user's role and permissions once and is used to show/hide the whole "Administration" section of the sidebar. This is a UX nicety only — the backend's permission middleware is the real enforcement point, so even a user who somehow reaches `/roles` directly by URL still gets a `403` from the API and a friendly "you don't have permission" message instead of a blank/broken page.
- **Shared component reuse** — Roles and Users are built on the same `DataTable` / `FormModal` / `useResourceList` pattern already used by Categories/Brands/Suppliers/Customers/Products (Users) or a close variant of it (Roles, which needed a grouped-checkbox permission picker instead of a simple field list). `FormModal` gained one new field type (`password`) as a small, additive change to support the "Add User" form.
