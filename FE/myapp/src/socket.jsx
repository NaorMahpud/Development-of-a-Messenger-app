import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
    query: { userId: sessionStorage.getItem('userId') }, // העברת userId ב-query params
});

export default socket