const jwt = require('jsonWebtoken');
const User = require('../models/registers');

module.exports.Auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt 
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const userdata =  await User.findOne({_id:verifyToken._id, "tokens.token":token });    
        if(!userdata) { throw new Error('User not found'); }
        req.token = token;
        req.userdata = userdata;
        req.userID = userdata._id;
        next();
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports.loginAuth = (req, res, next) => {
    try {
        const token = req.cookies.jwt 
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        res.redirect('/')
    } catch (error) {
        next();
    }
}