var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
    'dialect':'sqlite',
    'storage':__dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

//load squelize model from other file
db.todo = sequelize.import(__dirname +'/data/models/todo.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize

module.exports = db;