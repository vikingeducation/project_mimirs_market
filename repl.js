const repl = require('repl').start({});
const models = require('./models/sequelize');

// Make the `models` object
// a global variable in the
// REPL
repl.context.models = models;

// Make each model a global
// object in the REPL
Object.keys(models).forEach(modelName => {
  repl.context[modelName] = models[modelName];
});

// Provide a convenience function `lg`
// to pass to `then()` and `catch()`
// to output less verbose values for
// sequelize model query results
repl.context.lg = data => {
  if (Array.isArray(data)) {
    if (data.length && data[0].dataValues) {
      data = data.map(item => item.dataValues);
    }
  } else {
    if (data.dataValues) {
      data = data.dataValues;
    }
  }
  console.log(data);
};

// var mongoose = require('mongoose');
// var repl = require('repl').start({});
// var models = {
//   mongoose: require('./models/mongoose'),
//   sequelize: require('./models/sequelize')
// };
// var helpers = require('./helpers');
//
// require('./mongo')().then(() => {
//   repl.context.models = models;
//   repl.context.helpers = helpers;
//
//   // ----------------------------------------
//   // Helpers
//   // ----------------------------------------
//   Object.keys(helpers).forEach(key => {
//     repl.context[key] = helpers[key];
//   });
//
//   // ----------------------------------------
//   // Mongoose
//   // ----------------------------------------
//   Object.keys(models.mongoose).forEach(modelName => {
//     repl.context[modelName] = mongoose.model(modelName);
//   });
//
//   // ----------------------------------------
//   // Sequelize
//   // ----------------------------------------
//   Object.keys(models.sequelize).forEach(modelName => {
//     repl.context[modelName] = models.sequelize[modelName];
//   });
//
//   // ----------------------------------------
//   // Logging
//   // ----------------------------------------
//   repl.context.lg = data => {
//     if (Array.isArray(data)) {
//       if (data.length && data[0].dataValues) {
//         data = data.map(item => item.dataValues);
//       }
//     }
//     console.log(data);
//   };
// });
