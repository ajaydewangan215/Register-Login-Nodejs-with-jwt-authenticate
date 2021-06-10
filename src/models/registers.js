const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonWebtoken');

// structure of mongoose.Schema
const userSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        minlength:3, 
        required:true 
    },
    lastname: { 
        type: String,         
        required:true 
    },
    email: 
    { 
        type: String, 
        required:true, 
        unique:[true, "Email is already present"],
        validator(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    gender: { 
        type: String,         
        required:true 
    },
    phone: { 
        type: Number, 
        min: 10,
        required:true,
        unique:true 
    },
    age: { 
        type: Number, 
        required:true
    },
    password: { 
        type: String, 
        required:true
    },
    confirmpassword: { 
        type: String, 
        required:true
    },
    tokens:[{
        token: { 
            type: String, 
            required:true
        },
    }]
});


// middleware create token
userSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY, {
            expiresIn: "10 minutes"
        });
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
        // console.log(token);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

// middleware hashing password
userSchema.pre("save", async function(next) {
    if(this.isModified("password")){       
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10); //not need
    }
    next();
});

//   Collection creation
const Register = mongoose.model('users', userSchema);
module.exports = Register;
