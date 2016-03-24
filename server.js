var express = require('express');
var middleware = require('./middleware.js')
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

//route implementation: pass as secound parameter middleware.requireAuthentication
app.get('/About',middleware.requireAuthentication,function(req,res){
    res.send("About Us");
})

//static ponemos el folder or archivo 
//que queremos exponer en pulic
//__dirname nos da la ruta
//si no espacificamos la ruta por defecto toma index.html
app.use(express.static(__dirname + '/public'))

var todos = [{
    id:1,
    description:"Meet mom for lunch",
    completed : false
},{
  id:2,
  description:"Go to market",
  completed:false
},{
    id:3,
    description: "Call Jorge",
    completed:true
}];

app.get('/',function(req,res) {
    res.send('TODO API Root')
});

//GET /todos
app.get('/todos',function(req,res){
    res.json(todos);
})

//GET /todos/:id = /todos/1
app.get('/todos/:id',function(request,response){
    
    var todoId = parseInt(request.params.id);
    var todoEntity;
    todos.forEach(function(todo) {
        if(todo.id === todoId){
            todoEntity = todo
        }
    });
    if(todoEntity){
        console.log(todoEntity);
            response.json(todoEntity);
    }else{
        response.status(404).send()
    }

    //response.send('asking for todo' + request.params.id)
});

//puerto,
app.listen(port,function() {
    console.log("Express server started on port : " + port)
})