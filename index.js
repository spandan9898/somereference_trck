require("dotenv").config();

const server = require("./server");

const db = require("./src/connector/database");
const logger = require("./logger");

db.initDB((err, _db) => {
  if (err) {
    logger.error("DB Init Error: ", err);
  } else {
    console.log(`${_db.s.options.dbName} - DB connected`);
  }
});

// const bluedartApp = require("./src/apps/bluedart");
// const delhiveryApp = require("./src/apps/delhivery");
// const amazeApp = require("./src/apps/amaze");
// const xpressbeesApp = require("./src/apps/xpressbees");
// const ekartApp = require("./src/apps/ekart");
// const udaanApp = require("./src/apps/udaan");
// const ecommApp = require("./src/apps/ecomm");
// const shadowfaxApp = require("./src/apps/shadowfax");
// const parceldoApp = require("./src/apps/parceldo");

server.createServer(logger);
