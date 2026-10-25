import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, user, loading, doLogout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        doLogout();
        closeMenu();
        navigate('/');
    };

    const handleLogin = () => {
        closeMenu();
        navigate('/auth');
    };

    return (
        <>
            <header className={`header ${isMenuOpen ? 'header-menu-open' : ''}`}>
                <div className="header-logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src="/Logo.svg" alt="Logo" />
                    </Link>
                </div>

                <nav className="header-nav">
                    <Link to="/" className="link">
                        Главная
                    </Link>
                    <a href="#tariffs" className="link">
                        Тарифы
                    </a>
                    <a href="#faq" className="link">
                        FAQ
                    </a>
                </nav>

                {loading ? (
                    <div className="limits-block limits-loading">
                        <div className="loader-spinner"></div>
                    </div>
                ) : isLoggedIn ? (
                    <div className="limits-block">
                        <div className="limits-used">
                            <span>Использовано компаний</span>
                            <strong>{user?.used ?? '—'}</strong>
                        </div>

                        <div className="limits-item">
                            <span>Лимит по компаниям</span>
                            <strong>{user?.limit ?? '—'}</strong>
                        </div>
                    </div>
                ) : null}

                {!loading && (
                    isLoggedIn ? (
                        <div className="header-user-info">
                            <div className="header-user-text">
                                <span>{user?.name || 'Алексей А.'}</span>

                                <button
                                    className="btn-logout"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            </div>

                            <div className="avatar-circle">
                                {user?.name?.charAt(0).toUpperCase() || 'А'}
                            </div>
                        </div>
                    ) : (
                        <div className="header-auth">
                            <a href="#" className="link">
                                Зарегистрироваться
                            </a>

                            <div className="header-auth_border"></div>

                            <button
                                id="btn-login"
                                className="header-button"
                                onClick={handleLogin}
                            >
                                Войти
                            </button>
                        </div>
                    )
                )}

                <button
                    type="button"
                    className="header-burger"
                    aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <span className="header-burger-close">&times;</span>
                    ) : (
                        <span className="header-burger-lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    )}
                </button>
            </header>

            {isMenuOpen && (
                <div className="mobile-menu">
                    <div className="mobile-menu-header">
                        <Link to="/" onClick={closeMenu}>
                            <img src="/Logo_footer.svg" alt="Logo" />
                        </Link>

                        <button
                            type="button"
                            className="mobile-menu-close"
                            aria-label="Закрыть меню"
                            onClick={closeMenu}
                        >
                            &times;
                        </button>
                    </div>

                    <nav className="mobile-menu-nav">
                        <Link to="/" onClick={closeMenu}>
                            Главная
                        </Link>

                        <a href="#tariffs" onClick={closeMenu}>
                            Тарифы
                        </a>

                        <a href="#faq" onClick={closeMenu}>
                            FAQ
                        </a>
                    </nav>

                    {!loading && (
                        <div className="mobile-menu-auth">
                            {isLoggedIn ? (
                                <button
                                    type="button"
                                    className="mobile-menu-login"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            ) : (
                                <>
                                    <a
                                        href="#"
                                        className="mobile-menu-register"
                                    >
                                        Зарегистрироваться
                                    </a>

                                    <button
                                        type="button"
                                        className="mobile-menu-login"
                                        onClick={handleLogin}
                                    >
                                        Войти
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}