var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileRouter = require('./routes/file');

var app = express();

var cors = require('cors')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express); //引用ejs引擎
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, './../dist')));

//  跨域
app.use(cors());

app.use('/', indexRouter);
app.use('/ioc/userDB', usersRouter);
app.use('/ioc/fileControl', fileRouter);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  // res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("X-Powered-By",' 3.2.1');
  res.header('Content-Type', 'application/json;charset=UTF-8-Type');
  res.header('Access-Control-Allow-Credentials','true');
  if (req.method == 'OPTIONS') {
    res.send(200); /*让options请求快速返回*/
  } else {
    next();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
