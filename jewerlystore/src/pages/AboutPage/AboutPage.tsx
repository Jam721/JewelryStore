import { motion } from 'framer-motion';
import { FaGem, FaCrown, FaAward, FaHands, FaHeart } from 'react-icons/fa';
// @ts-ignore
import styles from './AboutPage.module.css';

const AboutPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.7, ease: "easeOut" }
        }
    };

    const imageVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const stats = [
        { value: "14+", label: "Лет опыта", icon: <FaGem /> },
        { value: "5000+", label: "Довольных клиентов", icon: <FaHeart /> },
        { value: "7", label: "Этапов создания", icon: <FaHands /> },
        { value: "24", label: "Месяца гарантии", icon: <FaAward /> }
    ];

    return (
        <div className={styles.aboutPage}>
            {/* Герой секция */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        Наша история
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        Создаем эксклюзивные украшения с 2010 года
                    </motion.p>
                </div>
            </section>

            {/* Основной контент */}
            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* История бренда */}
                <motion.section className={styles.section}>
                    <div className={styles.textContent}>
                        <h2>Мастерская LUXURY JEWELS</h2>
                        <p>
                            Наша история началась в маленькой мастерской в центре Москвы, где основательница бренда,
                            Анна Смирнова, создала свое первое кольцо. Вдохновленная красотой природы и архитектурой
                            исторических зданий, Анна стремилась создавать украшения, которые станут семейными реликвиями.
                        </p>
                        <p>
                            Сегодня мы объединяем традиционные ювелирные техники с современным дизайном. Каждое изделие
                            проходит 7 этапов создания: от эскиза до финальной полировки. Мы используем только
                            сертифицированные материалы и инкрустируем камни вручную.
                        </p>
                        <div className={styles.signature}>
                            <p>Анна Смирнова</p>
                            <span>Основатель и главный дизайнер</span>
                        </div>
                    </div>
                    <motion.div
                        className={styles.imageContainer}
                    >
                        <div className={styles.image1}></div>
                    </motion.div>
                </motion.section>

                {/* Наши ценности */}
                <motion.section className={styles.valuesSection}>
                    <h2>Наши ценности</h2>
                    <div className={styles.valuesGrid}>
                        {[
                            {
                                icon: <FaGem />,
                                title: "Качество",
                                description: "Используем только золото 585 пробы и природные камни высшего качества"
                            },
                            {
                                icon: <FaHands />,
                                title: "Ручная работа",
                                description: "Каждое изделие создается вручную нашими мастерами"
                            },
                            {
                                icon: <FaAward />,
                                title: "Эксклюзивность",
                                description: "Ограниченные коллекции и индивидуальные заказы"
                            },
                            {
                                icon: <FaCrown />,
                                title: "Традиции",
                                description: "Сохраняем вековые традиции ювелирного искусства"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                className={styles.valueCard}
                                whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.valueIcon}>{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Статистика */}
                <motion.section className={styles.statsSection}>
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.statCard}>
                                <div className={styles.statIcon}>{stat.icon}</div>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Галерея */}
                <motion.section className={styles.gallerySection}>
                    <h2>Наша мастерская</h2>
                    <div className={styles.galleryGrid}>
                        <div className={styles.galleryItem1}></div>
                        <div className={styles.galleryItem2}></div>
                        <div className={styles.galleryItem3}></div>
                        <div className={styles.galleryItem4}></div>
                    </div>
                </motion.section>

                {/* Призыв к действию */}
                <motion.section className={styles.ctaSection}>
                    <div className={styles.ctaContent}>
                        <h2>Присоединяйтесь к нашему сообществу</h2>
                        <p>Подпишитесь на новости и получите эксклюзивный доступ к новым коллекциям</p>
                        <div className={styles.ctaForm}>
                            <input type="email" placeholder="Ваш email" />
                            <button>Подписаться</button>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default AboutPage;