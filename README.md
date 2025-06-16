# Dispatch System

This is a mock React + TypeScript application for managing trip dispatches. It uses Tailwind CSS for a mobile-first UI.

## Structure
- **src/types** – shared TypeScript interfaces
- **src/data** – hardcoded mock data
- **src/components** – React components
- **src/styles** – Tailwind CSS setup

All data is kept in local state and there is no backend. Use the dark mode button in the header to toggle themes.

## Development

Install dependencies and start the development server with npm:

```bash
npm install
npm start
```

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
