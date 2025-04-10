'use client';

import { toast } from 'sonner';
import { Button } from './ui/button';

const ShareButton = ({ title, text, url }) => {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
                toast('Content shared successfully');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            toast('Web Share API is not supported in this browser.');
        }
    };

    return <Button onClick={handleShare}>Share</Button>;
};

export default ShareButton;
