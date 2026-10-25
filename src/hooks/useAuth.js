import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/user';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        getUserInfo()
            .then((data) => {
                setUser(data);
                setIsLoggedIn(true);
            })
            .catch(() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const doLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
    };
    
    return {
        user,
        isLoggedIn,
        loading,
        doLogout,
    };
};