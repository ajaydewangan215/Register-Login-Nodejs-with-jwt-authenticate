require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const db = require('./db/conn');
const Register = require('./models/registers');
const middleware = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000;

// use static page
app.use(express.static(path.join(__dirname,'../public')));

// use template engine default
app.set('view engine', 'hbs');

// change views engine directory
app.set('views', path.join(__dirname, '../templates/views'))

// use hbs partial file
hbs.registerPartials(path.join(__dirname, '../templates/partial'))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', middleware.Auth, (req, res) => {
    res.render('index', {userdata:req.userdata})
});

app.get('/register', middleware.loginAuth, (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
    try {
        if(req.body.password === req.body.confirm_password){
            const user = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirm_password
            })
            const token = await user.generateAuthToken()
            const responce = await user.save()
            res.status(201).send(responce)
        } else {
            res.send('Password Does Not Match')
        }            
    } catch (error) {
        res.status(400).send(error);
    } 
});

app.get('/login', middleware.loginAuth, (req, res) => {
    res.render('login')
});

app.post('/login', async (req, res) => {
    try {
        const response = await Register.findOne({email:req.body.email});
        if(bcrypt.compare(req.body.password, response.password)){
            const token = await response.generateAuthToken()
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly:true,
                // secure:true
            })
            // res.status(201).render('index')
            res.redirect('/')
        } else {
            res.send('invalid Login Details');
        }
    } catch (error) {
        res.status(400).send('invalid Login Details');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});