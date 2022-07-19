/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
const RequestIp = require("@supercharge/request-ip");
const moment = require("moment");
const PapaParse = require("papaparse");

const { startProcess } = require("../../../../scripts/reportBackfill");
const { sendDataToElk } = require("../../../services/common/elk");
const {
  updateStatusFromCSV,
  toggleManualStatus,
} = require("../../../services/common/updateStatusFromCsv");
const { getElkClients, sendEmail } = require("../../../utils");

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
    let { auth_token: authToken, email, platform_names: platformNames } = req.query || {};

    if (!platformNames) {
      return reply.code(401).send({
        message: "Please provide a valid platform names",
      });
    }
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

    platformNames = platformNames.split(",");

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

    PapaParse.parse(data.file, {
      worker: true,
      header: true,
      step(results) {
        try {
          const header = Object.keys(results.data).join(" ");
          if (header !== "tracking_id date status sub_status_code status_text") {
            throw new Error("Please provide valid header");
          }
          if (results.data) {
            csvData.push(results.data);
          }
        } catch (error) {
          sendEmail({
            to: ["spandan.mishra@pickrr.com", "tarun@pickrr.com", "ankitkumar@pickrr.com"],
            subject: `Lost Shipment Report Upload Error`,
            text: error.message,
          });
          throw new Error("No More execution");
        }
      },
      complete() {
        updateStatusFromCSV(csvData, platformNames);
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

module.exports.toggleManualStatusUpdate = async function toggleManualStatusUpdate(req, reply) {
  try {
    if (!req.isMultipart()) {
      return reply.code(400).send({
        message: "Please send proper file",
      });
    }

    const { auth_token: authToken, email } = req.query || {};
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
    const options = { limits: { fileSize: 1000000 } };

    const headersField = ["headers", "ip", "ips", "hostname"];
    const headersObj = {};

    headersField.forEach((header) => {
      headersObj[header] = req[header];
    });

    const { trackingElkClient } = getElkClients();

    sendDataToElk({
      body: {
        email,
        payload: JSON.stringify({
          ...headersObj,
          update_for: "manual_status_update_toggle",
        }),
        time: new Date(),
      },
      elkClient: trackingElkClient,
      indexName: "track_manual_update",
    });

    const data = await req.file(options);

    const csvData = [];

    PapaParse.parse(data.file, {
      worker: true,
      header: true,
      step(results) {
        const header = Object.keys(results.data).join(" ");
        if (header !== "tracking_id") {
          throw new Error("Please provide valid header");
        }
        if (results.data) {
          csvData.push(results.data);
        }
      },
      complete() {
        toggleManualStatus(csvData);
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
