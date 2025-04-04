'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { EditIcon, Trash } from 'lucide-react';
import { toast } from 'sonner';

const Dashboardpage = () => {
    const { token, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [files, setFiles] = useState([]);
    const [isFilesLoading, setIsFilesLoading] = useState(false);
    const [error, setError] = useState('');

    // add file states
    const [newFile, setNewFile] = useState({ filename: '', content: '' });
    const [isFileAdding, setIsFileAdding] = useState(false);
    const [addFileerror, setAddFileError] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Edit file states
    const [editFile, setEditFile] = useState({
        id: '',
        filename: '',
        content: '',
    });
    const [isFileEditing, setIsFileEditing] = useState(false);
    const [editFileError, setEditFileError] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Edit file states
    const [isFileDeleting, setIsFileDeleting] = useState(false);

    const [pageno, setPageno] = useState(1);
    const [perpage, setPerpage] = useState(2);
    const [filesCount, setFilesCount] = useState(0);

    const router = useRouter();

    let totalpages = Math.ceil(filesCount / perpage);

    const fetchFiles = useCallback(
        async (pageno, perpage) => {
            setIsFilesLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:3001/files/?pageno=${pageno}&perpage=${perpage}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Failed to fetch user');
                }

                const { files, filesCount } = await response.json();
                console.log(files);

                setFiles(files);
                setFilesCount(filesCount);
            } catch (error) {
                setError(error.message || 'Something went wrong');
            } finally {
                setIsFilesLoading(false);
            }
        },
        [pageno, perpage]
    );

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
            fetchFiles(pageno, perpage);
        } else {
            router.push('/login');
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleAddFile = async e => {
        e.preventDefault();
        setAddFileError('');
        try {
            setIsFileAdding(true);
            const response = await fetch('http://localhost:3001/file', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFile),
            });
            toast('New file added');
            setNewFile({ filename: '', content: '' });
            await fetchFiles();
            setIsAddDialogOpen(false);
        } catch (error) {
            setAddFileError('error: failed to add file');
        } finally {
            setIsFileAdding(false);
        }
    };

    const handleEditFile = async e => {
        e.preventDefault();
        setEditFileError('');
        try {
            setIsFileEditing(true);
            const response = await fetch(
                `http://localhost:3001/file/${editFile.id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editFile),
                }
            );
            toast('file Saved');
            setEditFile({ id: '', filename: '', content: '' });
            await fetchFiles();
            setIsEditDialogOpen(false);
            setEditFileError('');
        } catch (error) {
            console.log(error);

            setEditFileError('error: failed to Save file');
        } finally {
            setIsFileEditing(false);
        }
    };

    const handleDeleteFile = async id => {
        try {
            if (confirm('are u sure to delete the file?')) {
                setIsFileDeleting(true);
                const response = await fetch(
                    `http://localhost:3001/file/${id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast('file Deleted');
                await fetchFiles();
            }
        } catch (error) {
            console.log(error);
            toast('error: failed to Delete file');
        } finally {
            setIsFileDeleting(false);
        }
    };

    const handlePagination = async type => {
        if (type == 'PREV') {
            // setPageno(curr => (curr <= 0 ? 1 : curr - 1));
            setPageno(pageno - 1);
        } else {
            // setPageno(curr => curr => totalpages ? 1 : curr + 1);
            setPageno(pageno + 1);
        }
        await fetchFiles(pageno, perpage);
    };

    return (
        <div className='container mx-auto '>
            <div className='p-5 bg-muted-foreground flex items-center justify-between rounded-3xl mt-2'>
                {error && <div className='text-red-500'>Error: {error}</div>}
                <div className=''>
                    {user ? (
                        <div className='text-lg'>{user.username}</div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
            <div className='flex items-center justify-between gap-4 mt-4'>
                <div>cuu Page NO : {pageno}</div>
                <div>Total Pages : {totalpages}</div>
                <div>filesCount : {filesCount}</div>
                <div>Perpage : {perpage}</div>
            </div>
            <main className='grid grid-cols-3 my-5 gap-4'>
                <div className='col-span-3 flex items-center justify-end'>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        Add File
                    </Button>
                    <Dialog
                        open={isAddDialogOpen}
                        onOpenChange={open => setIsAddDialogOpen(open)}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <Card className='w-full max-w-md'>
                                    <CardHeader className='space-y-1'>
                                        <CardTitle>Add a new File</CardTitle>
                                    </CardHeader>
                                    <form onSubmit={handleAddFile}>
                                        <CardContent className='space-y-4'>
                                            {addFileerror && (
                                                <div className='text-red-500'>
                                                    Error: {addFileerror}
                                                </div>
                                            )}
                                            <div className='space-y-4'>
                                                <Label htmlFor='filename'>
                                                    File Name
                                                </Label>
                                                <Input
                                                    placeholder='filename'
                                                    id='filename'
                                                    type={'text'}
                                                    value={newFile.filename}
                                                    disabled={isFileAdding}
                                                    onChange={e =>
                                                        setNewFile({
                                                            filename:
                                                                e.target.value,
                                                            content:
                                                                newFile.content,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className='space-y-4'>
                                                <Label htmlFor='content'>
                                                    Content
                                                </Label>
                                                <Input
                                                    placeholder='content'
                                                    id='content'
                                                    type={'text'}
                                                    value={newFile.content}
                                                    disabled={isFileAdding}
                                                    onChange={e =>
                                                        setNewFile({
                                                            filename:
                                                                newFile.filename,
                                                            content:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </CardContent>

                                        <CardFooter
                                            className={
                                                'w-full flex  justify-end space-y-4 mt-4'
                                            }
                                        >
                                            <Button
                                                type='submit'
                                                disabled={isFileEditing}
                                            >
                                                {isFileAdding
                                                    ? 'Adding new FIle'
                                                    : 'Save File'}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                {files.length
                    ? files
                          .sort((a, b) => a.id - b.id)
                          .map(file => (
                              <Card>
                                  <CardHeader
                                      className={
                                          'flex items-center justify-between'
                                      }
                                  >
                                      <CardTitle>{file.filename}</CardTitle>
                                      <div className='flex items-center gap-2'>
                                          <Button
                                              ariant='outline'
                                              size='icon'
                                              onClick={() => {
                                                  setEditFile(file);
                                                  setIsEditDialogOpen(true);
                                              }}
                                          >
                                              <EditIcon />
                                          </Button>
                                          <Button
                                              variant='destructive'
                                              size='icon'
                                              onClick={() => {
                                                  handleDeleteFile(file.id);
                                              }}
                                          >
                                              <Trash />
                                          </Button>
                                      </div>
                                  </CardHeader>
                                  <CardContent>
                                      <p>{file.content}</p>
                                  </CardContent>
                              </Card>
                          ))
                    : isFilesLoading
                    ? 'file is loading.....'
                    : 'Files not found'}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={open => setIsEditDialogOpen(open)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <Card className='w-full max-w-md'>
                                <CardHeader className='space-y-1'>
                                    <CardTitle>
                                        Edit {editFile.filename}{' '}
                                    </CardTitle>
                                </CardHeader>
                                <form onSubmit={handleEditFile}>
                                    <CardContent className='space-y-4'>
                                        {editFileError && (
                                            <div className='text-red-500'>
                                                Error: {editFileError}
                                            </div>
                                        )}
                                        <div className='space-y-4'>
                                            <Label htmlFor='filename'>
                                                File Name
                                            </Label>
                                            <Input
                                                placeholder='filename'
                                                id='filename'
                                                type={'text'}
                                                value={editFile.filename}
                                                disabled={isFileEditing}
                                                onChange={e =>
                                                    setEditFile(file => ({
                                                        ...file,
                                                        filename:
                                                            e.target.value,
                                                        content:
                                                            editFile.content,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className='space-y-4'>
                                            <Label htmlFor='content'>
                                                Content
                                            </Label>
                                            <Input
                                                placeholder='content'
                                                id='content'
                                                type={'text'}
                                                value={editFile.content}
                                                disabled={isFileEditing}
                                                onChange={e =>
                                                    setEditFile(file => ({
                                                        ...file,
                                                        filename:
                                                            editFile.filename,
                                                        content: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </CardContent>

                                    <CardFooter
                                        className={
                                            'w-full flex  justify-end space-y-4 mt-4'
                                        }
                                    >
                                        <Button
                                            disabled={isFileEditing}
                                            type='submit'
                                        >
                                            {isFileEditing
                                                ? 'Edting FIle'
                                                : 'Save File'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </main>
            <footer>
                <div className='flex items-center justify-center gap-4'>
                    <Button
                        disabled={pageno <= totalpages}
                        onClick={() => handlePagination('PREV')}
                    >
                        Prev
                    </Button>
                    <Button
                        disabled={pageno >= totalpages}
                        onClick={() => handlePagination('NEXT')}
                    >
                        Next
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default Dashboardpage;
