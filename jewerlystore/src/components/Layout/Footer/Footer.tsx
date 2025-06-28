// @ts-ignore
import styles from './Footer.module.css';
import {
    FaInstagram, FaFacebookF, FaTwitter, FaPinterest,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock
} from 'react-icons/fa';
import {AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Здесь будет логика подписки
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const socialVariants = {
        hover: {
            scale: 1.1,
            y: -5,
            color: "#d4af37",
            transition: { duration: 0.3 }
        }
    };

    const linkVariants = {
        hover: {
            x: 5,
            color: "#d4af37",
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(212, 175, 55, 0.4)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.95 }
    };

    // @ts-ignore
    return (
        <motion.footer
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className={styles.wave}></div>

            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.div
                    className={styles.brand}
                >
                    <motion.h3
                        className={styles.logo}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        LUXURY JEWELS
                    </motion.h3>
                    <p>Эксклюзивные украшения ручной работы</p>

                    <motion.div
                        className={styles.socials}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {[FaInstagram, FaFacebookF, FaTwitter, FaPinterest].map((Icon, index) => (
                            <motion.a
                                key={index}
                                href="#"
                                className={styles.socialLink}
                                variants={socialVariants}
                                whileHover="hover"
                            >
                                <Icon />
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.links}
                >
                    <h4>Навигация</h4>
                    <ul>
                        {['Главная', 'Коллекции', 'Новинки', 'Премиум', 'О нас'].map((item, index) => (
                            <motion.li
                                key={index}
                            >
                                <motion.a
                                    href="#"
                                    className={styles.link}
                                    variants={linkVariants}
                                    whileHover="hover"
                                >
                                    {item}
                                </motion.a>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    className={styles.contact}
                >
                    <h4>Контакты</h4>
                    <ul>
                        <motion.li>
                            <FaMapMarkerAlt className={styles.contactIcon} />
                            <span>Москва, ул. Арбат 25</span>
                        </motion.li>
                        <motion.li>
                            <FaPhone className={styles.contactIcon} />
                            <span>+7 (495) 123-45-67</span>
                        </motion.li>
                        <motion.li>
                            <FaEnvelope className={styles.contactIcon} />
                            <span>info@luxury-jewels.ru</span>
                        </motion.li>
                        <motion.li>
                            <FaClock className={styles.contactIcon} />
                            <span>Ежедневно: 10:00 - 22:00</span>
                        </motion.li>
                    </ul>
                </motion.div>

                <motion.div
                    className={styles.newsletter}
                >
                    <h4>Подписка</h4>
                    <p>Будьте первыми узнавайте о новых коллекциях</p>

                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Ваш email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <motion.button
                                type="submit"
                                className={styles.submitButton}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Подписаться
                            </motion.button>
                        </div>
                    </motion.form>

                    <AnimatePresence>
                        {subscribed && (
                            <motion.div
                                className={styles.successMessage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                Спасибо за подписку!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            <motion.div
                className={styles.copyright}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <p>&copy; {new Date().getFullYear()} LUXURY JEWELS. Все права защищены.</p>
                <div className={styles.paymentIcons}>
                    {['visa', 'mastercard', 'mir', 'paypal'].map((method, index) => (
                        <div key={index} className={`${styles.paymentIcon} ${styles[method]}`}></div>
                    ))}
                </div>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;