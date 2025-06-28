// src/services/apiService.ts
const API_BASE = 'http://localhost:5154/api';

// Добавлен параметр filters в fetchJewelries
export const fetchJewelries = async (
    page = 1,
    pageSize = 10,
    filters: Record<string, any> = {},
) => {
    const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
        ...filters,
    }).toString();

    const response = await fetch(`${API_BASE}/Jewelry/GetJewelries?${params}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

// Для изображений из Minio
export const getImageUrl = (path: string) => {
    return `http://localhost:9000/jewelrystore/${path}`;
};

// Регистрация
export const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    const formData = new FormData();
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('Password', password);

    const response = await fetch(`${API_BASE}/User/Register`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Registration failed');
    }

    return response.text(); // "Success"
};

// Вход
export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/User/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return response.text(); // JWT token
};

// src/services/apiService.ts
export const fetchUserInfo = async () => {
    const response = await fetch(`${API_BASE}/User/MeInfo`, {
        method: 'GET',
        credentials: 'include' // Важно для отправки кук
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    return response.json();
};

// Сохранение токена в куки
export const setAuthToken = (token: string) => {
    document.cookie = `tasty=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    // Вызываем событие для обновления состояния в компонентах
    window.dispatchEvent(new Event('auth-change'));
};

// Проверка аутентификации
export const isAuthenticated = () => {
    // Более надежная проверка наличия куки
    return document.cookie.split(';').some(item => {
        const [name] = item.trim().split('=');
        return name === 'tasty';
    });
};

// Выход
// @ts-ignore
export const logout = async () => {
    try {
        // Вызываем API логаута на сервере
        await fetch(`${API_BASE}/User/Logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout API error:', error);
    }

    // Очищаем куку на клиенте
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        if (name === 'tasty') {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
    }
};

// Функция для добавления товара в корзину
export const addToCart = async (jewelryId: string) => {
    try {
        const response = await fetch(`http://localhost:5154/api/Cart/AddJewelryInCart/${jewelryId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ошибка при добавлении в корзину');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Функция для добавления товара
export const addJewelry = async (formData: FormData) => {
    try {
        const response = await fetch(`${API_BASE}/Jewelry/AddJewelry`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ошибка при добавлении товара');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Функция для удаления товара
export const deleteJewelry = async (jewelryId: string) => {
    try {
        const formData = new FormData();
        formData.append('jewelryId', jewelryId);

        const response = await fetch(`${API_BASE}/Jewelry/DeleteJewelry`, {
            method: 'DELETE',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ошибка при удалении товара');
        }

        return await response.text();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};