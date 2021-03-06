const { User } 	    = require('../models');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');
const crypto        = require('crypto');

const getUniqueKeyFromBody = function(body){// this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key = body.unique_key;
    if(typeof unique_key==='undefined'){
        if(typeof body.email != 'undefined'){
            unique_key = body.email
        }else if(typeof body.phone != 'undefined'){
            unique_key = body.phone
        }
        else{
            unique_key = null;
        }
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const checkAdmin = function(body){
    let role;
    role = body.role || 'regular';
    if(role === 'admin') {
        if(body.password) {
            let hashpass = crypto.createHash('md5').update(body.password).digest('hex');
            const adminInit = "c9b70528638f8d3fca6e464f4bad0006";
            if (hashpass !== adminInit) {
                TE('You are not allowed to create an admin account.');
            }
        }
    }
}
module.exports.checkAdmin = checkAdmin;

const createUser = async function(userInfo){
    let unique_key, auth_info, err, name, phone, checkTwoWords;
    phone = userInfo.phone || '';
    name = userInfo.name || '';
    checkTwoWords = name.trim().split(' ');
    auth_info={}
    auth_info.status='create';
    unique_key = getUniqueKeyFromBody(userInfo);
    checkAdmin(userInfo);

    if(!unique_key) TE('An email or phone number was not entered.');

    if(phone && !validator.isMobilePhone(phone)) {
        TE('A phone number is not valid.');
    }

    if(checkTwoWords.length !== 2){
        TE('Full Name must be with two words');
    }

    if(validator.isEmail(unique_key)){
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(User.create(userInfo));
        if(err) {
            // console.log(err)
            // TE(err.message)
            TE('user already exists with that email')
        };

        return user;

    }else if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
        auth_info.method = 'phone';
        userInfo.phone = unique_key;

        [err, user] = await to(User.create(userInfo));
        if(err) TE('user already exists with that phone number');

        return user;
    }else{
        TE('A valid email or phone number was not entered.');
    }
}
module.exports.createUser = createUser;

const authUser = async function(userInfo){//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if(!unique_key) TE('Please enter an email or phone number to login');


    if(!userInfo.password) TE('Please enter a password to login');

    let user;
    if(validator.isEmail(unique_key)){
        auth_info.method='email';

        [err, user] = await to(User.findOne({email:unique_key }));
        if(err) TE(err.message);

    }else if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
        auth_info.method='phone';

        [err, user] = await to(User.findOne({phone:unique_key }));
        if(err) TE(err.message);

    }else{
        TE('A valid email or phone number was not entered');
    }

    if(!user) TE('Not registered');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if(err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;
