module.exports = () =>
  require("mongoose").connect(require("./config/mongoUrl"), {
    useMongoClient: true
  });
