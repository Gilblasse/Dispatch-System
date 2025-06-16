# Dispatch System

This is a mock React + TypeScript application for managing trip dispatches. It uses a prebuilt CSS file for a mobile-first UI, so Tailwind is not required.

## Structure
- **src/types** – shared TypeScript interfaces
- **src/data** – hardcoded mock data
- **src/components** – React components
- **src/styles** – prebuilt CSS styles

All data is kept in local state and there is no backend. Use the dark mode button in the header to toggle themes.

## Development

Install dependencies and start the development server with npm:

```bash
npm install
npm start
```

Styles are included from the precompiled `src/styles/app.css` file.

The app runs via Vite at `http://localhost:3000`.

To verify type safety, run the TypeScript compiler without emitting files:

```bash
npm run tsc
```

## Testing

Run unit tests with Jest:

```bash
npm test
```
