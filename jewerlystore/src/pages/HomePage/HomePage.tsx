// @ts-ignore
import React from 'react';
// @ts-ignore
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Эксклюзивные ювелирные изделия</h1>
                    <p>Уникальные украшения ручной работы с драгоценными камнями</p>
                    <button className={styles.ctaButton}>Смотреть коллекцию</button>
                </div>
            </section>

            <section className={styles.featured}>
                <h2>Популярные товары</h2>
                <div className={styles.products}>
                    {/* Здесь будут карточки товаров */}
                </div>
            </section>

            <section className={styles.about}>
                <h2>О нашей мастерской</h2>
                <p>Мы создаем уникальные ювелирные изделия с 1995 года...</p>
            </section>
        </div>
    );
};

export default HomePage;