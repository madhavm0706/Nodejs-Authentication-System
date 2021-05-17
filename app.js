const express = require('express');
const mongoose = require('mongoose');
const {requireAuth, checkuser} = require('./Middleware/AuthMiddleware');

const authroutes = require('./router/auth');

const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    app.listen(3000);
    console.log('connected to mongoose')
  })
  .catch((err) => console.log(err));

// routes
app.get('*',checkuser);
app.get('/', (req, res) => res.render('home'));
app.get('/protected-page',requireAuth, (req, res) => res.render('protect'));

// cookies
app.get('/set-cookies',(req,res)=>{
  // res.setHeader('set-Cookie','newUser=true');

  res.cookie('newUser', false);
  res.cookie('isworker',true,{httpOnly:true,maxAge: 1000*60*60*24})
  res.send('you got the cookies');
});

app.get('/read-cookies',(req,res)=>{

  const cookie = req.cookies;
  console.log(cookie);

  res.json(cookie);

})

app.use(authroutes);