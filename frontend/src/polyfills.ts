// Polyfills for compatibility

// Ensure Date.now is available
if (!Date.now) {
  Date.now = function() {
    return new Date().getTime();
  };
}

// Ensure performance.now is available
if (typeof window !== 'undefined' && !window.performance) {
  window.performance = {} as any;
}

if (typeof window !== 'undefined' && !window.performance.now) {
  window.performance.now = function() {
    return Date.now();
  };
}

// Export to ensure the file is included
export {};