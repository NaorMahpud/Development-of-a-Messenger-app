import { io } from 'socket.io-client';

let socket;
const userId = sessionStorage.getItem('userId')
if (userId) {
    socket = io('http://localhost:3000', {
        query: { userId }, // העברת userId ב-query params
    });
}

export default socket