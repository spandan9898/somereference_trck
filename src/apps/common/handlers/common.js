/* eslint-disable require-jsdoc */
const RequestIp = require("@supercharge/request-ip");
const moment = require("moment");
const Papa = require("papaparse");

const { startProcess } = require("../../../../scripts/reportBackfill");
const { sendDataToElk } = require("../../../services/common/elk");
const { updateStatusFromCSV } = require("../../../services/common/updateStatusFromCsv");
const { getElkClients } = require("../../../utils");

module.exports.returnHeaders = async (req, reply) => {
  const IP = RequestIp.getClientIp(req);
  const replydict = {
    IP,
    headers: req.headers,
  };
  return reply.code(200).send(replydict);
};

module.exports.reportBackfilling = async (req, reply) => {
  const { body } = req;
  const { authToken, lastNDays = 1, type = ["v1"], limit, dateFilter = "updated_at" } = body || {};
  const startDate = moment().subtract(lastNDays, "days").format("DD-MM-YYYY");
  const endDate = moment().format("DD-MM-YYYY");
  await startProcess({
    authToken,
    startDate,
    endDate,
    type,
    limit,
    dateFilter,
  });
  return reply.code(200).send(body);
};

module.exports.updateStatus = async function updateStatus(req, reply) {
  try {
    const headersField = ["headers", "ip", "ips", "hostname"];
    const headersObj = {};

    headersField.forEach((header) => {
      headersObj[header] = req[header];
    });

    if (!req.isMultipart()) {
      return reply.code(400).send({
        message: "Please send proper file",
      });
    }
    const options = { limits: { fileSize: 1000000 } };
    const data = await req.file(options);
    const body = data.fields;

    const authToken = body?.auth_token?.value || "";
    const email = body?.email?.value || "";

    if (authToken !== process.env.UPDATE_STATUS_AUTH_TOKEN) {
      return reply.code(401).send({
        message: "Invalid Auth Token",
      });
    }
    if (!email || !email.endsWith("@pickrr.com")) {
      return reply.code(404).send({
        message: "Please provide a valid email address",
      });
    }
    const { trackingElkClient } = getElkClients();

    sendDataToElk({
      body: {
        email,
        payload: JSON.stringify(headersObj),
        time: new Date(),
      },
      elkClient: trackingElkClient,
      indexName: "track_manual_update",
    });

    const csvData = [];

    Papa.parse(data.file, {
      worker: true,
      header: true,
      step(results) {
        const header = Object.keys(results.data).join(" ");
        if (header !== "tracking_id date status") {
          throw new Error("Please provide valid header");
        }
        if (results.data) {
          csvData.push(results.data);
        }
      },
      complete() {
        updateStatusFromCSV(csvData);
      },
    });

    return reply.code(200).send({
      success: true,
    });
  } catch (error) {
    if (error.code === "FST_REQ_FILE_TOO_LARGE") {
      return reply.code(400).send({
        message: "File is too large. We're allowing only 1 MB",
      });
    }
    return reply.code(400).send({
      message: error.message,
    });
  }
};
