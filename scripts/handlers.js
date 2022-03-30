const fs = require("fs");
const { pipeline } = require("stream");
const util = require("util");
const { COURIER_PARENT_TO_CHILD_MAPPER } = require("../src/utils/constants");

const pump = util.promisify(pipeline);
const startProcess = require("./reportBackfill");

/**
 *
 * @param {*} req
 * @param {*} reply
 * @returns
 */
exports.backfillHandler = async function backfillHandler(req, reply) {
  const data = await req.file();
  const body = data.fields;

  const authToken = body?.auth_token?.value || null;

  const filePath = `${__dirname}/csv_data.csv`;
  const destination = fs.createWriteStream(filePath);
  if (data) {
    await pump(data.file, destination);
  }
  const startDate = body?.start_date?.value || null;
  const endDate = body?.end_date?.value || null;
  const type = body?.backfill_type?.value || "v1"; // default type v1
  const courierUsed = body?.courier_used?.value || "";
  const courierUsedToChildCourierList = COURIER_PARENT_TO_CHILD_MAPPER[courierUsed.toUpperCase()];

  await startProcess({
    authToken,
    endDate,
    startDate,
    limit: 2000,
    type,
    csvSavefilepath: filePath,
  }); // remove await

  return reply.code(200).send({ success: true });
};
