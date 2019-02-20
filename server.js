var path = require('path');
var async = require('async');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var fs = require('fs');
var helmet = require('helmet');
var rfs = require('rotating-file-stream');
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', process.env.PORT || 5001);



//log writer
var logDirectory = path.join(__dirname, 'log');
var date = new Date();
var filenam = 'log' + date.toLocaleDateString() + '.log';
var logformat =  '"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "status": ":status"';
//morgan.format('logFormat', '"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"');
//app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', { stream: accessLogStream }));

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
console.log(filenam);
var accessLogStream = rfs(filenam, { interval: '1d', path: logDirectory });
//app.use(morgan(logformat, { stream: accessLogStream }));
// setup the logger
//app.use(morgan('combined', { stream: accessLogStream }));


// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))
morgan.format('logFormat', logformat);
// log all requests to access.log
app.use(morgan('common', {
  stream: accessLogStream
}))

// Should be placed before express.static
app.use(compress({
  filter: function (req, res) {
    return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));
console.log(process.env.NODE_ENV,app.get('env'));
// Force HTTPS on Heroku
if (app.get('env') === 'production') {
    console.log("server in dev");
  app.use(function (req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() :
      res.redirect('https://' + req.hostname + req.url);
  });
}

 app.use(express.static(path.join(__dirname, '/dist')));
 require('./server/routes')(app);
 app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist/index.html'));
 });

  // app.use(express.static("."));
  // require('./server/routes')(app);
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'index.html'));
  // });


/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), app.get('host'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

//https://blogs.msdn.microsoft.com/premier_developer/2018/03/01/angular-how-to-editable-config-files/