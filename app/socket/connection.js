const { Server } = require('socket.io');

let socketIo = null;
const socketConnection = (httpServer) => {
  socketIo = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
    transports: ['websocket'],
  });

  return socketIo;
};

const getIO = () => {
  if (!socketIo) {
    throw new Error('Socket Io is not Connected !!!');
  }

  return socketIo;
};

module.exports = {
  socketConnection,
  getIO,
};
