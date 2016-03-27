var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
   'dialect':'sqlite',
   //'storage':'basic-sqlite-database.sqlite' 
    'storage':__dirname + '/basic-sqlite-database.sqlite' 
});

var TodoTable = sequelize.define('todo',{
    description:{
        type:Sequelize.STRING
    },
    completed:{
        type:Sequelize.BOOLEAN
    }
});

//investigar force : true
//borra todo table y la crea otra vez
sequelize.sync({force:true}).then(function() {
    console.log("Everithing is synced");
    
    //add record to todoTable
    TodoTable.create({
        description:'Call mom',
        completed:false
    }).then(function(todo){
        console.log("finished");
        console.log(todo)
    });
});