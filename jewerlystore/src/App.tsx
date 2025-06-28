// @ts-ignore
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CatalogPage from "./pages/CatalogPage/CatalogPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import CartPage from "./pages/CartPage/CartPage";
import AboutPage from "./pages/AboutPage/AboutPage";


function App() {
  return (
      <Router>
          <div className="app">
          <Header />
          <main>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:jewelryId" element={<ProductPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;