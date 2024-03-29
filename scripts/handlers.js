const fs = require("fs");
const { pipeline } = require("stream");
const util = require("util");
const moment = require("moment");

const pump = util.promisify(pipeline);
const { startProcess } = require("./reportBackfill");

/**
 *
 * @param {*} req
 * @param {*} reply
 * @returns
 */
exports.backfillHandler = async function backfillHandler(req, reply) {
  try {
    const timestamp = moment().unix();
    const filePath = `${__dirname}/csv_data_${timestamp}.csv`;
    const payload = {
      timestamp,
      filePath,
      type: [],
      startDate: "",
      endDate: "",
      limit: 0,
      authToken: "",
      dateFilter: "",
    };

    if (req.isMultipart()) {
      const data = await req.file();
      const body = data.fields;
      const destination = fs.createWriteStream(filePath);
      if (data) {
        await pump(data.file, destination);
      }
      const type = body?.backfill_type?.value || "";
      if (type) {
        payload.type = type.split(",");
      }
      const authToken = body?.auth_token?.value || null;
      payload.authToken = authToken;
    } else {
      const trackingIdList = req.body.tracking_id_list || [];

      if (trackingIdList.length > 2000) {
        throw new Error("You can not send more than 2000 tracking awbs. Please use CSV option");
      }
      payload.trackingIdList = trackingIdList;
      payload.authToken = req.body.auth_token;
      payload.startDate = req.body._start_date || moment().subtract(3, "d").format("DD-MM-YYYY");
      payload.endDate = req.body._end_date || moment().format("DD-MM-YYYY");
      payload.limit = req.body.limit || 0;
      payload.type = req.body.backfill_type.split(",");
      payload.dateFilter = req.body.date_filter || "updated_at";
    }

    startProcess(payload);

    return reply.code(200).send({ success: true });
  } catch (error) {
    return reply.code(400).send({ success: false, err: error.message });
  }
};
