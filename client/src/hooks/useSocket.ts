import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Reviewer } from '../types';

const SOCKET_URL = 'http://localhost:3000';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to dashboard server');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from dashboard server');
        });

        newSocket.on('reviewers_update', (data: Reviewer[]) => {
            setReviewers(data);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return { socket, reviewers, isConnected };
}
