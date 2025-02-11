const User = require('../Models/userModel');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = require('express')()




const loginUser = async (req, res) => {
    
    

}

const signupUser = async (req, res) => {
    const { email, password , name } = req.body

    let emptyFields = [];

    if (!email) {emptyFields.push("email")};
    if (!password) {emptyFields.push("password")};
    if (!name) {emptyFields.push("name")}

    try {
        const user = await User.create({ email, password, name});
        res.status(200).json(user);
    }  catch (error) {
        res.status(400).json({error: error.message});
    }


}

module.exports = { signupUser, loginUser }