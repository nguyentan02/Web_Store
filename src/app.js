const path = require('path');
const express = require('express');
var morgan = require('morgan');
const app = express();
const cors = require('cors')
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const multer = require('multer');
const upload = multer();


// Use multer middleware to handle form data
app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const methodOverride = require('method-override')


app.use(methodOverride('_method'))
app.use(session({
    secret: 'jwttoken',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static('uploads'));
app.use(cookieParser())
app.use(cors())

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,

        }
    })
)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use('/api/v1', require('./routes/index.router'))

module.exports = app;