'use client';

import { AuthContext } from '@/components/auth-provider';
import { useContext } from 'react';

export function useAuth() {
    const context = useContext(AuthContext);
    if (context == undefined) {
        throw new Error('useAuth must be user within an AuthProvider');
    }
    return context;
}
