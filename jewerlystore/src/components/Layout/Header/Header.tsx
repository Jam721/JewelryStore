import { Link, useNavigate, useLocation } from 'react-router-dom';
// @ts-ignore
import styles from './Header.module.css';
import { FaUser, FaShoppingCart, FaGem, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { isAuthenticated, logout } from '../../../services/apiService';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [prevLocation, setPrevLocation] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const headerRef = useRef<HTMLHeadElement>(null);
    const [cartItemsCount, setCartItemsCount] = useState(3); // В реальном приложении это будет из состояния

    // Обновляем состояние аутентификации при изменении URL
    useEffect(() => {
        if (location.pathname !== prevLocation) {
            setAuthenticated(isAuthenticated());
            setPrevLocation(location.pathname);
            setIsMenuOpen(false);
        }
    }, [location, prevLocation]);

    // Добавляем глобальный обработчик событий для обновления состояния
    useEffect(() => {
        const handleAuthChange = () => {
            setAuthenticated(isAuthenticated());
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, []);

    // Эффект для отслеживания скролла
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
        navigate('/');
    };

    return (
        <>
            <motion.header
                ref={headerRef}
                className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <div className={styles.container}>
                    <motion.div
                        className={styles.logoWrapper}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/" className={styles.logo}>
                            <motion.div
                                className={styles.logoIconWrapper}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <FaGem className={styles.logoIcon} />
                            </motion.div>
                            <span className={styles.logoText}>LUXURY JEWELS</span>
                        </Link>
                    </motion.div>

                    <div className={styles.navWrapper}>
                        <nav className={`${styles.nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
                            <motion.div
                                className={styles.navLinks}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ staggerChildren: 0.1 }}
                            >
                                {['/', '/catalog', '/about', '/contact'].map((path, index) => (
                                    <motion.div
                                        key={path}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                    >
                                        <Link
                                            to={path}
                                            className={`${styles.navLink} ${location.pathname === path ? styles.active : ''}`}
                                        >
                                            {index === 0 && 'Главная'}
                                            {index === 1 && 'Коллекции'}
                                            {index === 2 && 'О нас'}
                                            {index === 3 && 'Контакты'}
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </nav>

                        <div className={styles.icons}>
                            {authenticated ? (
                                <motion.div
                                    className={styles.authLinks}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Link to="/account" className={styles.iconLink}>
                                        <FaUser className={styles.icon} />
                                        <span className={styles.tooltip}>Профиль</span>
                                    </Link>
                                    <motion.button
                                        className={styles.iconLink}
                                        onClick={handleLogout}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaSignOutAlt className={styles.icon} />
                                        <span className={styles.tooltip}>Выйти</span>
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <Link to="/login" className={styles.iconLink}>
                                    <FaUser className={styles.icon} />
                                    <span className={styles.tooltip}>Войти</span>
                                </Link>
                            )}

                            <motion.div
                                className={styles.cartWrapper}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link to="/cart" className={styles.iconLink}>
                                    <FaShoppingCart className={styles.icon} />
                                    {cartItemsCount > 0 && (
                                        <motion.span
                                            className={styles.cartCount}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {cartItemsCount}
                                        </motion.span>
                                    )}
                                    <span className={styles.tooltip}>Корзина</span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    <motion.button
                        className={styles.menuButton}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMenuOpen ? (
                            <FaTimes className={styles.menuIcon} />
                        ) : (
                            <FaBars className={styles.menuIcon} />
                        )}
                    </motion.button>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {['/', '/catalog', '/about', '/contact'].map((path) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`${styles.mobileLink} ${location.pathname === path ? styles.active : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {path === '/' && 'Главная'}
                                    {path === '/catalog' && 'Коллекции'}
                                    {path === '/about' && 'О нас'}
                                    {path === '/contact' && 'Контакты'}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
            <div style={{ height: `80px` }} />
        </>
    );
};

export default Header;