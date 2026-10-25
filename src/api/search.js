const API_URL = 'https://gateway.scan-interfax.ru/api/v1';

export const getHistograms = async (requestBody) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `${API_URL}/objectsearch/histograms`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        }
    );
    if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
    }
    return response.json();
};

export const getSearchResults = async (requestBody) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `${API_URL}/objectsearch`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        }
    );
    if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
    }
    return response.json();
};

export const getDocuments = async (ids) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/documents`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ids,
            }),
        }
    );
    if (!response.ok) {
        throw new Error(`Ошибка запроса документов: ${response.status}`);
    }
    return response.json();
};