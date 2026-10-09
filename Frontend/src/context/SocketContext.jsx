import { createContext, useEffect } from 'react';
import {io} from 'socket.io-client';

export const socketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const socketProvider = ({ children }) => {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server with socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }, []);

    const sendMessage = (eventName, message) => {
        socket.emit(eventName, message);
    };

    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);
    };

    return (
        <socketContext.Provider value={{ sendMessage, receiveMessage }}>
            {children}
        </socketContext.Provider>
    );
}

export default socketProvider;