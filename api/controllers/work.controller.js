const { Work } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, work, project;
    let user = req.user;

    // console.log(user);

    let work_info = req.body;

    // work_info.user = {
    //     user_id: user._id,
    //     name: user.name
    // };
    // work_info.project = {
    //     id: 'dfdfdfd',
    //     name: 'ffffff'
    // };
    console.log('work_info: ', work_info);
    // process.exit();
    [err, work] = await to(Work.create(work_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{work:work.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    let err, works;
    [err, works] = await to(user.Works());

    let works_json = []
    for (let i in works){
        let work = works[i];
        works_json.push(work.toWeb())
    }
    return ReS(res, {works: works_json});
}
module.exports.getAll = getAll;

const get = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let work = req.work;
    return ReS(res, {work:work.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, work, data;
    work = req.work;
    data = req.body;
    work.set(data);

    [err, work] = await to(work.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {message: `Work: ${work.name} - has been updated`});
}
module.exports.update = update;

const remove = async function(req, res){
    let work, err;
    work = req.work;

    [err, work] = await to(work.remove());
    if(err) return ReE(res, 'error occured trying to delete the work');

    return ReS(res, {message:`Work: ${work.name} - has been deleted`});
}
module.exports.remove = remove;