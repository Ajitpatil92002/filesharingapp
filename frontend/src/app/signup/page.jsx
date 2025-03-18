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
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Password do not match');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create account');
            }
            alert('Signed up sucessfully');
            router.push('/login');
        } catch (error) {
            setError(error.message || 'something gone worng');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='container mx-auto flex items-center justify-center min-h-screen py-12'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your info to create an account
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
                            {isLoading ? 'Creating account...' : 'Signup'}
                        </Button>
                        <div className='text-center text-sm'>
                            Already have an accound?{' '}
                            <Link
                                href='/login'
                                className='text-primary hover:underline'
                            >
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
