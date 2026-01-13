# Frontend Dependencies & Scripts Explained

This document explains the tools and libraries used in `package.json`. Since standard JSON files don't support comments, they are documented here.

## Scripts

These are commands you can run with `npm run <script-name>`.

*   **`dev`**: `vite`
    *   Starts the local development server. Use this for coding. It supports "Hot Module Replacement" (HMR), so changes appear instantly.
*   **`build`**: `vite build`
    *   Compiles the application for production (minifies code, optimizes assets) into the `dist` folder.
*   **`build:dev`**: `vite build --mode development`
    *   Same as build, but keeps some debugging information (useful if debugging production issues locally).
*   **`lint`**: `eslint .`
    *   Runs the Linter (ESLint) to check for code style errors and potential bugs.
*   **`preview`**: `vite preview`
    *   Locally previews the *built* production version (from the `dist` folder) to make sure the build works as expected.

## Dependencies (Runtime)

These libraries are required for the application to run in the user's browser.

*   **`react` / `react-dom`**: The core UI library. React is used to build components.
*   **`react-router-dom`**: Handles navigation between pages (e.g., going to `/leaderboard` without reloading the page).
*   **`@tanstack/react-query`**: Fetches and caches data from the backend. (Likely used for leaderboard/game state).
*   **`lucide-react`**: A library of icons (e.g., the play button, pause icon).
*   **`tailwindcss-animate`**: Adds animation utilities to Tailwind CSS.
*   **`clsx` / `tailwind-merge`**: Utilities for constructing CSS class strings dynamically (handling conflicts in Tailwind classes).
*   **`zod`**: A schema validation library. Often used to validate form inputs or API responses.
*   **`react-hook-form`**: Manages form state (inputs, validation) efficiently.
*   **`sonner`**: A library for showing "toast" notifications (popups like "Game Over").
*   **`date-fns`**: A lightweight library for formatting dates (e.g., "2 hours ago").
*   **`recharts`**: A charting library (maybe used for stats/graphs if present).
*   **`@radix-ui/react-*`**: Low-level, unstyled interactive components (Dialogs, Tooltips, dropdowns). They provide the accessible logic, while we style them.
*   **`next-themes`**: Handles switching between Light and Dark mode.

## DevDependencies (Development Only)

These tools are only needed during development (building, linting, testing).

*   **`vite`**: The build tool and dev server. It's extremely fast.
*   **`typescript`**: Adds type safety to JavaScript.
*   **`tailwindcss` / `postcss` / `autoprefixer`**: The CSS framework and its processing tools. Tailwind allows styling via utility classes (e.g., `flex`, `p-4`).
*   **`eslint` / `typescript-eslint` / `@eslint/js`**: Tools to find problems in your code (Linting).
*   **`@vitejs/plugin-react-swc`**: A plugin for Vite to compile React code very fast using SWC (a Rust-based compiler).
*   **`globals`**: Defines global variables for ESLint.
