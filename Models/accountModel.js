const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['student', 'teacher', 'administrator'], default: 'student'
    }
})

module.exports = mongoose.model('account', accountSchema)