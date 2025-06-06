import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";

// Lazy load App
const App = lazy(() => import("@/App"));

createRoot(document.getElementById("root")!).render(<App />);
