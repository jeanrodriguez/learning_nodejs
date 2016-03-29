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

// var todos = [];
// var nextTodoId = 1;

app.get('/',function(req,res) {
    res.send('TODO API Root')
});

//GET /todos
//GET /todos/?completed=true
app.get('/todos',function(req,res){
    var queryParams = req.query;
    var where={};
    
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        where.completed = true
    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false' ){
        where.completed = false;
    }
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
        where.description = {
            $like : '%' + queryParams.q + '%'
        };
    }
    db.todo.findAll(where).then(function(todos){
        console.log(todos);
        res.json(todos);
    },function(error){
        res.status(500).send();
    });
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
    //elimina el record
    db.todo.destroy({
        where:{
            id: todoId
        }
    }).then(function(rowDeleteCount){
        if(rowDeleteCount === 0){
           response.status(404).send({
               "error": "No todo found with id"
           });
        }
        else{
            //status 204 todo paso bien, no mandamos nada
            response.status(204).send();
        }
    },function(error){
        response.status(500).send(error)
    });  
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

