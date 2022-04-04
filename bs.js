/* eslint-disable prefer-const */
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const moment = require("moment");
const startProcess = require("./scripts/reportBackfill");

// const { redisClient } = require("./src/utils");

const { argv } = yargs(hideBin(process.argv));

/**
 *
 * @desc by default, the type will be "v1". only two types are being supported right now, "report", "v1",
 * pFor = process for
 */
const main = async () => {
  let { authToken, endDate, startDate, limit, type = "v1", pFor = "db" } = argv;

  if (pFor === "db" && !startDate && !endDate) {
    startDate = moment().subtract(3, "days").format("DD-MM-YYYY");
    endDate = moment().format("DD-MM-YYYY");
  }

  // await redisClient.connect();

  let types = type.split(",");

  types = type === "all" ? ["v1", "report", "elk", "ndr"] : types;

  startProcess({ authToken, endDate, startDate, limit, type: types });
};

main();
