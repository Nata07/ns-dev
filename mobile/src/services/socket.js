import socketio from 'socket.io-client'

const socket = socketio('url conection', {
  autoConnect: false,
});