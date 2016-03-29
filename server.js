// code from chapter 8

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var middleware = require('./middleware.js')
var db = require('./db.js')

var app = express();
var port = process.env.PORT || 3000;

//application middleware: se aplica middleware para toda la application
//route middleware: se aplica middleware solo para una ruta especifica

//http get: like actionResunt return View()
//ruta por defecto
// app.get('/',function(req,res){
//     res.send('Hello Express')
// });

//global implementation
//app.use(middleware.requireAuthentication)
app.use(middleware.logger);
app.use(bodyParser.json());

//route implementation: pass as secound parameter middleware.requireAuthentication
app.get('/About',middleware.requireAuthentication,function(req,res){
    res.send("About Us");
})

//static ponemos el folder or archivo 
//que queremos exponer en pulic
//__dirname nos da la ruta
//si no espacificamos la ruta por defecto toma index.html
app.use(express.static(__dirname + '/public'))

var todos = [];
var nextTodoId = 1;

app.get('/',function(req,res) {
    res.send('TODO API Root')
});

//GET /todos
//GET /todos/?completed=true
app.get('/todos',function(req,res){
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty('completed')&&queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos,{completed:true});
    }else if(queryParams.hasOwnProperty('completed')&& queryParams.completed === 'false'){
        filteredTodos = _.where(filteredTodos,{completed : false});
    }
    
    //if has property && completed ==='true'
    //filteredTodos = _.where(filteredTodos,?)
    //else if has prop && completed if 'false'
    
    if( queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
        filteredTodos = _.filter(filteredTodos,function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1
            //return todo.description.toLowerCase() === todo.description.toLowerCase();
        });
    }
    
    res.json(filteredTodos);
});

//GET /todos/:id = /todos/1
app.get('/todos/:id',function(request,response){
    
    var todoId = parseInt(request.params.id);
    var matchedTodo;
    db.todo.findById(todoId).then(function(todo) {
        if(todo){
            matchedTodo = todo;
            response.json(matchedTodo.toJSON());
        }else{
            response.status(404).send();
        }
    },function(error){
        response.status(500).send(error);
    });
});

//POST /todos
app.post('/todos',function(request,response){
    //get body form page,request.
    var body = _.pick(request.body,'description','completed') ;
    
    //parametro en then()
    //1ero : success. 2do : error    
    db.todo.create(body).then(function(todo){
        response.json(todo.toJSON());
    },function(error){
        response.status(400).json(error);
    });
});

//DELETE /todos/:idToDelete
app.delete('/todos/:idToDelete',function(request,response) {
    var todoId = parseInt(request.params.idToDelete,10);
    //use without
    var matchedTodo = _.findWhere(todos,{id:todoId});
    
    if(!matchedTodo){
        response.status(404).json({"error": "no todo found with that id"});
    }
    else{
         todos = _.without(todos,matchedTodo); 
         response.json(matchedTodo); 
    }    
});

//PUT /todos/:id
app.put('/todos/:id',function(request,response) {
    var todoId = parseInt(request.params.id,10);
    var matchedRecord = _.findWhere(todos,{id:todoId});       
    
    if(!matchedRecord){
        response.status(404).send();
    }
    var body = _.pick(request.body,'description','completed') ;
    var validAtribute = {};
    validAtribute.completed = body.completed;
    validAtribute.description = body.description;
    
    _.extend(matchedRecord,validAtribute);
    response.json(matchedRecord);
});

db.sequelize.sync().then(function() {
      //puerto,
    //iniciar servidor
    app.listen(port,function() {
        console.log("Express server started on port : " + port);
    });
});

