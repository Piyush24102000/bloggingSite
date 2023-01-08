const express = require('express')
const mongoose = require('mongoose')
const app = express()
const route = require('./routes/route')
mongoose.set('strictQuery', true)

app.use(express.json())
app.use('/', route)

mongoose.connect('mongodb+srv://piyushtale:piyushrajutale@cluster0.t7w7ipr.mongodb.net/BloggingSite')
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error))

app.listen(3000, function () {
    console.log("Server connected to Port 3000")
})

