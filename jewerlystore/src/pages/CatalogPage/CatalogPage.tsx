// @ts-ignore
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import styles from './CatalogPage.module.css';
import { Jewelry } from '../../types/Jewelry';

const CatalogPage = () => {
    const [jewelries, setJewelries] = useState<Jewelry[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // @ts-ignore
        const fetchJewelries = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5154/api/Jewelry/GetJewelries?pageNumber=${page}&pageSize=10`
                );
                const data = await response.json();
                setJewelries(prev => [...prev, ...data]);
                setHasMore(data.length === 10);
            } catch (error) {
                console.error('Error fetching jewelries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJewelries();
    }, [page]);

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <div className={styles.catalog}>
            <h1>Ювелирные изделия</h1>
            <p className={styles.subtitle}>Эксклюзивные украшения ручной работы</p>

            <div className={styles.products}>
                {jewelries.map(jewelry => (
                    <div key={jewelry.jewelryId} className={styles.productCard}>
                        <Link to={`/product/${jewelry.jewelryId}`}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={`http://localhost:9000/jewelrystore/${jewelry.mainImageUrl}`}
                                    alt={jewelry.name}
                                    className={styles.productImage}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                                {!jewelry.inStock && <div className={styles.outOfStock}>Нет в наличии</div>}
                            </div>
                            <div className={styles.productInfo}>
                                <h3>{jewelry.name}</h3>
                                <p className={styles.price}>{jewelry.prise.toLocaleString()} руб.</p>
                                <p className={styles.weight}>Вес: {jewelry.weight} г</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {loading && <div className={styles.loader}>Загрузка...</div>}

            {!loading && hasMore && (
                <button onClick={loadMore} className={styles.loadMoreBtn}>
                    Показать еще
                </button>
            )}

            {!loading && !hasMore && jewelries.length > 0 && (
                <p className={styles.endMessage}>Вы просмотрели все товары</p>
            )}

            {!loading && jewelries.length === 0 && (
                <p className={styles.noProducts}>Товары не найдены</p>
            )}
        </div>
    );
};

export default CatalogPage;