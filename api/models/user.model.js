const mongoose 			= require('mongoose');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const { Project, Work, Intent }  = require('../models');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');


let UserSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true
    },
    avatar: {
        type:String
    },
    phone: {
        type:String, 
        lowercase:true, 
        trim: true, 
        index: true, 
        unique: true, 
        sparse: true,//sparse is because now we have two possible unique keys that are optional
        validate:[validate({
            validator: 'isNumeric',
            arguments: [7, 20],
            message: 'Not a valid phone number.',
        })]
    },
    email: {
        type:String, 
        lowercase:true, 
        trim: true, 
        index: true, 
        unique: true, 
        sparse: true,
        validate:[validate({
            validator: 'isEmail',
            message: 'Not a valid email.yo',
        }),]
    },
    role: {
        type: String, 
        default: 'regular', 
        lowercase:true, 
        trim: true, 
        enum: [
            'regular',
            'admin'
        ]
    },
    password:   {
        type: String,
        trim: true,
        required: true,
        minlength: 6
    },
    projects: [{ type: mongoose.Schema.ObjectId, ref: 'Project' }]
    
}, {timestamps: true});

UserSchema.virtual('intents', {
    ref: 'Intent',
    localField: '_id',
    foreignField: 'users.user',
    justOne: false,
});

UserSchema.pre('save', async function(next){

    if(this.isModified('password') || this.isNew){

        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10));
        if(err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(this.password, salt));
        if(err) TE(err.message, true);

        this.password = hash;

    } else{
        return next();
    }
})


UserSchema.methods.comparePassword = async function(pw){
    let err, pass;
    if(!this.password) TE('password not set');

    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if(err) TE(err);

    if(!pass) TE('invalid password');

    return this;
}

UserSchema.methods.Projects = async function(){
    let err, projects;
    [err, projects] = await to(Project.find({'users.user':this._id}));
    if(err) TE('err getting projects');
    return projects;
}

UserSchema.methods.Works = async function(){
    let err, works;
    [err, intents] = await to(Work.find({'users.user':this._id}));
    if(err) TE('err getting intents');
    return works;
}

UserSchema.virtual('full_name').set(function (name) {
    var split = name.split(' ');
    this.first = split[0];
    this.last = split[1];
});

UserSchema.virtual('full_name').get(function () { //now you can treat as if this was a property instead of a function
    if(!this.first) return null;
    if(!this.last) return this.first;

    return this.first + ' ' + this.last;
});

UserSchema.methods.getJWT = function(){
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return jwt.sign({user_id:this._id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
};

UserSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};

let User = module.exports = mongoose.model('User', UserSchema);


