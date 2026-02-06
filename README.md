# Shopping List App

A modern web application for managing shopping lists, built with React, TypeScript, Redux Toolkit, and Vite. Users can register, log in, create and organize shopping lists, search and sort items, and share lists with others. Data is persisted using a local JSON Server backend.

## Features

- **User Authentication**: Register, log in, and manage your profile securely.
- **Shopping List Management**: Add, edit, delete, and organize shopping list items with details like name, quantity, notes, category, and images.
- **Search & Sort**: Quickly find items and sort by name, category, or date. Search and sort state is reflected in the URL for easy sharing and navigation.
- **Protected Routes**: Only logged-in users can access main features; public pages for login, registration, and shared lists.
- **Share Lists**: Generate a shareable link for your shopping list. Others can view your list in a read-only mode.
- **Accessibility**: Clean UI, responsive design, and accessible controls.
- **404 Page**: Friendly error page for unknown routes.

## How to Run the Project

### Requirements
- Node.js 18+ (https://nodejs.org/)
- npm (comes with Node.js)

### Setup Steps (Windows PowerShell)

1. **Install dependencies**

```powershell
npm install
```

2. **Start the JSON Server (backend API)**

```powershell
npx json-server --watch db.json --port 3001
```

3. **Start the Vite development server (frontend)**

```powershell
npm run dev
```

4. **Open the app in your browser**

Visit the URL shown in the terminal (usually http://localhost:5173).

### Demo Account
- The app auto-creates a demo user (`demo@example.com` / `password123`) and sample list if you log in with those credentials.
- You can also register your own account and start fresh.

## Project Structure

- `src/pages/` — Main app pages (Login, Register, Home, Profile, Shared, NotFound)
- `src/componets/` — UI and feature components (forms, list, search/sort, share, etc.)
- `src/store/` — Redux store and slices (auth, form, shopping list)
- `src/services/api.ts` — API service for JSON Server
- `db.json` — Local database for JSON Server (users, shoppingLists, sharedLists)

## Troubleshooting
- If login fails, make sure JSON Server is running and `db.json` is not corrupted.
- If sharing returns 404, check that `sharedLists` exists in `db.json` and the share token is correct.
- To reset the app, clear `db.json` to empty arrays for users, shoppingLists, and sharedLists.
