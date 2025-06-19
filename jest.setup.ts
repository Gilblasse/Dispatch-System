import '@testing-library/jest-dom';

// polyfill matchMedia for tests
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as any;
}
