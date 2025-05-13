import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage.tsx';
import { Toaster } from 'sonner';
import AuthProvider from './provider/AuthProvider.tsx';
import PrivateRoute from './router/PrivetRoute.tsx';
import { ThemeProvider } from './components/ui/theme/ThemeProvider.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><App /></PrivateRoute>,
  },
  {
    path: "/login",
    element: <LoginPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
