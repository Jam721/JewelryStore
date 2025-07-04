// @ts-ignore
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, setAuthToken } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuthenticated } = useAuth();

    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setSuccessMessage('Регистрация прошла успешно! Пожалуйста, войдите.');
            setError('');
        }
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // @ts-ignore
    // В handleSubmit после успешного входа
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = await login(formData.email, formData.password);
            setAuthToken(token);
            setAuthenticated(true); // Обновляем глобальное состояние
            navigate('/account'); // Перенаправляем сразу в аккаунт
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>💎</div>
                    <h1 className={styles.title}>Вход в аккаунт</h1>
                </div>

                <div className={styles.formWrapper}>
                    {successMessage && (
                        <div className={`${styles.message} ${styles.success}`}>
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className={`${styles.message} ${styles.error}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Ваш email"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Ваш пароль"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Нет аккаунта?{' '}
                            <Link to="/register" className={styles.link}>
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;