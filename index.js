// Focus: https://jobs.smartrecruiters.com/ni/Shopify/1529b84e-da5f-49d4-b408-09f0050732be-backend-developer-intern-remote-summer-2021
// https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit
import dotenv from 'dotenv';
import express from 'express';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import session from 'express-session';
import fileUpload from 'express-fileupload';

import general from './controller/general.js';
import photoController from './controller/photo.js';
import userController from './controller/user.js';
import transactionController from './controller/transaction.js';
import tagController from './controller/tag.js';

dotenv.config({path: './config/keys.env'});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    moneyFixed: function(options) {
      return parseFloat(options.fn(this)).toFixed(2);
    },
  },
}));

app.use(fileUpload());

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next)=>{
  res.locals.user = req.session.user;
  res.locals.cart = req.session.cart;
  next();
});

app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT;

/**
 * Shortcut to open browser when running locally
 * */
function onHttpStart() {
  console.log(`Express http server listening on : ${HTTP_PORT}`);
  if (HTTP_PORT == 8085) {
    console.log('click here to open browser: http://localhost:8085');
  }
}

app.use('/', general);
app.use('/', photoController);
app.use('/', userController);
app.use('/', transactionController);
app.use('/', tagController);

app.use(express.static('resources'));

app.use((req, res) => {
  if (res.status(404)) {
    res.render('general/error');
  }
});

app.listen(HTTP_PORT, onHttpStart);
