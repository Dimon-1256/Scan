const API_URL = 'https://gateway.scan-interfax.ru/api/v1';

export const login = async (login, password) => {
    const response = await fetch(`${API_URL}/account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            login,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error(`Ошибка авторизации: ${response.status}`);
    }

    return response.json();
};

export const getUserInfo = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/account/info`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Ошибка получения информации об аккаунте: ${response.status}`);
    }

    const data = await response.json();

    return {
        used: data.eventFiltersInfo.usedCompanyCount,
        limit: data.eventFiltersInfo.companyLimit,
    };
};