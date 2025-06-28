// src/pages/AccountPage.tsx
// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaSignOutAlt, FaUser, FaCog, FaBox, FaChartBar, FaTimes, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import styles from './AccountPage.module.css';
import {
    fetchUserInfo,
    logout,
    fetchJewelries,
    deleteJewelry,
    addJewelry,
    getImageUrl
} from '../../services/apiService';

interface UserInfo {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface Jewelry {
    jewelryId: string;
    name: string;
    prise: number;
    weight: number;
    mainImageUrl: string;
    category: number;
    isPremium: boolean;
}

const AccountPage = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [jewelries, setJewelries] = useState<Jewelry[]>([]);
    const [isDeleting, setIsDeleting] = useState<{[key: string]: boolean}>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '1',
        prise: '',
        quantity: '',
        weight: '',
        isPremium: false,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // @ts-ignore
        const loadUserInfo = async () => {
            try {
                setLoading(true);
                const data = await fetchUserInfo();
                setUserInfo(data);

                if (data.role === 'admin') {
                    const products = await fetchJewelries(1, 100);
                    setJewelries(products);
                }
            } catch (err) {
                setError('Не удалось загрузить информацию о пользователе');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUserInfo();
    }, []);

    // @ts-ignore
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // @ts-ignore
    const handleDeleteJewelry = async (jewelryId: string) => {
        try {
            setIsDeleting(prev => ({ ...prev, [jewelryId]: true }));
            await deleteJewelry(jewelryId);
            setJewelries(prev => prev.filter(item => item.jewelryId !== jewelryId));
        } catch (error) {
            console.error('Delete error:', error);
            alert('Не удалось удалить товар');
        } finally {
            setIsDeleting(prev => ({ ...prev, [jewelryId]: false }));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // @ts-ignore
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo || userInfo.role !== 'admin') return;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('Name', newProduct.name);
            formData.append('Category', newProduct.category);
            formData.append('Prise', newProduct.prise);
            formData.append('Quantity', newProduct.quantity);
            formData.append('Weight', newProduct.weight);
            formData.append('IsPremium', newProduct.isPremium.toString());

            if (selectedImage) {
                formData.append('mainImageUrl', selectedImage);
            } else {
                formData.append('mainImageUrl', '');
            }

            const createdJewelry = await addJewelry(formData);

            setJewelries(prev => [...prev, createdJewelry]);

            setNewProduct({
                name: '',
                category: '1',
                prise: '',
                quantity: '',
                weight: '',
                isPremium: false
            });

            clearImage();
            setShowAddForm(false);
        } catch (error) {
            console.error('Add product error:', error);
            alert('Не удалось добавить товар');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.header}>
                    <motion.div
                        className={styles.avatar}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className={styles.avatarPlaceholder}>
                            {userInfo?.firstName.charAt(0)}
                            {userInfo?.lastName.charAt(0)}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className={styles.title}>Личный кабинет</h1>
                        <div className={styles.userName}>
                            {userInfo?.firstName} {userInfo?.lastName}
                        </div>
                        <div className={styles.userEmail}>{userInfo?.email}</div>
                        <div className={`${styles.roleBadge} ${userInfo?.role === 'admin' ? styles.admin : ''}`}>
                            {userInfo?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                        </div>
                    </motion.div>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUser /> Профиль
                    </button>

                    {userInfo?.role === 'admin' && (
                        <>
                            <button
                                className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <FaBox /> Товары
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
                                onClick={() => setActiveTab('stats')}
                            >
                                <FaChartBar /> Статистика
                            </button>
                        </>
                    )}

                    <button
                        className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <FaCog /> Настройки
                    </button>
                </div>

                <div className={styles.content}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className={styles.tabContent}
                            >
                                <h2 className={styles.sectionTitle}>Персональная информация</h2>
                                <div className={styles.infoGrid}>
                                    <motion.div
                                        className={styles.infoItem}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className={styles.infoLabel}>Имя:</span>
                                        <span className={styles.infoValue}>{userInfo?.firstName}</span>
                                    </motion.div>
                                    <motion.div
                                        className={styles.infoItem}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <span className={styles.infoLabel}>Фамилия:</span>
                                        <span className={styles.infoValue}>{userInfo?.lastName}</span>
                                    </motion.div>
                                    <motion.div
                                        className={styles.infoItem}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className={styles.infoLabel}>Email:</span>
                                        <span className={styles.infoValue}>{userInfo?.email}</span>
                                    </motion.div>
                                    <motion.div
                                        className={styles.infoItem}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <span className={styles.infoLabel}>Роль:</span>
                                        <span className={styles.infoValue}>
                      {userInfo?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                                    </motion.div>
                                </div>

                                <h2 className={styles.sectionTitle}>История заказов</h2>
                                <div className={styles.ordersPlaceholder}>
                                    <p>У вас пока нет завершенных заказов</p>
                                    <Link to="/catalog" className={styles.browseBtn}>
                                        Перейти в каталог
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'products' && userInfo?.role === 'admin' && (
                            <motion.div
                                key="products"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className={styles.tabContent}
                            >
                                <div className={styles.adminHeader}>
                                    <h2 className={styles.sectionTitle}>Управление товарами</h2>
                                    <motion.button
                                        className={styles.addProductBtn}
                                        onClick={() => setShowAddForm(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaPlus /> Добавить товар
                                    </motion.button>
                                </div>

                                <AnimatePresence>
                                    {showAddForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={styles.addForm}
                                        >
                                            <div className={styles.formHeader}>
                                                <h3>Добавить новый товар</h3>
                                                <button
                                                    className={styles.closeForm}
                                                    onClick={() => {
                                                        setShowAddForm(false);
                                                        clearImage();
                                                    }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>

                                            <form onSubmit={handleAddProduct}>
                                                <div className={styles.formGroup}>
                                                    <label>Название товара *</label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.name}
                                                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                                        required
                                                        placeholder="Например: Золотое кольцо с бриллиантом"
                                                    />
                                                </div>

                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label>Категория *</label>
                                                        <select
                                                            value={newProduct.category}
                                                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                                            required
                                                        >
                                                            <option value="1">Браслеты</option>
                                                            <option value="2">Кольца</option>
                                                            <option value="3">Серьги</option>
                                                            <option value="4">Колье</option>
                                                        </select>
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label>Количество *</label>
                                                        <input
                                                            type="number"
                                                            value={newProduct.quantity}
                                                            onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                                                            required
                                                            min="0"
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label>Цена (₽) *</label>
                                                        <input
                                                            type="number"
                                                            value={newProduct.prise}
                                                            onChange={(e) => setNewProduct({...newProduct, prise: e.target.value})}
                                                            required
                                                            min="0"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>

                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label>Вес (г)</label>
                                                        <input
                                                            type="number"
                                                            value={newProduct.weight}
                                                            onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                                                            min="0"
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label className={styles.checkboxLabel}>
                                                            <input
                                                                type="checkbox"
                                                                checked={newProduct.isPremium}
                                                                onChange={(e) => setNewProduct({...newProduct, isPremium: e.target.checked})}
                                                                className={styles.checkboxInput}
                                                            />
                                                            <span className={styles.checkboxCustom}></span>
                                                            Премиум товар
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label>Изображение товара</label>

                                                    {imagePreview ? (
                                                        <div className={styles.imagePreviewContainer}>
                                                            <img
                                                                src={imagePreview}
                                                                alt="Предпросмотр"
                                                                className={styles.imagePreview}
                                                            />
                                                            <button
                                                                type="button"
                                                                className={styles.removeImage}
                                                                onClick={clearImage}
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={styles.imageUpload}
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            <FaImage className={styles.uploadIcon} />
                                                            <span>Нажмите для загрузки изображения</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageSelect}
                                                                ref={fileInputRef}
                                                                className={styles.hiddenInput}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.formActions}>
                                                    <motion.button
                                                        type="button"
                                                        className={styles.cancelBtn}
                                                        onClick={() => {
                                                            setShowAddForm(false);
                                                            clearImage();
                                                        }}
                                                        disabled={uploading}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        Отмена
                                                    </motion.button>
                                                    <motion.button
                                                        type="submit"
                                                        className={styles.submitBtn}
                                                        disabled={uploading}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        {uploading ? 'Добавление...' : 'Добавить товар'}
                                                    </motion.button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className={styles.productsList}>
                                    <div className={styles.listHeader}>
                                        <span>Название</span>
                                        <span>Цена</span>
                                        <span>Действия</span>
                                    </div>

                                    {jewelries.length === 0 ? (
                                        <div className={styles.emptyList}>
                                            <p>Товары не найдены</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            {jewelries.map((item, index) => (
                                                <motion.div
                                                    key={item.jewelryId}
                                                    className={styles.productItem}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <div className={styles.productInfo}>
                                                        <div
                                                            className={styles.productImage}
                                                            style={{
                                                                backgroundImage: `url(${getImageUrl(item.mainImageUrl)})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'
                                                            }}
                                                        ></div>
                                                        <span className={styles.productName}>{item.name}</span>
                                                    </div>

                                                    <div className={styles.productPrice}>
                                                        {item.prise.toLocaleString('ru-RU')} руб.
                                                    </div>

                                                    <div className={styles.productActions}>

                                                        <motion.button
                                                            className={styles.deleteBtn}
                                                            onClick={() => handleDeleteJewelry(item.jewelryId)}
                                                            disabled={isDeleting[item.jewelryId]}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            {isDeleting[item.jewelryId] ? 'Удаление...' : <FaTrash />}
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'stats' && userInfo?.role === 'admin' && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className={styles.tabContent}
                            >
                                <h2 className={styles.sectionTitle}>Статистика магазина</h2>

                                <div className={styles.statsGrid}>
                                    <motion.div
                                        className={styles.statCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className={styles.statValue}>24 560</div>
                                        <div className={styles.statLabel}>Посетителей за месяц</div>
                                    </motion.div>
                                    <motion.div
                                        className={styles.statCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className={styles.statValue}>142</div>
                                        <div className={styles.statLabel}>Заказов за месяц</div>
                                    </motion.div>
                                    <motion.div
                                        className={styles.statCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className={styles.statValue}>1 240 500 ₽</div>
                                        <div className={styles.statLabel}>Общая выручка</div>
                                    </motion.div>
                                    <motion.div
                                        className={styles.statCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className={styles.statValue}>94%</div>
                                        <div className={styles.statLabel}>Удовлетворенность</div>
                                    </motion.div>
                                </div>

                                <div className={styles.chartPlaceholder}>
                                    <h3>График продаж</h3>
                                    <div className={styles.chart}></div>
                                </div>

                                <div className={styles.chartPlaceholder}>
                                    <h3>Популярные товары</h3>
                                    <div className={styles.chart}></div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className={styles.tabContent}
                            >
                                <h2 className={styles.sectionTitle}>Настройки аккаунта</h2>

                                <div className={styles.settingsGroup}>
                                    <h3>Личная информация</h3>
                                    <div className={styles.formGroup}>
                                        <label>Имя</label>
                                        <input type="text" value={userInfo?.firstName || ''} readOnly />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Фамилия</label>
                                        <input type="text" value={userInfo?.lastName || ''} readOnly />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input type="email" value={userInfo?.email || ''} readOnly />
                                    </div>
                                    <motion.button
                                        className={styles.editBtn}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Редактировать
                                    </motion.button>
                                </div>

                                <div className={styles.settingsGroup}>
                                    <h3>Безопасность</h3>
                                    <div className={styles.formGroup}>
                                        <label>Текущий пароль</label>
                                        <input type="password" placeholder="Введите текущий пароль" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Новый пароль</label>
                                        <input type="password" placeholder="Введите новый пароль" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Повторите пароль</label>
                                        <input type="password" placeholder="Повторите новый пароль" />
                                    </div>
                                    <motion.button
                                        className={styles.saveBtn}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Сохранить изменения
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={styles.footer}>
                    <motion.button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <FaSignOutAlt /> Выйти из аккаунта
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default AccountPage;