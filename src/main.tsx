import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            cacheTime: 30 * 60 * 1000, // Keep cache for 30 minutes
            retry: 2, // Retry failed queries twice
            refetchOnWindowFocus: false, // Prevent refetching on tab focus
            enabled: true, // Queries run only when enabled (e.g., user is authenticated)
        }
    }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
  </StrictMode>
);
