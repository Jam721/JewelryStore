// @ts-ignore
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/apiService';
// @ts-ignore
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // @ts-ignore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );

            navigate('/login', { state: { registrationSuccess: true } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>💎</div>
                    <h1 className={styles.title}>Регистрация</h1>
                </div>

                <div className={styles.formWrapper}>
                    {error && (
                        <div className={`${styles.message} ${styles.error}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Ваше имя"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Ваша фамилия"
                            />
                        </div>

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
                                minLength={6}
                                className={styles.input}
                                placeholder="Придумайте пароль"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Уже есть аккаунт?{' '}
                            <Link to="/login" className={styles.link}>
                                Войти
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;