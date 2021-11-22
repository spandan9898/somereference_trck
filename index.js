require("dotenv").config();

const server = require("./server");
const db = require("./src/connector/database");

/**
 * Initialize Database
 */
db.initDB((err, _db) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`${_db.s.options.dbName} DB connected`);
  }
});

// const bluedartApp = require("./src/apps/bluedart");

// const delhiveryApp = require("./src/apps/delhivery");

server.createServer();
