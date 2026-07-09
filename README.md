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