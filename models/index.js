var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , restful   = require('sequelize-restful-extended')
  , lodash    = require('lodash')
  , db        = {};

require('sequelize-hierarchy')(Sequelize);

if (process.env.NODE_ENV == 'production'){
  console.log('Production');
  sequelize = new Sequelize('base_de_datos', 'usuario', 'password', {
    host: 'AquiSuServidor.rds.amazonaws.com', 
    dialect:  'mysql',
    logging: false,
    protocol: 'mysql',
    port:    3306 // or 5432 (for postgres),
  });
} else {
  console.log('Development');
  sequelize = new Sequelize('kbufojdb_eme', 'kbufojdb_emdbusr', 'Vpyn8imcB&p@', {
    host: '187.144.141.93:3306',
    dialect:  'mysql',
    protocol: 'mysql',
    logging: false,
    port:    3306 // or 5432 (for postgres),
  });
}
 
// Cargar todos los modelos
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
 
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
