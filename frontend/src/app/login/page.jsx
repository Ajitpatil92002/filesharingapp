'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login, token } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Password do not match');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to login');
            }
            toast('Logedin sucessfully');
            const data = await response.json();
            login(data.token);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message || 'something gone worng');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        console.log(token);

        if (token) {
            router.push('/dashboard');
        }
    }, [isLoading]);

    return (
        <div className='container mx-auto flex items-center justify-center min-h-screen py-12'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle>Login to our account</CardTitle>
                    <CardDescription>
                        Enter your info to Login to our account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-4'>
                        {error && (
                            <Alert variant='destructive'>
                                <AlertCircle className='h-4 w-4' />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className='space-y-4'>
                            <Label htmlFor='username'>Username</Label>
                            <Input
                                placeholder='username'
                                id='username'
                                type={'text'}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='space-y-4'>
                            <Label htmlFor='password'>password</Label>
                            <Input
                                placeholder='password'
                                id='password'
                                type={'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='space-y-4'>
                            <Label htmlFor='confirm-password'>
                                Confirm Password
                            </Label>
                            <Input
                                placeholder='Confirm Password'
                                id='confirm-password'
                                type={'password'}
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                    </CardContent>

                    <CardFooter className={'flex flex-col space-y-4 mt-4'}>
                        <Button type='submit'>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                        <div className='text-center text-sm'>
                            Dont have account?{' '}
                            <Link
                                href='/signup'
                                className='text-primary hover:underline'
                            >
                                Signup
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
