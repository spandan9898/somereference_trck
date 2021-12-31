const moment = require("moment");
const _ = require("lodash");

const {
  SHOPCLUES_STATUS_CODE_TO_STATUS_MAPS,
  SHOPCLUES_STATUS_DESCRIPTION_MAPPING,
  SHOPCLUES_STATUS_MAPPING,
} = require("./constants");
const logger = require("../../../../logger");

/**
 *
 * @param {*} trackResponse
 * @desc prepare payload from shopclues
 */
const createShopcluesTrackingJson = (trackResponse) => {
  const shopcluesTrackingJson = {
    awbno: "",
    status: "",
    status_code: "",
    status_description: "",
    statusUpdateDate: "",
    statusUpdateTime: "",
    current_location: "",
    from_location: "",
    to_location: "",
    comments: "",
    reasonCode: "",
    rto_awbno: "",
    received_by: "",
  };

  try {
    const currentStatusDict = trackResponse.status || {};

    let statusUpdateDate = "";
    let statusUpdateTime = "";

    let currentStatusDatetime = currentStatusDict.current_status_time || "";
    if (moment(currentStatusDatetime).isValid()) {
      currentStatusDatetime = moment(currentStatusDatetime);
      statusUpdateDate = currentStatusDatetime.format("YYYY-MM-DD");
      statusUpdateTime = currentStatusDatetime.format("HH:mm:ss");
    }

    let statusType = currentStatusDict.current_status_type || "";
    let currentStatus = currentStatusDict.current_status_body || "";
    let comments = currentStatusDict.current_status_body || "";
    let statusDescription = SHOPCLUES_STATUS_DESCRIPTION_MAPPING[statusType] || currentStatus;

    let reasonCode = "";
    let pickrrSubStatusCode = "";

    if (trackResponse.track_arr) {
      const { track_arr: trackArr } = trackResponse;
      const trackArrReverse = _.cloneDeep(trackArr);
      _.reverse(trackArrReverse);
      let currentlyNdr = false;

      trackArrReverse.forEach((trackItem) => {
        if (["ndr", "ud"].includes((trackItem.scan_type || "").toLowerCase())) {
          currentlyNdr = true;
          reasonCode = trackItem.scan_status;
          pickrrSubStatusCode = trackItem.pickrr_sub_status_code || "";
        } else {
          reasonCode = "";
        }
      });

      if (!["dl", "rto", "rtd"].includes((statusType || "").toLowerCase()) && currentlyNdr) {
        statusType = "NDR";
        currentStatus = "Failed Attempt at Delivery";
        comments = reasonCode;
        statusDescription = reasonCode;
      }
    }
    if (["ndr", "ud"].includes((statusType || "").toLowerCase())) {
      const subStatus = pickrrSubStatusCode;
      if (!subStatus) {
        currentStatus = "Undelivered";
        statusType = "NDR";
        statusDescription = SHOPCLUES_STATUS_DESCRIPTION_MAPPING.NDR;
      } else {
        statusType = subStatus;
        currentStatus = SHOPCLUES_STATUS_CODE_TO_STATUS_MAPS[subStatus] || "Undelivered";
        statusDescription =
          SHOPCLUES_STATUS_DESCRIPTION_MAPPING[subStatus] || "Undelivered- Other Reasons";
      }
    } else {
      currentStatus = SHOPCLUES_STATUS_MAPPING[statusType] || "";
    }

    const infoDict = trackResponse.info || {};
    const receivedByName = statusType.toLowerCase() === "rtd" ? "from_name" : "to_name";
    shopcluesTrackingJson.awbno = trackResponse.courier_tracking_id || trackResponse.tracking_id;
    shopcluesTrackingJson.status = currentStatus;
    shopcluesTrackingJson.status_code = statusType;
    shopcluesTrackingJson.status_description = statusDescription;
    shopcluesTrackingJson.statusUpdateDate = statusUpdateDate;
    shopcluesTrackingJson.statusUpdateTime = statusUpdateTime;
    shopcluesTrackingJson.current_location = currentStatusDict.current_status_location;
    shopcluesTrackingJson.from_location = infoDict?.from_city || "";
    shopcluesTrackingJson.to_location = infoDict?.to_city || "";
    shopcluesTrackingJson.comments = comments;
    shopcluesTrackingJson.reasonCode = "";
    shopcluesTrackingJson.rto_awbno = trackResponse.courier_tracking_id || "";
    shopcluesTrackingJson.received_by =
      currentStatusDict.received_by || trackResponse?.info[receivedByName] || "";
    return shopcluesTrackingJson;
  } catch (error) {
    logger.error("createShopcluesTrackingJson", error);
    return {};
  }
};

module.exports = createShopcluesTrackingJson;
