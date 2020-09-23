if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//required models
const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
//using passport
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
//making array instead of a server
const users = []

//app.use
app.set('view-engine', 'ejs')
app.use('/static', express.static('style'));
app.use('/static', express.static('routes'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.get('/', (req, res) => {
    res.render('profile.ejs')
})

//get pages
app.get('/home-page', checkAuthenticated, (req, res) => {
    res.render('home-page.ejs', { name: req.user.name })
})

app.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile.ejs')
})
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.get("/calculator", (req,res) =>{
    res.render('calculator.ejs')
});
app.get("/snake-game", (req,res) =>{
    res.render('snake-game.ejs')
});

//login register and logout methods
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home-page',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})


//authenticate func
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/register')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home-page')
    }
    next()
}
//port
app.listen(3001)