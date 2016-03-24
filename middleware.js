var middleware ={
    requireAuthentication: function (req,res,next) {
        console.log('private route hit!');
        //le decimos que siga adelante con el request
        next()
    },
    logger:function (req,res,next) {
        console.log('Request: '+req.method + ' ' + req.originalUrl);
        //le decimos que siga adelante con el request
        next();
    }
}

module.exports = middleware;