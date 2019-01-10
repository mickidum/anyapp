const { Intent, User, Project } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

let intent = async function (req, res, next) {
    let intent_id, err, intent;
    intent_id = req.params.intent_id;

    [err, intent] = await to(Intent.findOne({_id:intent_id}));
    if(err) return ReE(res,"err finding intent");

    if(!intent) return ReE(res, "Intent not found with id: "+intent_id);
    let user, users_array;
    user = req.user;
    users_array = intent.users.map(obj=>String(obj.user));
    // console.log('users_array: ', intent.users);

    if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+app_id);

    req.intent = intent;

    // console.log('Intent: ', intent);
    next();
}
module.exports.intent = intent;

let project = async function (req, res, next) {
    let project_id, err, project;
    project_id = req.params.project_id;

    [err, project] = await to(Project.findOne({_id:project_id}));
    if(err) return ReE(res,"err finding project");

    if(!project) return ReE(res, "Project not found with id: "+project_id);
    // let user, users_array;
    // user = req.user;
    // users_array = project.users.map(obj=>String(obj.user));

    // if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+user_id);

    req.project = project;

    next();
}
module.exports.project = project;

let currentUser = async function (req, res, next) {
    let user_id, err, getCurrentUser;
    user_id = req.params.user_id;
    // console.log(req.params);

    [err, getCurrentUser] = await to(User.findOne({_id:user_id}));
    if(err) return ReE(res,"err finding user");

    if(!getCurrentUser) return ReE(res, "User not found with id: "+intent_id);
    
    req.currentUser = getCurrentUser;

    next();
}
module.exports.currentUser = currentUser;

let checkIfAdmin = async function (req, res, next) {
    let user_role = req.user.role || 'regular';
    
    if (user_role === 'admin') {
        next();
    } else {
        ReE(res, "User does not have permission to access");
    }
}
module.exports.checkIfAdmin = checkIfAdmin;

let checkUsersExist = async function(req, res, next) {    
    let users;
    users = req.body;
    if (Array.isArray(users) && users.length > 0) {
        req.project.users = users; 
    // console.log(req.project)
    } else {
        return ReE(res, "Wrong format of data inserted! error")
    }
    
    next();
}
module.exports.checkUsersExist = checkUsersExist;
