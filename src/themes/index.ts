// Auto-discover all CSS files in this folder (Vite only)
const themeFiles = import.meta.glob('./*.css', { query: '?url', import: 'default' });

// Create themes array with lazy URL resolution
export const themes = Object.entries(themeFiles).map(([path, urlFn]) => {
  const name = path.replace('./', '').replace('.css', '');
  return { 
    name, 
    getUrl: () => urlFn(),
    // For backwards compatibility, keep the synchronous url property
    get url() {
      return urlFn();
    }
  };
});