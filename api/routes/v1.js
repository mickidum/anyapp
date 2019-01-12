const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');
const ProjectController = require('../controllers/project.controller');
const HomeController 	= require('../controllers/home.controller');
const WorkController 	= require('../controllers/work.controller');

const custom 	        = require('./../middleware/custom');

const passport      	= require('passport');
const path              = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

// ADMIN ACTIONS
router.get(     '/usersall',           passport.authenticate('jwt', {session:false}),custom.checkIfAdmin, UserController.getAll);        // R
router.post(    '/usersall/newuser',   passport.authenticate('jwt', {session:false}),custom.checkIfAdmin, UserController.create);        // R
router.get(     '/usersall/:user_id',  passport.authenticate('jwt', {session:false}),custom.checkIfAdmin, custom.currentUser, UserController.getSingleUser);        // R
router.put(     '/usersall/:user_id',  passport.authenticate('jwt', {session:false}),custom.checkIfAdmin, custom.currentUser, UserController.updateUser);     // D
router.delete(  '/usersall/:user_id',  passport.authenticate('jwt', {session:false}),custom.checkIfAdmin, custom.currentUser, UserController.removeUser);     // D


// USER ACTIONS
router.post(    '/users',           UserController.create);                                                    // C
router.get(     '/users',           passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.put(     '/users',           passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',           passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.post(    '/users/login',     UserController.login);

router.post(    '/projects',             passport.authenticate('jwt', {session:false}), custom.checkIfAdmin, ProjectController.create);                  // C
router.post(    '/projects/add_users/:project_id', passport.authenticate('jwt', {session:false}), custom.checkIfAdmin, custom.project, custom.addUsersArray, ProjectController.addUsersToProject);                  // C
router.get(     '/projects',             passport.authenticate('jwt', {session:false}), custom.checkIfAdmin, ProjectController.getAll);                  // R

router.get(     '/projects/:project_id', passport.authenticate('jwt', {session:false}), custom.checkIfAdmin, custom.project, ProjectController.get);     // R
router.put(     '/projects/:project_id', passport.authenticate('jwt', {session:false}), custom.checkIfAdmin, custom.project, ProjectController.update);  // U
router.delete(  '/projects/:project_id', passport.authenticate('jwt', {session:false}), custom.checkIfAdmin, custom.project, ProjectController.remove);  // D

router.post(    '/works',             passport.authenticate('jwt', {session:false}), WorkController.create);                  // C
router.get(     '/works',             passport.authenticate('jwt', {session:false}), WorkController.getAll);  

router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)

module.exports = router;
