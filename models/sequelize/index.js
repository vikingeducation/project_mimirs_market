var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var config    = require('../../config/sequelize.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  if (env === 'test') config.logging = false;
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.Product = require('./product')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);

// Relations
db.Product.belongsTo(db.Category, { as: 'category', foreignKey: 'categoryId' });
db.Category.hasMany(db.Product, { as: 'products', foreignKey: 'categoryId' });

module.exports = db;
