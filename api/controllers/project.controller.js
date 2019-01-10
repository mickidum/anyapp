const { Project } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, project;
    let user = req.user;
    let project_info = req.body;

    [err, project] = await to(Project.create(project_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{project:project.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    let err, projects;
    [err, projects] = await to(Project.find());

    let projects_json = []
    for (let i in projects){
        let project = projects[i];
        projects_json.push(project.toWeb())
    }
    return ReS(res, {projects: projects_json});
}
module.exports.getAll = getAll;

const get = function(req, res){
    console.log(req.params);
    res.setHeader('Content-Type', 'application/json');
    let project = req.project;
    return ReS(res, {project:project.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, project, data;
    project = req.project;
    data = req.body;
    project.set(data);

    [err, project] = await to(project.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {message: `Project: ${project.name} - has been updated`});
}
module.exports.update = update;

const remove = async function(req, res){
    let project, err;
    project = req.project;

    [err, project] = await to(project.remove());
    if(err) return ReE(res, 'error occured trying to delete the project');

    return ReS(res, {message:`Project: ${project.name} - has been deleted`});
}
module.exports.remove = remove;

const addUsersToProject = async function(req, res) {
    let err, project;
    project = req.project;
    project.users = req.body;
    // data = req.body;
    // project.set(data);
    // console.log(project);
    [err, project] = await to(project.save());
    if(err){return ReE(res, err);}
    return ReS(res, {message: `Project: ${project.name} - users have been added`});
}
module.exports.addUsersToProject = addUsersToProject;