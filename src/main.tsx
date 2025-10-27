import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
      <QueryClientProvider client={queryClient}>
    <App />
      </QueryClientProvider>
  </HelmetProvider>,
);
