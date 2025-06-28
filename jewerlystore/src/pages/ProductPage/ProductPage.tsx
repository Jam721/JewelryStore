// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaHeart, FaShareAlt } from 'react-icons/fa';
// @ts-ignore
import styles from './ProductPage.module.css';
import { Jewelry } from '../../types/Jewelry';
import { addToCart } from "../../services/apiService";

const ProductPage = () => {
    const { jewelryId } = useParams<{ jewelryId: string }>();
    const [jewelry, setJewelry] = useState<Jewelry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showShareOptions, setShowShareOptions] = useState(false);

    useEffect(() => {
        // @ts-ignore
        const fetchJewelry = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5154/api/Jewelry/GetJewelry?jewelryId=${jewelryId}`
                );

                if (!response.ok) {
                    throw new Error('Товар не найден');
                }

                const data: Jewelry = await response.json();
                setJewelry(data);
                setSelectedImage(data.mainImageUrl);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        if (jewelryId) {
            fetchJewelry();
        } else {
            setError('ID товара не указан');
            setLoading(false);
        }
    }, [jewelryId]);

    // @ts-ignore
    const handleAddToCart = async () => {
        if (!jewelry || !jewelry.inStock) return;

        try {
            setIsAddingToCart(true);
            await addToCart(jewelry.jewelryId);

            // Визуальная обратная связь
            setIsAddedToCart(true);
            setTimeout(() => setIsAddedToCart(false), 3000);
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Не удалось добавить товар в корзину');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleShare = () => {
        setShowShareOptions(!showShareOptions);
        if (navigator.share) {
            navigator.share({
                title: jewelry?.name || 'Ювелирное изделие',
                text: `Посмотрите это прекрасное ювелирное изделие: ${jewelry?.name}`,
                url: window.location.href
            }).catch(console.error);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка товара...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!jewelry) {
        return <div className={styles.error}>Товар не найден</div>;
    }

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Форматирование цены
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Генерация миниатюр для галереи (в данном случае используем одну и ту же картинку)
    const galleryImages = [
        jewelry.mainImageUrl,
        jewelry.mainImageUrl,
        jewelry.mainImageUrl
    ];

    return (
        <div className={styles.productPage}>
            <div className={styles.breadcrumbs}>
                <Link to="/">Главная</Link> /
                <Link to="/catalog">Каталог</Link> /
                <span>{jewelry.name}</span>
            </div>

            <div className={styles.productContainer}>
                <div className={styles.productGallery}>
                    <div className={styles.mainImageContainer}>
                        <div
                            className={styles.mainImage}
                            style={{
                                backgroundImage: `url(http://localhost:9000/jewelrystore/${selectedImage || jewelry.mainImageUrl})`
                            }}
                        >
                            {jewelry.isPremium && (
                                <div className={styles.premiumBadge}>
                                    <FaStar /> Премиум
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.thumbnails}>
                        {galleryImages.map((img, index) => (
                            <div
                                key={index}
                                className={`${styles.thumbnail} ${selectedImage === img ? styles.active : ''}`}
                                style={{ backgroundImage: `url(http://localhost:9000/jewelrystore/${img})` }}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.actionButton}>
                            <FaHeart /> В избранное
                        </button>
                        <button
                            className={styles.actionButton}
                            onClick={handleShare}
                        >
                            <FaShareAlt /> Поделиться
                        </button>

                        {showShareOptions && (
                            <div className={styles.shareOptions}>
                                <button>Копировать ссылку</button>
                                <button>Поделиться в Facebook</button>
                                <button>Поделиться в Instagram</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.productInfo}>
                    <div className={styles.header}>
                        <h1>{jewelry.name}</h1>
                        <div className={styles.rating}>
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <span>(12 отзывов)</span>
                        </div>
                    </div>

                    <div className={styles.priceSection}>
                        <div className={styles.price}>{formatPrice(jewelry.prise)}</div>
                        <div className={styles.inStock}>
                            {jewelry.inStock ? (
                                <span className={styles.available}>✓ В наличии</span>
                            ) : (
                                <span className={styles.notAvailable}>✗ Нет в наличии</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Вес:</span>
                            <span className={styles.metaValue}>{jewelry.weight} г</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Категория:</span>
                            <span className={styles.metaValue}>
                                {jewelry.category === 1 ? 'Браслеты' :
                                    jewelry.category === 2 ? 'Кольца' :
                                        jewelry.category === 3 ? 'Серьги' : 'Колье'}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Просмотры:</span>
                            <span className={styles.metaValue}>{jewelry.watches}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Добавлено:</span>
                            <span className={styles.metaValue}>{formatDate(jewelry.createdAt)}</span>
                        </div>
                    </div>

                    <div className={styles.cartActions}>
                        <button
                            className={`${styles.addToCartBtn} ${isAddedToCart ? styles.added : ''} ${!jewelry.inStock ? styles.disabled : ''}`}
                            disabled={!jewelry.inStock || isAddingToCart || isAddedToCart}
                            onClick={handleAddToCart}
                        >
                            {isAddingToCart ? (
                                'Добавление...'
                            ) : isAddedToCart ? (
                                '✓ Добавлено в корзину'
                            ) : jewelry.inStock ? (
                                <>
                                    <FaShoppingCart /> Добавить в корзину
                                </>
                            ) : (
                                'Товар закончился'
                            )}
                        </button>

                        <Link to="/cart" className={styles.goToCartBtn}>
                            Перейти в корзину
                        </Link>
                    </div>

                    <div className={styles.description}>
                        <h2>Описание изделия</h2>
                        <p>Эксклюзивное ювелирное изделие ручной работы. Каждое украшение создается с особым вниманием к деталям и качеству материалов.</p>
                        <p>Используются только драгоценные металлы высшей пробы и натуральные камни. Изделие прошло многоэтапную проверку качества и соответствует всем стандартам ювелирного искусства.</p>

                        <h3>Характеристики</h3>
                        <ul className={styles.features}>
                            <li>Материал: золото 585 пробы</li>
                            <li>Вставки: натуральные бриллианты</li>
                            <li>Техника изготовления: ручная работа</li>
                            <li>Гарантия: пожизненная</li>
                            <li>Страна производства: Россия</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.productTabs}>
                <div className={styles.tabHeader}>
                    <button className={`${styles.tab} ${styles.active}`}>Описание</button>
                    <button className={styles.tab}>Характеристики</button>
                    <button className={styles.tab}>Отзывы (12)</button>
                    <button className={styles.tab}>Доставка и оплата</button>
                </div>

                <div className={styles.tabContent}>
                    <h3>Подробное описание</h3>
                    <p>
                        Это ювелирное изделие создано лучшими мастерами нашей мастерской с использованием традиционных
                        техник и современных технологий. Каждый элемент тщательно проработан, а камни подобраны по цвету и размеру.
                    </p>
                    <p>
                        Изделие идеально подходит как для повседневного ношения, так и для особых случаев.
                        Оно станет прекрасным подарком для ваших близких и будет радовать своей красотой долгие годы.
                    </p>

                    <h3>Уход за изделием</h3>
                    <p>
                        Для сохранения первоначального вида изделия рекомендуется:
                    </p>
                    <ul>
                        <li>Хранить в отдельной шкатулке с мягкой обивкой</li>
                        <li>Избегать контакта с химическими веществами</li>
                        <li>Чистить мягкой щеткой с мыльным раствором</li>
                        <li>Снимать перед занятиями спортом и водными процедурами</li>
                    </ul>
                </div>
            </div>

            <div className={styles.relatedProducts}>
                <h2>Похожие товары</h2>
                <div className={styles.relatedGrid}>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className={styles.relatedItem}>
                            <div className={styles.relatedImage}></div>
                            <div className={styles.relatedInfo}>
                                <h3>Похожее украшение {item}</h3>
                                <div className={styles.relatedPrice}>от {formatPrice(15000 + item * 5000)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link to="/catalog" className={styles.viewAllBtn}>
                    Смотреть весь каталог
                </Link>
            </div>
        </div>
    );
};

export default ProductPage;