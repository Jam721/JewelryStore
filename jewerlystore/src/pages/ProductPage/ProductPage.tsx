// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// @ts-ignore
import styles from './ProductPage.module.css';
import { Jewelry } from '../../types/Jewelry';

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [jewelry, setJewelry] = useState<Jewelry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // @ts-ignore
        const fetchJewelry = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5154/api/Jewelry/GetJewelry?jewelryId=${id}`
                );

                if (!response.ok) {
                    throw new Error('Товар не найден');
                }

                const data = await response.json();
                setJewelry(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJewelry();
        }
    }, [id]);

    if (loading) {
        return <div className={styles.loading}>Загрузка товара...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!jewelry) {
        return <div className={styles.error}>Товар не найден</div>;
    }

    return (
        <div className={styles.productPage}>
            <div className={styles.breadcrumbs}>
                <Link to="/">Главная</Link> /
                <Link to="/catalog">Каталог</Link> /
                <span>{jewelry.name}</span>
            </div>

            <div className={styles.productContainer}>
                <div className={styles.productGallery}>
                    <div className={styles.mainImage}>
                        <img
                            src={`http://localhost:9000/jewelrystore/${jewelry.mainImageUrl}`}
                            alt={jewelry.name}
                            className={styles.productImage}
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
                            }}
                        />
                    </div>
                </div>

                <div className={styles.productInfo}>
                    <h1>{jewelry.name}</h1>

                    <div className={styles.priceSection}>
                        <div className={styles.price}>{jewelry.prise.toLocaleString()} руб.</div>
                        <div className={styles.inStock}>
                            {jewelry.inStock ? (
                                <span className={styles.available}>В наличии</span>
                            ) : (
                                <span className={styles.notAvailable}>Нет в наличии</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Вес:</span>
                            <span className={styles.metaValue}>{jewelry.weight} г</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Добавлено:</span>
                            <span className={styles.metaValue}>
                {new Date(jewelry.createdAt).toLocaleDateString('ru-RU')}
              </span>
                        </div>
                    </div>

                    <button
                        className={styles.addToCartBtn}
                        disabled={!jewelry.inStock}
                    >
                        {jewelry.inStock ? 'Добавить в корзину' : 'Товар закончился'}
                    </button>

                    <div className={styles.description}>
                        <h2>Описание изделия</h2>
                        <p>Эксклюзивное ювелирное изделие ручной работы. Каждое украшение создается с особым вниманием к деталям и качеству материалов.</p>
                        <p>Используются только драгоценные металлы высшей пробы и натуральные камни.</p>
                    </div>
                </div>
            </div>

            <div className={styles.relatedProducts}>
                <h2>Похожие товары</h2>
                <div className={styles.relatedList}>
                    {/* Здесь можно добавить похожие товары */}
                    <div className={styles.relatedPlaceholder}>
                        <p>В разработке...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;