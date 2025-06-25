// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import styles from './Header.module.css';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Главная' },
        { path: '/catalog', label: 'Каталог' },
        { path: '/about', label: 'О нас' },
        { path: '/contact', label: 'Контакты' },
        { path: '/account', label: 'Личный кабинет' }
    ];

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span>Jewelry</span>Store
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                    <ul>
                        {navItems.map(item => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={location.pathname === item.path ? styles.active : ''}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.auth}>
                    <Link to="/login" className={styles.loginBtn}>Войти</Link>
                    <Link to="/account" className={styles.cartBtn}>
                        <i className="fas fa-shopping-cart"></i>
                        <span className={styles.cartCount}>0</span>
                    </Link>
                </div>

                <button
                    className={`${styles.menuToggle} ${isMenuOpen ? styles.open : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Header;