// src/pages/CartPage/CartPage.tsx
// @ts-ignore
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import styles from './CartPage.module.css';
import { getImageUrl } from '../../services/apiService';

interface CartItem {
    jewelryId: string;
    name: string;
    prise: number;
    mainImageUrl: string;
    quantity: number;
    weight: number;
    isPremium: boolean;
}

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Загрузка корзины
    useEffect(() => {
        // @ts-ignore
        const fetchCart = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5154/api/Cart/GetAll', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Не удалось загрузить корзину');
                }

                const cartData = await response.json();
                // Преобразуем данные в формат CartItem
                const items = cartData.jewelries.map((j: any) => ({
                    ...j,
                    quantity: 1 // По умолчанию количество 1
                }));

                setCartItems(items);
            } catch (err) {
                setError('Ошибка при загрузке корзины');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Добавление товара в корзину
    // @ts-ignore
    const addToCart = async (jewelryId: string) => {
        try {
            const response = await fetch(`http://localhost:5154/api/Cart/AddJewelryInCart/${jewelryId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Не удалось добавить товар в корзину');
            }

            // Обновляем локальное состояние
            setCartItems(prevItems => {
                // @ts-ignore
                const existingItem = prevItems.find(item => item.jewelryId === jewelryId);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.jewelryId === jewelryId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // Если товара нет в корзине, нужно его добавить
                    // В реальном приложении здесь нужно запросить данные товара
                    return [
                        ...prevItems,
                        {
                            jewelryId,
                            name: 'Новый товар',
                            prise: 0,
                            mainImageUrl: '',
                            quantity: 1,
                            weight: 0,
                            isPremium: false
                        }
                    ];
                }
            });
        } catch (err) {
            console.error('Ошибка при добавлении товара:', err);
        }
    };

    // Удаление товара из корзины
    // @ts-ignore
    const removeFromCart = async (jewelryId: string) => {
        try {
            const response = await fetch(`http://localhost:5154/api/Cart/RemoveJewelryInCart/${jewelryId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить товар из корзины');
            }

            // Обновляем локальное состояние
            setCartItems(prevItems =>
                prevItems.filter(item => item.jewelryId !== jewelryId)
            );
        } catch (err) {
            console.error('Ошибка при удалении товара:', err);
        }
    };

    // Изменение количества товара
    const updateQuantity = (jewelryId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.jewelryId === jewelryId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Расчет итоговой суммы
    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + (item.prise * item.quantity),
            0
        );
    };

    // Оформление заказа
    const handlePlaceOrder = () => {
        setIsOrderPlaced(true);
        // В реальном приложении здесь будет отправка данных на сервер
        setTimeout(() => {
            setCartItems([]);
        }, 3000);
    };

    // Форматирование цены
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка корзины...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.cartPage}>
            <div className={styles.header}>
                <h1>Корзина покупок</h1>
                <p>Ваши избранные ювелирные изделия</p>
            </div>

            {isOrderPlaced ? (
                <motion.div
                    className={styles.orderSuccess}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.successIcon}></div>
                    <h2>Заказ оформлен успешно!</h2>
                    <p>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
                    <Link to="/catalog" className={styles.continueShopping}>
                        Продолжить покупки
                    </Link>
                </motion.div>
            ) : cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <div className={styles.emptyIcon}>
                        <FaShoppingBag />
                    </div>
                    <h2>Ваша корзина пуста</h2>
                    <p>Добавьте товары из каталога, чтобы продолжить</p>
                    <Link to="/catalog" className={styles.shopButton}>
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <>
                    <div className={styles.cartContainer}>
                        <div className={styles.itemsSection}>
                            <div className={styles.itemsHeader}>
                                <span>Товар</span>
                                <span>Цена</span>
                                <span>Количество</span>
                                <span>Итого</span>
                            </div>

                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.jewelryId}
                                        className={styles.cartItem}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        layout
                                    >
                                        <div className={styles.itemInfo}>
                                            <div
                                                className={styles.itemImage}
                                                style={{
                                                    backgroundImage: `url(${getImageUrl(item.mainImageUrl)})`,
                                                }}
                                            >
                                                {item.isPremium && (
                                                    <div className={styles.premiumBadge}>Премиум</div>
                                                )}
                                            </div>
                                            <div className={styles.itemDetails}>
                                                <h3>{item.name}</h3>
                                                <p>Вес: {item.weight} г</p>
                                            </div>
                                        </div>

                                        <div className={styles.itemPrice}>
                                            {formatPrice(item.prise)}
                                        </div>

                                        <div className={styles.quantityControl}>
                                            <button
                                                onClick={() => updateQuantity(item.jewelryId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.jewelryId, item.quantity + 1)}>
                                                <FaPlus />
                                            </button>
                                        </div>

                                        <div className={styles.itemTotal}>
                                            {formatPrice(item.prise * item.quantity)}
                                        </div>

                                        <button
                                            className={styles.removeButton}
                                            onClick={() => removeFromCart(item.jewelryId)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className={styles.summarySection}>
                            <div className={styles.summaryCard}>
                                <h2>Итог заказа</h2>

                                <div className={styles.summaryRow}>
                                    <span>Промежуточный итог</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Доставка</span>
                                    <span>Бесплатно</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Скидка</span>
                                    <span>-{formatPrice(0)}</span>
                                </div>

                                <div className={styles.summaryTotal}>
                                    <span>Итого</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>

                                <button
                                    className={styles.checkoutButton}
                                    onClick={handlePlaceOrder}
                                >
                                    Оформить заказ
                                </button>

                                <Link to="/catalog" className={styles.continueLink}>
                                    Продолжить покупки
                                </Link>
                            </div>

                            <div className={styles.promoSection}>
                                <h3>Есть промокод?</h3>
                                <p>Введите его на следующем шаге оформления заказа</p>
                                <div className={styles.promoInput}>
                                    <input type="text" placeholder="Введите промокод" />
                                    <button>Применить</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.shippingInfo}>
                        <div className={styles.shippingCard}>
                            <h3>🚚 Бесплатная доставка</h3>
                            <p>Бесплатная доставка по всей России при заказе от 20 000 ₽</p>
                        </div>
                        <div className={styles.shippingCard}>
                            <h3>🔒 Безопасная оплата</h3>
                            <p>Оплата картой онлайн или при получении</p>
                        </div>
                        <div className={styles.shippingCard}>
                            <h3>🎁 Подарочная упаковка</h3>
                            <p>Бесплатная подарочная упаковка для всех заказов</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;