import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load pages for code splitting
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
      <Suspense
        fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
