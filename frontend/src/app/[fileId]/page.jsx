'use client';

import ShareButton from '@/components/shareButton';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const page = () => {
    const { token, logout } = useAuth();
    const { fileId } = useParams();
    const [file, setFile] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        async function fetchFile() {
            const resp = await fetch(`http://localhost:3001/file/${fileId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await resp.json();
            setFile(data);
        }
        fetchFile();
    }, [token, fileId]);

    function copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }

    return (
        <div className='container mx-auto flex items-center justify-center my-20'>
            {file ? (
                <Card className='shadow-lg rounded-lg overflow-hidden w-full'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold'>
                            {file.filename}
                        </CardTitle>
                        <p className='text-sm '>
                            Uploaded by: {file.user.username}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <pre className='whitespace-pre-wrap'>
                            {file.content}
                        </pre>
                    </CardContent>
                    <CardFooter className='flex items-center gap-4'>
                        <Button
                            className='flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg'
                            onClick={() => {
                                copyText(file.content);
                                toast.success('Content copied to clipboard!');
                            }}
                        >
                            {isCopied ? (
                                <CopyCheck className='w-6 h-6' />
                            ) : (
                                <Copy className='w-6 h-6' />
                            )}
                            <span className='text-lg'>
                                {isCopied ? 'Copied' : 'Copy'}
                            </span>
                        </Button>

                        <ShareButton
                            title={file.filename}
                            text={file.content}
                            url={location.href}
                        />
                    </CardFooter>
                </Card>
            ) : (
                <div className='text-gray-500 text-lg'>Loading...</div>
            )}
        </div>
    );
};

export default page;
