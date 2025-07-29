// Auto-discover all CSS files in this folder (Vite only)
const themeFiles = import.meta.glob('./*.css', { as: 'url' });

export const themes = Object.entries(themeFiles).map(([path, urlFn]) => {
  const name = path.replace('./', '').replace('.css', '');
  return { name, url: urlFn() };
});