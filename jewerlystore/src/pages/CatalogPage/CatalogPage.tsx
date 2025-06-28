// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaTimes, FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import styles from './CatalogPage.module.css';
import {addToCart, fetchJewelries, getImageUrl} from '../../services/apiService';

interface Jewelry {
    jewelryId: string;
    name: string;
    prise: number;
    weight: number;
    inStock: boolean;
    mainImageUrl: string;
    isPremium: boolean;
    watches: number;
    createdAt: string;
    category: number;
}

interface Filters {
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    minWatches?: number;
    maxWatches?: number;
    category?: number;
    sort?: string;
    isPremium?: boolean;
}

const categoryMap: { [key: number]: { name: string; icon: string } } = {
    1: { name: "Браслеты", icon: "🔗" },
    2: { name: "Кольца", icon: "💍" },
    3: { name: "Серьги", icon: "✨" },
    4: { name: "Колье", icon: "📿" },
};

const CatalogPage = () => {
    const [jewelries, setJewelries] = useState<Jewelry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const itemsPerPage = 10;

    const [addingItems, setAddingItems] = useState<{[key: string]: boolean}>({});

    const [filters, setFilters] = useState<Filters>({});
    const [sorting, setSorting] = useState('watches-desc');
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [isPremiumFilter, setIsPremiumFilter] = useState(false);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    const [watchesFilter, setWatchesFilter] = useState('');

    const filterRef = useRef<HTMLDivElement>(null);

    // Закрытие фильтра при клике вне области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // @ts-ignore
        const loadJewelries = async () => {
            try {
                setLoading(true);
                setError('');

                const params: any = {
                    ...filters,
                    sort: sorting,
                    pageNumber: page,
                    pageSize: itemsPerPage
                };

                if (isPremiumFilter) {
                    params.isPremium = true;
                }

                if (activeCategory !== null) {
                    params.category = activeCategory;
                }

                const data = await fetchJewelries(page, itemsPerPage, params);
                setJewelries(data);

                // В реальном приложении бэкенд должен возвращать общее количество
                setTotalPages(Math.ceil(20 / itemsPerPage)); // Примерное значение

            } catch (err) {
                setError('Не удалось загрузить каталог украшений');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadJewelries();
    }, [page, filters, sorting, activeCategory, isPremiumFilter]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // @ts-ignore
    const handleAddToCart = async (jewelryId: string) => {
        try {
            setAddingItems(prev => ({ ...prev, [jewelryId]: true }));
            await addToCart(jewelryId);

            // Визуальная обратная связь
            const addButton = document.querySelector(`[data-id="${jewelryId}"]`);
            if (addButton) {
                addButton.textContent = '✓ Добавлено';
                setTimeout(() => {
                    if (addButton) {
                        addButton.innerHTML = '<FaShoppingCart /> В корзину';
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Не удалось добавить товар в корзину');
        } finally {
            setAddingItems(prev => ({ ...prev, [jewelryId]: false }));
        }
    };

    const applyPriceFilter = () => {
        const newFilters: Filters = {};

        if (priceFilter.min) {
            newFilters.minPrice = Number(priceFilter.min);
        }

        if (priceFilter.max) {
            newFilters.maxPrice = Number(priceFilter.max);
        }

        setFilters(newFilters);
        setPage(1);
        setIsFilterOpen(false);
    };

    const applyDateFilter = () => {
        const newFilters: Filters = {};

        if (dateFilter.start) {
            newFilters.startDate = new Date(dateFilter.start).toISOString();
        }

        if (dateFilter.end) {
            newFilters.endDate = new Date(dateFilter.end).toISOString();
        }

        setFilters(newFilters);
        setPage(1);
        setIsFilterOpen(false);
    };

    const applyWatchesFilter = () => {
        const newFilters: Filters = {};

        if (watchesFilter) {
            newFilters.minWatches = Number(watchesFilter);
        }

        setFilters(newFilters);
        setPage(1);
        setIsFilterOpen(false);
    };

    const handleCategoryFilter = (category: number | null) => {
        setActiveCategory(category);
        setPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSorting(e.target.value);
        setPage(1);
    };

    const togglePremiumFilter = () => {
        setIsPremiumFilter(!isPremiumFilter);
        setPage(1);
    };

    const resetFilters = () => {
        setFilters({});
        setSorting('watches-desc');
        setActiveCategory(null);
        setIsPremiumFilter(false);
        setPriceFilter({ min: '', max: '' });
        setDateFilter({ start: '', end: '' });
        setWatchesFilter('');
        setPage(1);
        setIsFilterOpen(false);
    };

    const toggleFilterPanel = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка каталога...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.catalogPage}>
            <div className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Каталог украшений
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Эксклюзивные ювелирные изделия ручной работы
                </motion.p>
            </div>

            <div className={styles.controls}>
                <div className={styles.sortGroup}>
                    <label>Сортировать:</label>
                    <div className={styles.selectWrapper}>
                        <select value={sorting} onChange={handleSortChange}>
                            <option value="watches-desc">По популярности (↓)</option>
                            <option value="watches-asc">По популярности (↑)</option>
                            <option value="prise-desc">Цена по убыванию</option>
                            <option value="prise-asc">Цена по возрастанию</option>
                            <option value="createdAt-desc">Сначала новые</option>
                            <option value="createdAt-asc">Сначала старые</option>
                        </select>
                        <div className={styles.selectArrow}></div>
                    </div>
                </div>

                <button
                    className={styles.filterToggle}
                    onClick={toggleFilterPanel}
                >
                    <FaFilter /> Фильтры
                </button>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        className={styles.filterPanel}
                        ref={filterRef}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.filterHeader}>
                            <h3>Фильтры</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsFilterOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Цена (₽)</label>
                            <div className={styles.rangeInputs}>
                                <input
                                    type="number"
                                    placeholder="От"
                                    value={priceFilter.min}
                                    onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="До"
                                    value={priceFilter.max}
                                    onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Дата добавления</label>
                            <div className={styles.dateInputs}>
                                <input
                                    type="date"
                                    value={dateFilter.start}
                                    onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                                />
                                <span>до</span>
                                <input
                                    type="date"
                                    value={dateFilter.end}
                                    onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Категории</label>
                            <div className={styles.categories}>
                                <button
                                    className={!activeCategory ? styles.active : ''}
                                    onClick={() => handleCategoryFilter(null)}
                                >
                                    Все
                                </button>
                                <button
                                    className={activeCategory === 1 ? styles.active : ''}
                                    onClick={() => handleCategoryFilter(1)}
                                >
                                    Браслеты
                                </button>
                                <button
                                    className={activeCategory === 2 ? styles.active : ''}
                                    onClick={() => handleCategoryFilter(2)}
                                >
                                    Кольца
                                </button>
                                <button
                                    className={activeCategory === 3 ? styles.active : ''}
                                    onClick={() => handleCategoryFilter(3)}
                                >
                                    Серьги
                                </button>
                                <button
                                    className={activeCategory === 4 ? styles.active : ''}
                                    onClick={() => handleCategoryFilter(4)}
                                >
                                    Колье
                                </button>
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isPremiumFilter}
                                    onChange={togglePremiumFilter}
                                />
                                Только премиум
                            </label>
                        </div>

                        <div className={styles.filterActions}>
                            <button
                                className={styles.applyButton}
                                onClick={() => {
                                    applyPriceFilter();
                                    applyDateFilter();
                                    applyWatchesFilter();
                                }}
                            >
                                Применить
                            </button>
                            <button
                                className={styles.resetButton}
                                onClick={resetFilters}
                            >
                                Сбросить
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.activeFilters}>
                {filters.minPrice && (
                    <span className={styles.filterTag}>
                        Цена от: {formatPrice(filters.minPrice)}
                        <button onClick={() => setPriceFilter({...priceFilter, min: ''})}>
                            <FaTimes />
                        </button>
                    </span>
                )}
                {filters.maxPrice && (
                    <span className={styles.filterTag}>
                        Цена до: {formatPrice(filters.maxPrice)}
                        <button onClick={() => setPriceFilter({...priceFilter, max: ''})}>
                            <FaTimes />
                        </button>
                    </span>
                )}
                {isPremiumFilter && (
                    <span className={styles.filterTag}>
                        Премиум
                        <button onClick={togglePremiumFilter}>
                            <FaTimes />
                        </button>
                    </span>
                )}
                {activeCategory && categoryMap[activeCategory] && (
                    <span className={styles.filterTag}>
                        {categoryMap[activeCategory].name}
                        <button onClick={() => setActiveCategory(null)}>
                            <FaTimes />
                        </button>
                    </span>
                )}
            </div>

            <div className={styles.productsGrid}>
                <AnimatePresence>
                    {jewelries.length > 0 ? (
                        jewelries.map((jewelry, index) => (
                            <motion.div
                                key={jewelry.jewelryId}
                                className={`${styles.productCard} ${jewelry.isPremium ? styles.premium : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                whileHover={{ y: -10, boxShadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                            >
                                {jewelry.isPremium && (
                                    <div className={styles.premiumBadge}>
                                        <FaStar /> Премиум
                                    </div>
                                )}

                                <Link to={`/product/${jewelry.jewelryId}`} className={styles.productLink}>
                                    <div className={styles.imageContainer}>
                                        <div
                                            className={styles.productImage}
                                            style={{
                                                backgroundImage: `url(${getImageUrl(jewelry.mainImageUrl)})`,
                                            }}
                                        >
                                            {!jewelry.inStock && (
                                                <div className={styles.outOfStock}>Нет в наличии</div>
                                            )}
                                        </div>

                                        <div className={styles.hoverOverlay}>
                                            <div className={styles.hoverContent}>
                                                <FaEye className={styles.eyeIcon} />
                                                <span>Быстрый просмотр</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.productInfo}>
                                        <div className={styles.categoryTag}>
                                            {categoryMap[jewelry.category]?.icon || '✨'}
                                            {categoryMap[jewelry.category]?.name || 'Украшение'}
                                        </div>

                                        <h3 className={styles.productName}>{jewelry.name}</h3>

                                        <div className={styles.price}>{formatPrice(jewelry.prise)}</div>

                                        <div className={styles.meta}>
                                            <span>Вес: {jewelry.weight} г</span>
                                            <span>👁 {jewelry.watches}</span>
                                            <span>📅 {formatDate(jewelry.createdAt)}</span>
                                        </div>
                                    </div>
                                </Link>

                                <button
                                    className={`${styles.addToCartBtn} ${!jewelry.inStock ? styles.disabled : ''}`}
                                    disabled={!jewelry.inStock || addingItems[jewelry.jewelryId]}
                                    onClick={() => handleAddToCart(jewelry.jewelryId)}
                                    data-id={jewelry.jewelryId} // Добавлен атрибут для поиска
                                >
                                    {addingItems[jewelry.jewelryId] ? (
                                        'Добавление...'
                                    ) : jewelry.inStock ? (
                                        <>
                                            <FaShoppingCart /> В корзину
                                        </>
                                    ) : (
                                        'Нет в наличии'
                                    )}
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className={styles.noResults}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.noResultsImage}></div>
                            <h3>Товары не найдены</h3>
                            <p>Попробуйте изменить параметры фильтрации</p>
                            <button
                                className={styles.resetButton}
                                onClick={resetFilters}
                            >
                                Сбросить фильтры
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {jewelries.length > 0 && (
                <motion.div
                    className={styles.pagination}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={styles.paginationButton}
                    >
                        &lt;
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`${styles.paginationButton} ${page === index + 1 ? styles.activePage : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className={styles.paginationButton}
                    >
                        &gt;
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default CatalogPage;