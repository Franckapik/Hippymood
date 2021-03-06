//module requiring.

var express = require('express');
var app = express();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

//variables mysql on config.js only for the session creation
var config = require('./config');
var options = {
    host: config.db.host,
    port: 3306,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

//new session.
var sessionStore = new MySQLStore(options);

app.use(session({ //creation of a new session
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
    })
);

app.set('port', process.env.PORT || 8080); //port
app.set('view engine', 'pug'); //template

app.use('/music', express.static('music')); //give acces to the static folders.
app.use('/public', express.static('public'));
app.use('/node_modules/material-design-lite', express.static('node_modules'));

// send app to router
require('./router')(app);

app.listen(app.get('port'), function () {
      console.log('Get it Spicy Dude !' + 'on' + app.get('port') + '!');
});
