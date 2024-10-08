import io from 'socket.io-client';

const userId = sessionStorage.getItem('userId')
const socket = io('http://localhost:3000', {
    query: { userId }, // העברת userId ב-query params
});

export default socket