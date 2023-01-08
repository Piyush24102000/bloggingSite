let mongoose = require("mongoose")
var emailVal = require("email-validator");
var passVal = require('password-validator');
var schema = new passVal();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces() 
    .has().symbols(1)                          // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const isValidString = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value === String && value.trim().length == 0) return false;
    return true
}

const isValidEmail = function (value) {
    let validEmail = emailVal.validate(value)
    return validEmail
}

const isValidPassword = function (value) {
    let validPassword = schema.validate(value)
    return validPassword
}

const isIdValid = function (value) {
    return mongoose.Types.ObjectId.isValid(value)
}

module.exports = { isValidString, isValidEmail, isValidPassword, isIdValid }