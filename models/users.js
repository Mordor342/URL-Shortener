const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    name: {
      type: String,
      required: [true, '']
    },
    email: {
      type: String,
      required: [true, ''],
      unique: true
    },
    password: {
      type: String,
      required: [true, ''],
      minlength: 8
    },
    passwordConfirm: {
      type: String,
      required: [true, ''],
      validate: {
        validator: function(el) {
          return el === this.password
        },
        message: 'Passwords are not same!'
      }
    }})

module.exports = mongoose.model('User', userSchema)