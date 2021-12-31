const _ = require("lodash");
const moment = require("moment");
const axios = require("axios");

const logger = require("../../../../logger");
const {
  TRACKING_INFO_PARENT_KEYS,
  GET_TRACK_INFO_KEYS,
  PICKRR_STATUS_CODE_MAPPING,
} = require("./constants");

/**
 *
 * @param {*} trackObj
 * @returns updated tracking obj
 */
const validateTrackingJson = (trackObj) => {
  const trackingObj = _.cloneDeep(trackObj);
  try {
    TRACKING_INFO_PARENT_KEYS.forEach((key) => {
      if (!trackingObj[key]) {
        if (key === "info") {
          trackingObj[key] = {};
        } else if (key === "status") {
          trackingObj[key] = {
            current_status_time: "",
            current_status_type: "",
            received_by: "",
            current_status_body: "",
            current_status_location: "",
            current_status_val: "",
          };
        } else {
          trackingObj[key] = "";
        }
      }
    });
    GET_TRACK_INFO_KEYS.forEach((key) => {
      if (!trackingObj.info[key]) {
        trackingObj.info[key] = "";
      }
    });
  } catch (error) {
    logger.error("validateTrackingJson", error);
  }

  return trackingObj;
};

/**
 *
 * @param {*} eddDatetime
 */
const prepareEddStamp = (eddDatetime, addDay) => {
  if (moment(eddDatetime).isValid()) {
    let eddDate = moment(eddDatetime).subtract(330, "minutes");
    if (addDay) {
      eddDate = eddDate.add(addDay, "day");
    }
    return eddDate.format("DD-MM-YYYY HH:mm:ss");
  }
  return eddDatetime;
};

/**
 *
 * @param {*} authToken
 * @desc check if the given token is valid for showing more details
 * @returns true/false
 */
const checkShowDetailsClient = async (authToken) => {
  try {
    const response = await axios.get("https://async.pickrr.com/track/check/show/details/client/", {
      headers: {
        Authorization: authToken,
      },
    });
    const { data } = response;
    if (data.is_success) {
      return data.is_success;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 *
 * @param {*} currentStatusTime
 * @returns formatted current status time
 */
const getCurrentStatusTime = (currentStatusTime) => {
  if (moment(currentStatusTime).isValid()) {
    return moment(currentStatusTime).format("DD-MM-YYYY HH:mm");
  }
  return currentStatusTime;
};

/**
 *
 * @param {*} trackArr
 * @desc prepare track array
 * @returns
 */
const mapTrackArray = (trackArr) =>
  trackArr.map((trackObj) => {
    const statusObj = {
      status_body: trackObj.scan_status,
      status_time: getCurrentStatusTime(trackObj.scan_datetime),
      pickrr_status: PICKRR_STATUS_CODE_MAPPING[trackObj.scan_type],
      status_location: trackObj.scan_location,
      courier_status_code: trackObj.courier_status_code,
      pickrr_sub_status_code: trackObj.pickrr_sub_status_code,
    };

    return {
      status_name: trackObj.scan_type === "UD" ? "NDR" : trackObj.scan_type,
      status_array: [statusObj],
    };
  });

module.exports = {
  validateTrackingJson,
  prepareEddStamp,
  checkShowDetailsClient,
  getCurrentStatusTime,
  mapTrackArray,
};
