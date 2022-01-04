/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
const _ = require("lodash");

const logger = require("../../../logger");

const { COMPULSORY_EVENTS } = require("./constants");

/**
 *
 * @param {*} trackArr -> db tarck_arr
 * @desc create a hash map from track array, something like below
 * {
    OP: [],
    PP: [],
    DL: []
    }
 * @returns
 */
const getTrackObjFromTrackArray = (trackArr) => {
  try {
    return trackArr.reduce((obj, trackItem) => {
      const { scan_type: scanType } = trackItem;
      if (!obj[scanType]) {
        obj[scanType] = [];
      }
      obj[scanType].push(trackItem);
      return obj;
    }, {});
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 */
class WebhookHelper {
  prepareInitialFlagCheckReqObj() {
    return Object.keys(COMPULSORY_EVENTS).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = false;
      return newObj;
    }, {});
  }

  checkIfCompulsoryEventExistsInTrackArray(trackArray, event) {
    return trackArray.some((trackItem) => trackItem.scan_type === event);
  }

  mapEventTotStatus(trackObj) {
    const latestStatus = {};

    latestStatus.current_status_time = trackObj.scan_datetime || "";
    latestStatus.current_status_type = trackObj.scan_type || "";
    latestStatus.current_status_body = trackObj.scan_status || "";
    latestStatus.pickrr_sub_status_code = trackObj.pickrr_sub_status_code || "";
    latestStatus.courier_status_code = trackObj.courier_status_code || "";
    latestStatus.current_status_location = trackObj.scan_location || "";

    return latestStatus;
  }
}

module.exports = {
  WebhookHelper,
  getTrackObjFromTrackArray,
};
