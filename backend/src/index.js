const express = require('express');
const moongose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const {setupWebSocket} = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebSocket(server);

moongose.connect('mongodb+srv://nata:week10@cluster0-wl8is.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors())
app.use(express.json());
app.use(routes);

server.listen(3333);