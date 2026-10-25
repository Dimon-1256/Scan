import { useState } from 'react';
import { login as loginUser } from '../api/user';
import './AuthPage.css';

export default function AuthPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const isFormFilled = login.trim() !== '' && password.trim() !== '';
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');
        setPasswordError('');

    const trimmedLogin = login.trim();
    const trimmedPassword = password.trim();
        if (!trimmedLogin) {
            setLoginError('Введите корректные данные');
            return;
        }
        if (trimmedLogin.startsWith('+7')) {
            const phone = trimmedLogin.replace(/\D/g, '');
        if (phone.length !== 11) {
            setLoginError('Введите корректные данные');
            return;
        }
        }
        if (!trimmedPassword) {
            setPasswordError('Введите пароль');
            return;
        }
        try {
            const data = await loginUser(trimmedLogin, trimmedPassword);
            localStorage.setItem('token', data.accessToken);
            window.location.href = '/';
        } catch {
            setLoginError('Неверный логин или пароль');
        }
    };

    return (
    <main className="main_auth">
        <section className="auth_title">
            <h1>
                Для оформления подписки
                <br />
                на тариф, необходимо 
                <br />
                авторизоваться.
            </h1>

            <img src="/Auth.svg" alt="Иллюстрация авторизации" />
        </section>

        <section className="auth-container">
            <div className="auth-tabs">
                <button type="button" className="auth-tab active">
                    Войти
                </button>

                <button type="button" className="auth-tab">
                    Зарегистрироваться
                </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="login-input" className="auth-label">
                    Логин или номер телефона:
                </label>

                <input
                type="text"
                id="login-input"
                className={`auth-input ${loginError ? 'auth-input-error' : ''}`}
                placeholder="Введите логин или номер"
                value={login}
                onChange={(event) => {
                setLogin(event.target.value);
                setLoginError('');
                }}
                />

                {loginError && (
                    <span className="auth-error">
                        {loginError}
                    </span>
                )}

                <label htmlFor="password-input" className="auth-label">
                    Пароль:
                </label>

                <input
                type="password"
                id="password-input"
                className={`auth-input ${passwordError ? 'auth-input-error' : ''}`}
                placeholder="Введите пароль"
                value={password}
                onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError('');
                }}
                />

                {passwordError && (
                    <span className="auth-error">
                        {passwordError}
                    </span>
                )}

                <button
                type="submit" className="auth-btn" disabled={!isFormFilled}>
                    Войти
                </button>

                <button type="button" className="auth-link">
                    Восстановить пароль
                </button>

                <p className="auth-subtitle">Войти через:</p>

                <div className="auth-social">
                    <button
                    type="button" className="auth-social-btn" aria-label="Войти через Google">
                        <img src="/Google.svg" alt="Google" />
                    </button>

                    <button
                    type="button" className="auth-social-btn" aria-label="Войти через Facebook">
                        <img src="/Facebook.svg" alt="Facebook" />
                    </button>

                    <button
                    type="button" className="auth-social-btn" aria-label="Войти через Яндекс">
                        <img src="/Yandex.svg" alt="Yandex" />
                    </button>
                </div>
            </form>
        </section>

        <div className="main-auth_img">
            <img src="/Lock.svg" alt="Lock" />
        </div>
    </main>
    );
}