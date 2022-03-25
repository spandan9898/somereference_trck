const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const startProcess = require("./scripts/reportBackfill");

const { argv } = yargs(hideBin(process.argv));

/**
 *
 * @desc by default, the type will be "v1". only two types are being supported right now, "report", "v1"
 */
const main = () => {
  const { authToken, endDate, startDate, limit, type = "v1" } = argv;

  if (!["report", "v1", "elk"].includes(type)) {
    throw new Error("Type must be either 'v1' or 'report'");
  }

  startProcess({ authToken, endDate, startDate, limit, type });
};

main();
