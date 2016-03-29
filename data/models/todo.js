module.exports = function(sequelizeIntanse,DataTypes) {
  return sequelizeIntanse.define('Todo',{
       //campos de la tabla Todo
     description:{ 
         type:DataTypes.STRING,
     allowNull : false,
     validate:{
         len:[1,250]
     }     
   },
   completed:{
       type:DataTypes.BOOLEAN,
       allowNull:false,
       defaultValue:false
   }
});
};