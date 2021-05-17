const mongoose = require('mongoose');

const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'please enter a email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Enter a valid email']

    },
    password:{
        type:String,
        required: [true, 'please enter the password'],
        minlength: [6,'minimum length should be 6']

    }
})

// fire a function before saving the data
userschema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    
    next();
});

// fire a function after creating a user
userschema.post('save',function(doc,next){
    console.log('user is successfully created',doc);
    next();
});

// static method to login user
userschema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect Password');
    }
    throw Error('invalid Email address');
}

const User = mongoose.model('user', userschema);

module.exports = User;