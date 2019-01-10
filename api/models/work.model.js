const mongoose = require('mongoose');
const {TE, to} = require('../services/util.service');
const validate = require('mongoose-validator');

let UserSchema = mongoose.Schema({
	name: {type: String, reqiured: true},
	id: {type: mongoose.Schema.Types.ObjectId, reqiured: true}
},{_id: false});

let ProjectSchema = mongoose.Schema({
	name: {type: String, reqiured: true},
	id: {type: mongoose.Schema.Types.ObjectId, reqiured: true}
},{_id: false});

let WorkSchema = mongoose.Schema({
 	user: UserSchema,
 	project: ProjectSchema,
  hours: {type: Number, required: true},
  date: {type: String, required: true},
});

WorkSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};

UserSchema.pre('save', function(next){
	if (!this.name || !this.id) {
    TE('User name and User id are required fields');
  }
});

ProjectSchema.pre('save', function(next){
	if (!this.name || !this.id) {
    TE('Project name and Project id are required fields');
  }
})

let work = module.exports = mongoose.model('Work', WorkSchema);

