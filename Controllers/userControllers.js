const User = require('../Models/userModel');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = require('express')()




const loginUser = async (req, res) => {
    
    res.json({mssg: "haha you login"})

}

const signupUser = async (req, res) => {
    const { email, password } = req.body

    let emptyFields = [];

    if (!email) {emptyFields.push("email")};
    if (!password) {emptyFields.push("password")};

    try {
        const user = await User.create({ email, password});
        res.status(200).json(user);
    }  catch (error) {
        res.status(400).json({error: error.message});
    }

    /* let newUser = new NUser({
            email: req.body.emailSignup,
            password: req.body.passwordSignup
        })
        newUser.save();
        res.redirect('/');*/
}

module.exports = { signupUser, loginUser }