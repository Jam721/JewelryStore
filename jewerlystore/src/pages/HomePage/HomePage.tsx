import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGem, FaLeaf, FaAward, FaCrown, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import styles from './HomePage.module.css';
import { fetchJewelries, getImageUrl } from '../../services/apiService';

interface Jewelry {
    jewelryId: string;
    name: string;
    prise: number;
    mainImageUrl: string;
    inStock: boolean;
    isPremium: boolean;
    category: number;
}

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Jewelry[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroLoaded, setHeroLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        // @ts-ignore
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchJewelries(1, 4, {
                    sort: 'watches-desc'
                });
                setFeaturedProducts(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();

        // Задержка для плавного появления героя
        const timer = setTimeout(() => {
            setHeroLoaded(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const features = [
        {
            icon: <FaGem className={styles.featureIcon} />,
            title: "Ручная работа",
            description: "Каждое изделие создается вручную нашими мастерами"
        },
        {
            icon: <FaLeaf className={styles.featureIcon} />,
            title: "Экологичные материалы",
            description: "Используем только сертифицированное золото и драгоценные камни"
        },
        {
            icon: <FaAward className={styles.featureIcon} />,
            title: "Пожизненная гарантия",
            description: "Гарантия на все изделия от производителя"
        }
    ];

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
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.95 }
    };

    const cardVariants = {
        hover: {
            y: -15,
            boxShadow: "0 20px 30px rgba(0,0,0,0.15)",
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className={styles.home}>
            {/* Герой секция с параллакс-эффектом */}
            <section className={`${styles.hero} ${heroLoaded ? styles.heroLoaded : ''}`}>
                <div className={styles.parallax}></div>
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        Эксклюзивные украшения <span>ручной работы</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        Коллекция авторских ювелирных изделий из золота и драгоценных камней
                    </motion.p>
                    <motion.div
                        className={styles.heroButtons}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                    >
                        <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link to="/catalog" className={styles.primaryButton}>
                                Смотреть коллекцию
                            </Link>
                        </motion.div>
                        <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link to="/about" className={styles.secondaryButton}>
                                О мастере
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Преимущества с анимацией появления */}
            <section className={styles.features}>
                <div className={styles.container}>
                    <motion.div
                        className={styles.featuresGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className={styles.featureCard}
                            >
                                <div className={styles.iconWrapper}>
                                    {feature.icon}
                                    <div className={styles.iconGlow}></div>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Популярные товары с плавным появлением */}
            <section className={styles.popular}>
                <div className={styles.sectionHeader}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Популярные товары
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <Link to="/catalog" className={styles.linkWithArrow}>
                            Все товары <FaArrowRight className={styles.arrowIcon} />
                        </Link>
                    </motion.div>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        Загрузка товаров...
                    </div>
                ) : (
                    <motion.div
                        className={styles.productsGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.jewelryId}
                                className={styles.productCard}
                                whileHover="hover"
                            >
                                <motion.div
                                    className={styles.productImage}
                                    style={{
                                        backgroundImage: `url(${getImageUrl(product.mainImageUrl)})`,
                                    }}
                                    variants={cardVariants}
                                >
                                    <div className={styles.imageOverlay}></div>
                                    {product.isPremium && (
                                        <div className={styles.premiumBadge}>
                                            <FaStar /> Премиум
                                        </div>
                                    )}
                                    <div className={styles.categoryTag}>
                                        {(() => {
                                            switch(product.category) {
                                                case 1: return 'Браслет';
                                                case 2: return 'Кольцо';
                                                case 3: return 'Серьги';
                                                case 4: return 'Колье';
                                                default: return 'Украшение';
                                            }
                                        })()}
                                    </div>
                                </motion.div>
                                <div className={styles.productInfo}>
                                    <h3>{product.name}</h3>
                                    <p className={styles.price}>{formatPrice(product.prise)}</p>
                                    <div className={styles.tags}>
                                        {!product.inStock && (
                                            <span className={styles.outOfStockTag}>Нет в наличии</span>
                                        )}
                                    </div>
                                    <motion.div
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Link
                                            to={`/product/${product.jewelryId}`}
                                            className={styles.productButton}
                                        >
                                            Подробнее
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            {/* О нас с плавным переходом */}
            <section className={styles.about}>
                <div className={styles.aboutContent}>
                    <motion.div
                        className={styles.aboutText}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2>Мастерская <span>LUXURY JEWELS</span></h2>
                        <p>
                            Наша история началась в 2010 году с маленькой мастерской в центре Москвы.
                            Сегодня мы создаем эксклюзивные украшения для ценителей настоящего ювелирного искусства.
                        </p>
                        <p>
                            Каждое изделие проходит 7 этапов создания: от эскиза до финальной полировки.
                            Мы используем только лучшие материалы и инкрустируем камни вручную.
                        </p>
                        <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link to="/about" className={styles.aboutButton}>
                                Узнать больше
                            </Link>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className={styles.aboutImage}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    ></motion.div>
                </div>
            </section>

            {/* Рассылка с волновым эффектом */}
            <section className={styles.newsletter}>
                <div className={styles.wave}></div>
                <motion.div
                    className={styles.newsletterContent}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2>Подпишитесь на новости</h2>
                    <p>Получайте первыми информацию о новых коллекциях и эксклюзивных предложениях</p>

                    <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Ваш email"
                                className={styles.newsletterInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <motion.button
                                type="submit"
                                className={styles.newsletterButton}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Подписаться
                            </motion.button>
                        </div>
                    </form>

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
                <div className={styles.waveBottom}></div>
            </section>
        </div>
    );
};

export default HomePage;