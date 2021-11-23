require("dotenv").config();

const server = require("./server");

const db = require("./src/connector/database");

db.initDB((err, _db) => {
  if (err) {
    console.log(err);

    // TODO: notify error
  } else {
    console.log();
    console.log(`${_db.s.options.dbName} | DB connected`);
  }
});

// const bluedartApp = require("./src/apps/bluedart");

const delhiveryApp = require("./src/apps/delhivery");

// const amazeApp = require("./src/apps/amaze");

server.createServer();
