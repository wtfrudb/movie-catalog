import React, { useEffect, useState, type JSX } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import CatalogPage from './pages/CatalogPage';
import AdminPanel from './pages/AdminPanel';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import { CartProvider } from './context/CartContext';
import NavbarComponent from './components/NavbarComponent';

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const hideNavbarPaths = ['/login', '/register'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(token.includes('admin'));
    }
  }, []);

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated && isAdmin ? children : <Navigate to="/login" />;
  };

  return (
    <>
      {!shouldHideNavbar && isAuthenticated && (
        <NavbarComponent
          onLogout={() => {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setIsAdmin(false);
          }}
          onSearch={setSearchQuery} // <-- Добавлено
        />
      )}

      <Routes>
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />}
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/catalog"
          element={
            <PrivateRoute>
              <CatalogPage searchQuery={searchQuery} />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin' : '/catalog') : '/login'} />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppWrapper />
      </Router>
    </CartProvider>
  );
}
