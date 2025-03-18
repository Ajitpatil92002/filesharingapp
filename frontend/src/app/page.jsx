import { Button } from '@/components/ui/button';
import { File, Lock, Share } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className='container mx-auto flex flex-col min-h-screen'>
            <header className='border-b'>
                <div className='container flex justify-between items-center py-4'>
                    <h1>Share Snippet</h1>
                    <div className='flex gap-4 items-center'>
                        <Button variant='outline'>
                            <Link href='/login'>Login</Link>
                        </Button>
                        <Button variant='outline'>
                            <Link href='/signup'>Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className='flex-1'>
                <section className='py-20 bg-gradient-to-b from-background to-muted'>
                    <div className='container text-center space-y-6'>
                        <h2 className='text-4xl text-muted-foreground tracking-tight'>
                            Code and Text Snippets Made Simple
                        </h2>
                        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                            Store, share, and manage your code snippets and text
                            notes with our easy-to-use plaform. Sinup up today
                            to get started
                        </p>
                        <Button asChild size={'lg'} className='mt-6'>
                            <Link href='/signup'>Get Started</Link>
                        </Button>
                    </div>
                </section>
                <section className='py-20'>
                    <div className='container'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            <div className='flex flex-col items-center text-center p-6 space-y-4'>
                                <div className='bg-primary/10 p-4 rounded-full'>
                                    <File className='h-8 w-8 text-primary' />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Easy Snippet Management
                                </h3>
                                <p className='text-muted-foreground'>
                                    Create, view, edit, and delete your code
                                    snippet with our intuitive interface
                                </p>
                            </div>
                            <div className='flex flex-col items-center text-center p-6 space-y-4'>
                                <div className='bg-primary/10 p-4 rounded-full'>
                                    <Share className='h-8 w-8 text-primary' />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Share your code snippets and text notes with
                                    others quickly and easily
                                </h3>
                                <p className='text-muted-foreground'>
                                    Share your code snippets and text notes with
                                    others others quickly and easily
                                </p>
                            </div>
                            <div className='flex flex-col items-center text-center p-6 space-y-4'>
                                <div className='bg-primary/10 p-4 rounded-full'>
                                    <Lock className='h-8 w-8 text-primary' />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Secure Storage
                                </h3>
                                <p className='text-muted-foreground'>
                                    YOur snippets are stored securely and
                                    accessible only to you
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className='borde-t py-6'>
                <div className='container text-center text-sm text-muted-foreground'>
                    &copy; {new Date().getFullYear()} ShareSnippet. All rights
                    reserved
                </div>
            </footer>
        </div>
    );
}
