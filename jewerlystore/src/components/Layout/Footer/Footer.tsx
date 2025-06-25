// @ts-ignore
import React from 'react';
// @ts-ignore
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h3>JewelryStore</h3>
                        <p>Эксклюзивные ювелирные изделия высшего качества</p>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Навигация</h4>
                        <ul>
                            <li><a href="/public">Главная</a></li>
                            <li><a href="/catalog">Каталог</a></li>
                            <li><a href="/about">О нас</a></li>
                            <li><a href="/contact">Контакты</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Контакты</h4>
                        <ul>
                            <li>Телефон: +7 (999) 123-45-67</li>
                            <li>Email: info@jewelrystore.ru</li>
                            <li>Адрес: Москва, ул. Ювелирная, д. 1</li>
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Подписка</h4>
                        <p>Подпишитесь на новости и акции</p>
                        <form className={styles.subscribeForm}>
                            <input type="email" placeholder="Ваш email" />
                            <button type="submit">Подписаться</button>
                        </form>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; {new Date().getFullYear()} JewelryStore. Все права защищены.</p>
                    <div className={styles.socialLinks}>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-facebook"></i></a>
                        <a href="#"><i className="fab fa-vk"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;