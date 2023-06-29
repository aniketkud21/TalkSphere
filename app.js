const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

const User = require("./models/user")

// Port no
require('dotenv').config()
const port = process.env.PORT || 5000

// Database and Passport configuration
require("./config/database")
require("./config/passport")(passport)
require("./config/socket")(io)

app.use(passport.initialize())

app.set('view-engine', 'ejs')

const path = require('path')
app.use(express.static(path.join(__dirname, 'static')))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: process.env.PRIV_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:6000000 }
}))
app.use(flash())

app.use(require('./routes'))
console.log("Passport configured");

// Socket ----------------------------

module.exports = server.listen(port, ()=>{
    console.log("Server started");
})
