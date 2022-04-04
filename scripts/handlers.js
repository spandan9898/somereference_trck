const fs = require("fs");
const { pipeline } = require("stream");
const util = require("util");

const pump = util.promisify(pipeline);
const startProcess = require("./reportBackfill");

/**
 *
 * @param {*} req
 * @param {*} reply
 * @returns
 */
exports.backfillHandler = async function backfillHandler(req, reply) {
  try {
    const data = await req.file();
    const body = data.fields;

    const authToken = body?.auth_token?.value || null;

    const filePath = `${__dirname}/csv_data_${new Date()}.csv`;
    const destination = fs.createWriteStream(filePath);
    if (data) {
      await pump(data.file, destination);
    }
    const startDate = body?.start_date?.value || null;
    const endDate = body?.end_date?.value || null;
    const type = body?.backfill_type?.value || "";
    let typeList = [];
    if (type) {
      typeList = type.split(",");
    }
    const limit = body?.limit?.value || 2000;

    await startProcess({
      authToken,
      endDate,
      startDate,
      limit,
      type: typeList,
      csvSavefilepath: filePath,
    });

    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
    return reply.code(200).send({ success: true });
  } catch (error) {
    return reply.code(200).send({ success: false, err: error.message });
  }
};
