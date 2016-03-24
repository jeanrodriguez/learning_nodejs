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

//puerto,
app.listen(port,function() {
    console.log("Express server started on port : " + port)
})
