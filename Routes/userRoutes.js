const express = require("express");

// models
const { signupUser, loginUser } = require('../Controllers/userControllers')

const router = express.Router()

// URLs for postman, its like CRUD .get .post .delete .patch
router.post('/', loginUser)

router.post('/', signupUser)

// this goes to dbconnection.js
module.exports = router;
