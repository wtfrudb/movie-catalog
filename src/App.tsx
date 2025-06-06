import React, { useEffect, useState, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/CatalogPage';
import AdminPanel from './pages/AdminPanel';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage'; // <- добавляем страницу заказов
import { CartProvider } from './context/CartContext';
import NavbarComponent from './components/NavbarComponent';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
    <CartProvider>
      <Router>
        {isAuthenticated && (
          <NavbarComponent
            onLogout={() => {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
              setIsAdmin(false);
            }}
          />
        )}

        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />}
          />
          <Route path="/register" element={<Register />} />

          <Route
            path="/catalog"
            element={
              <PrivateRoute>
                <Catalog />
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
            path="/orders"
            element={
              <PrivateRoute>
                <>
                <OrdersPage />
                </>
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
      </Router>
    </CartProvider>
  );
}

export default App;
