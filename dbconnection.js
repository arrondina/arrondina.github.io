const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

const userRoutes = require('./Routes/userRoutes');

const uri = "mongodb+srv://lrjsales:5CC3pLqE80E3JZWq@cluster0.ackb3.mongodb.net/BVDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri);

const userSchema = {
    email: String,
    password: String
}

const User = require('./Models/userModel')

const websitePath = path.join(__dirname, '/public')

console.log(websitePath);

app.use(express.static(websitePath));

//app.use('/signup', userRoutes)

app.post("/signup",function(req, res) {
    let newUser = new User({
        email: req.body.emailSignup,
        password: req.body.passwordSignup
    })

    // conditions
    console.log(req.body.emailSignup)

    newUser.save();
    res.redirect('/');
})

app.post('/login', function(req, res){

    const findUser = new User({
        email: req.body.emailLogin,
        password: req.body.passwordLogin
    })

    //const {id} = req.params

    const userL = User.findOne({email: toString(req.body.emailLogin)}, 'password');

    //console.log(userL)
    
    console.log(userL)

    if(!userL) {
        return res.status(400).json({error:"No such User"});
    }
    //res.status(200).json(userL);
    //res.status(200).json(userL);

});


app.listen(5000, function() {
    console.log("server is running on 5000")
})