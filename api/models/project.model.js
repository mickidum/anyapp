const mongoose = require('mongoose');
const {TE, to} = require('../services/util.service');

let UserSchema = mongoose.Schema({
	name: {type: String, required: true, unique: true},
	id: {type: mongoose.Schema.Types.ObjectId, unique: true}
},{_id: false});

let ProjectSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    hours: {type: Number, required: true},
    done: {type: Boolean, default: false},
    image: {type: String, trim: true},
    users:  [ UserSchema ],
}, {timestamps: true});

ProjectSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};

let project = module.exports = mongoose.model('Project', ProjectSchema);

