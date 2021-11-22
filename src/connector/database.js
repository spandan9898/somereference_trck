const { MongoClient } = require("mongodb");

const pullDbMongoClient = new MongoClient(process.env.MONGO_DB_PULL_SERVER_HOST, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = {
  pullDbMongoClient,
};
