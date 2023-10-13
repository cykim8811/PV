
const express = require('express');
const ws = require('ws');

const app = express();
app.use(express.static('public'));

app.use('/templates', express.static('templates'));

app.listen(7001);


const wss = new ws.Server({port: 7002});

// const root = new CodeVizCounter(engine);


wss.on('connection', (ws) => {
    // Synchonize root with client
    ws.on('message', (message) => {
        // Handle events from client
        // Broadcast variable changes to client
        // Variable change watching is done on the client side
    });
});
