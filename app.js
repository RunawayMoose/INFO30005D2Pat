const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")

//routes directions
const auth = require('./routes/auth');
const patient = require('./routes/patient')

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json()) 
app.use(express.urlencoded({ extended: false })) 

const db= "mongodb+srv://RunawayMoose:Victor0143@cluster0.mll15.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

var hbs = exphbs.create({ defaultLayout: 'main', extname: '.hbs' });
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); 

app.use('/auth', auth); //interact with auth
app.use('/patient', patient)

app.get('/', (req, res) => {  // /only means index page, direct straight to the login page
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

