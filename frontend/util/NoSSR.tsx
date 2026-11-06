"use client"
import { useEffect, useState, ReactNode } from 'react';

interface NoSSRProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
