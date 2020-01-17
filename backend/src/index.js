const express = require('express');
const moongose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const app = express();

moongose.connect('mongodb+srv://nata:week10@cluster0-wl8is.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors())
app.use(express.json());
app.use(routes);

app.listen(3333);