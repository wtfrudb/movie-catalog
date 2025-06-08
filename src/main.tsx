// main.tsx или index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      {/* <BrowserRouter> */}
      <App />
      {/* </BrowserRouter> */}
    </CartProvider>
  </React.StrictMode>
);
