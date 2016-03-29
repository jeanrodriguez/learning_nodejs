var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
   'dialect':'sqlite',
   //'storage':'basic-sqlite-database.sqlite' 
    'storage':__dirname + '/basic-sqlite-database.sqlite' 
});

var TodoTable = sequelize.define('todo',{
    //validation property
    description:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            len:[1,250]
        }
    },
    completed:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
});

//investigar force : true
//borra todo table y la crea otra vez
sequelize.sync({force:true}).then(function() {
    console.log("Everithing is synced");
    /*fetching model*/
    // Todo.findById(2).then(function(todo){
    //     if(todo){
    //         console.log(todo);
    //     }else{
    //         console.log('Todo not found.');s
    //     }
    // });
    //add record to todoTable
    TodoTable.create({
        description:'Call mom',
        completed:false
    }).then(function(todo){
        console.log("finished");
        console.log(todo)
    }).catch(function(error){
        console.log(error);
    });
});