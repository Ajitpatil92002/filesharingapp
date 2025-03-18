'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

const Dashboardpage = () => {
    const { token, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3001/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Failed to fetch user');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                setError(error.message || 'Something went wrong');
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div>
            {error && <div>Error: {error}</div>}
            {user ? <div>User: {user.username}</div> : <div>Loading...</div>}
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default Dashboardpage;
