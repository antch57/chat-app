const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname,'../public');

app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    console.log('New websocket connection.');

    socket.emit('message', generateMessage('Welcome!'));

    socket.broadcast.emit('message', generateMessage('A new user has joined!'));

    socket.on('message', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback("You can't use profanity bitch");
        };

        io.emit('message', generateMessage(message));
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage( 'User has left.'));
    });

    socket.on('sendLocation', (coordinates, callback) => {
        const location = `https://google.com/maps?q=${coordinates.lat},${coordinates.long}`
        io.emit('locationMessage', location);
        callback('Location Shared!');
    });
});

server.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});