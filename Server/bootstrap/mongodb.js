const mongoose = require("mongoose");
const { db } = require("../app-setting");

url = `mongodb://${db.mongo.main.address}/${db.mongo.main.name}`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});

mongoose.Promise = Promise;

module.exports = mongoose;
