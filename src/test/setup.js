import '@testing-library/jest-dom/vitest';

// window.matchMedia is not implemented in jsdom; Recharts/motion may query it
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
  });
}
