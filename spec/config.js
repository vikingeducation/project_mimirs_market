process.env.NODE_ENV = 'test';
const models = require('../models/sequelize');

afterEach(done => {
  cleanDatabase(done);
});

const cleanDatabase = (done) => {
  let modelNames = Object.keys(models).slice(2);
  let promises = [];

  for (let model of modelNames) {
    promises.push(models[model].destroy({
      where: {},
      truncate: true
    }));
  }

  Promise.all(promises)
    .then(() => {
      done();
    });
};

