const { mongoose } = require('../db');

// verifying user via email
// verifying user via email
// verifying user via email
let userVerificationScheme = mongoose.Schema ({
    userId: String,   //automatically generated id of our user by mongodb
    uniqueString: String, //A unique string we'll generate for our user who wants to verify his/her account via email(using an npm package called uuid)
    createdAt: Date,           //Time the account was created
    expiry: Date                          // note: we are using the npm package called nodemailer to verify user emails
});

let userVerificationModel = mongoose.model('unvUser', userVerificationScheme);

module.exports = userVerificationModel;

