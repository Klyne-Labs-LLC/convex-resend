import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Initialize theme on page load
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'system'
  const root = document.documentElement
  
  root.classList.remove('light', 'dark')
  
  if (savedTheme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(savedTheme)
  }
}

// Initialize theme before React renders
initializeTheme()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
