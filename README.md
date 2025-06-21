# Dispatch-System

## Development

Install dependencies and start the dev server:

```bash
npm install
npm start
```

Copy `.env.example` to `.env` and add your API credentials:

```bash
cp .env.example .env
echo "VITE_OPENCAGE_API_KEY=your-key" >> .env
echo "VITE_NOMINATIM_EMAIL=your-email@example.com" >> .env
```

In the **Active Drivers** section, you can scroll left or right using the mouse
wheel for easier navigation.

## Running Tests

Install dependencies and execute the test suite:

```bash
npm install
npm test
```

The unit tests are written with **Jest**, which runs when you execute `npm test`.
