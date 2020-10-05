const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    dob: String,
    status: Number,
    email: String,
    password : String
})

module.exports= mongoose.model('user', userSchema, 'users')