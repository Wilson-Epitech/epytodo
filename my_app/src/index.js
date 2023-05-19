const express = require("express");
const db = require('./config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./front-end'));
app.use('/', require('./routes/auth/auth.js'));
app.use('/', require('./routes/user/user.js'));
app.use('/', require('./routes/todos/todos.js'));
app.use('/', require('./middleware/error.js'));

app.listen(port, () =>
{
  console.log(`listening at http :// localhost : ${port}`);
});
