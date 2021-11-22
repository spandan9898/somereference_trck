require("dotenv").config();

const server = require("./server");

const bluedartApp = require("./src/apps/bluedart");

// const delhiveryApp = require("./src/apps/delhivery");

server.createServer();
