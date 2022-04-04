/* eslint-disable prefer-const */
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const moment = require("moment");

const startProcess = require("./scripts/reportBackfill");

const { argv } = yargs(hideBin(process.argv));

/**
 *
 * @desc by default, the type will be "v1". only two types are being supported right now, "report", "v1",
 * pFor = process for
 */
const main = () => {
  let { authToken, endDate, startDate, limit, type = "v1", pFor = "db" } = argv;

  if (!["report", "v1", "elk", "all"].includes(type)) {
    throw new Error("Type must be either 'v1' or 'report'");
  }

  if (pFor === "db" && !startDate && !endDate) {
    startDate = moment().subtract(3, "days").format("DD-MM-YYYY");
    endDate = moment().format("DD-MM-YYYY");
  }

  console.log(startDate, endDate);

  startProcess({ authToken, endDate, startDate, limit, type });
};

main();
