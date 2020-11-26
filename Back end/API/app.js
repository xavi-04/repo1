var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var protectedRouter = require('./routes/protected');
var AuthRouter = require('./routes/autorizar');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('open', () => {
    debug('se ha conectado')
});
db.on('error', () => {
    console.log('error al conectar a la base de datos')
    process.exit(1);
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var debug = require('debug')('proyecto-final-backend:app');

app.use('/', indexRouter);
app.use(AuthRouter);
app.use('/users', usersRouter);
app.use('/protected',protectedRouter);

module.exports = app;
