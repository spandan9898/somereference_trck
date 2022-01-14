/* eslint-disable no-await-in-loop */

const moment = require("moment");
const isEmpty = require("lodash/isEmpty");
const crypto = require("crypto");
const _ = require("lodash");
const logger = require("../../../logger");
const { NEW_STATUS_TO_OLD_MAPPING } = require("../../utils/statusMapping");
const { GetTrackingJsonParentKeys, GetTrackJsonInfokeys } = require("./constant");
const { checkShowClientDetails } = require("./helpers");

/**
 * cleanes tracking response data
 * @param {*} trackModel
 */
const filterTrackingObj = async (trackModelObj) => {
  const trackModel = { ...trackModelObj };
  try {
    if ("courier_parent_name" in trackModel) {
      trackModel.courier_used = trackModel.courier_parent_name;
    }
    if ("user_pk" in trackModel) {
      delete trackModel.user_pk;
    }
    if ("last_update_from" in trackModel) {
      delete trackModel.last_update_from;
    }
    if ("updated_at" in trackModel) {
      delete trackModel.updated_at;
    }
    if ("user_id" in trackModel) {
      delete trackModel.user_id;
    }
    if ("ops_profile" in trackModel) {
      delete trackModel.ops_profile;
    }
    if ("billing_zone" in trackModel) {
      delete trackModel.billing_zone;
    }
    if ("audit" in trackModel) {
      delete trackModel.audit;
    }
    if ("info" in trackModel && "user_id" in trackModel.info) {
      delete trackModel.info.user_id;
    }
    return trackModel;
  } catch (error) {
    logger.log("filterTrackingObj error-->", error);
    throw new Error(error);
  }
};

/**
 * validates tracking json
 * @param {*} json
 * @returns
 */
const validateTrackingJson = async (trackingObj) => {
  if (isEmpty(trackingObj)) {
    return {};
  }
  const json = { ...trackingObj };
  try {
    const TrackingJsonParentKeys = await GetTrackingJsonParentKeys();
    const TrackJsonInfokeys = await GetTrackJsonInfokeys();
    for (let i = 0; i < TrackingJsonParentKeys.length; i += 1) {
      const key = TrackingJsonParentKeys[i];
      if (!(key in json)) {
        if (key === "info") {
          json[key] = {};
        } else if (key === "status") {
          json[key] = {
            current_status_time: "",
            current_status_type: "",
            received_by: "",
            current_status_body: "",
            current_status_location: "",
            current_status_val: "",
          };
        } else {
          json[key] = "";
        }
      }
    }
    for (let i = 0; i < TrackJsonInfokeys.length; i += 1) {
      const key = TrackJsonInfokeys[i];
      if (!(key in json.info)) {
        json.info[key] = "";
      }
    }
    if ("label_logo" in json) {
      json.logo = json.label_logo;
      if (!json.logo) {
        json.logo = "";
      }
    }
    if ("billing_zone" in json) {
      json.billing_zone = "";
    }
    json.xkt = crypto.createHash("sha512").update(json?.auth_token).digest().toString("hex");

    return json;
  } catch (error) {
    logger.error("validateTrackingJson error -->", error);
    throw new Error(error);
  }
};

/**
 *
 * @param {*} trackingObj
 * @returns
 */
const reverseStatusArray = (trackingObj) => {
  const trackObj = { ...trackingObj };
  if ("track_arr" in trackObj) {
    const trackArr = trackObj.track_arr;

    for (let i = 0; i < trackArr.length; i += 1) {
      if ("status_array" in trackArr[i]) {
        trackArr[i].status_array.reverse();
      }
    }
  }
  return trackObj;
};

/**
 *
 * @param {*} trackingObj
 * @returns
 */
const fixStatusMapping = (trackingObj) => {
  const trackObj = { ...trackingObj };
  if (
    trackObj.status &&
    "current_status_type" in trackObj.status &&
    trackObj.status.current_status_type in NEW_STATUS_TO_OLD_MAPPING
  ) {
    const currentStatusType = trackObj.status.current_status_type;
    trackObj.status.current_status_type = NEW_STATUS_TO_OLD_MAPPING[currentStatusType];
  }
  return trackObj;
};

/**
 * prepares the tracking response
 * @param {*} tracking
 * @returns
 */
const prepareTrackingRes = async (trackingObj) => {
  let tracking = { ...trackingObj };
  try {
    if ("response_list" in tracking) {
      const responseList = tracking.response_list;
      responseList.reverse();
      for (let i = 0; i < responseList.length; i += 1) {
        if ("err" in responseList[i] && responseList[i].err) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (!isEmpty(responseList[i])) {
          responseList[i] = await validateTrackingJson(responseList[i]);
        }
        const authToken = responseList[i]?.auth_token;
        if (!isEmpty(responseList[i])) {
          responseList[i].auth_token = "";
          responseList[i].show_details = true;
          if (authToken && !(await checkShowClientDetails(authToken))) {
            responseList[i].company_name = "";
            responseList[i].show_details = false;
          }
          responseList[i].web_address = "";
          try {
            responseList[i].edd_stamp = moment
              .utc(responseList[i].edd_stamp)
              .subtract(330, "minutes");
            if (!responseList[i].edd_stamp.isValid()) {
              responseList[i].edd_stamp = "";
            }
          } catch (error) {
            responseList[i].edd_stamp = "";
          }
          try {
            responseList[i].info.to_phone_number = "";
            responseList[i].info.to_address = "";
            responseList[i].info.invoice_value = "";
            responseList[i].info.to_email = "";
            responseList[i].info.to_name = "";
          } catch {
            // pass
          }
          if (!responseList[i].track_arr) {
            let statusLocation = null;
            let statusTime = null;
            try {
              if (responseList[i].status && "current_status_location" in responseList[i].status) {
                statusLocation = responseList[i].status.current_status_location;
              } else {
                statusLocation = "";
              }
              if ("current_status_time" in responseList[i].status) {
                statusTime = responseList[i].status.current_status_time;
              } else {
                statusTime = "";
              }
            } catch {
              statusTime = "";
              statusLocation = "";
            }
            responseList[i].track_arr = [
              {
                status_array: [
                  {
                    status_body: "Order Placed",
                    status_location: statusLocation,
                    status_time: statusTime,
                  },
                ],
                status_name: "OP",
              },
            ];
          } else responseList[i].track_arr.reverse();
          responseList[i] = reverseStatusArray(responseList[i]);
        }
      }
    } else {
      tracking = await validateTrackingJson(tracking);
      const authToken = tracking?.auth_token;

      if (!isEmpty(tracking)) {
        tracking.auth_token = "";
        tracking.show_details = true;
        if (authToken && !(await checkShowClientDetails(authToken))) {
          tracking.company_name = "";
          tracking.show_details = false;
        }
        tracking.web_address = "";
      }
      try {
        if (["6c96b95bb99c767660312f5fd97c558732735"].includes(authToken) && tracking.edd_stamp) {
          tracking.edd_stamp = moment
            .utc(tracking.edd_stamp)
            .add(1, "day")
            .subtract(330, "minutes");
        } else if (tracking.edd_stamp) {
          tracking.edd_stamp = moment.utc(tracking.edd_stamp).subtract(330, "minutes");
        }
      } catch {
        tracking.edd_stamp = "";
      }
      try {
        tracking.info.to_phone_number = "";
        tracking.info.to_address = "";
        tracking.info.invoice_value = "";
        tracking.info.to_email = "";
        tracking.info.to_name = "";
      } catch {
        // pass
      }
      if (!tracking.track_arr) {
        let statusLocation = null;
        let statusTime = null;
        try {
          if (tracking.status && "current_status_location" in tracking.status) {
            statusLocation = tracking.status.current_status_location;
          } else {
            statusLocation = "";
          }
          if ("current_status_time" in tracking.status) {
            statusTime = tracking.status.current_status_time;
          } else {
            statusTime = "";
          }
        } catch {
          statusTime = "";
          statusLocation = "";
        }
        tracking.track_arr = [
          {
            status_array: [
              {
                status_body: "Order Placed",
                status_location: statusLocation,
                status_time: statusTime,
              },
            ],
            status_name: "OP",
          },
        ];
      } else {
        tracking.track_arr.reverse();
      }

      tracking = reverseStatusArray(tracking);
    }
    return tracking;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * edits response from prepareClientTracking in responseList and single response
 * @param {*} trackingObj
 * @returns
 */
const prepareTrackObjForClientTracking = async (trackingObj) => {
  let tracking = { ...trackingObj };
  tracking = _.omit(tracking, ["xkt"]);
  if ("edd_stamp" in tracking && tracking.edd_stamp !== "") {
    tracking.edd_stamp = moment(tracking.edd_stamp).add(330, "minute").format("DD MMM YYYY, HH:mm");
  }
  if ("status" in tracking && "current_status_time" in tracking.status) {
    tracking.status.current_status_time = moment(
      tracking.status.current_status_time,
      "YYYY-MM-DD HH:mm:ss"
    ).format("DD MMM YYYY, HH:mm");
  }
  if ("logo" in tracking) {
    tracking.logo = "";
  }
  if ("last_update_from" in tracking) {
    tracking = _.omit(tracking, ["last_update_from"]);
  }
  let trackArr = tracking?.track_arr || [];
  trackArr = trackArr.map((trackItem) => {
    const statusArray = trackItem.status_array.map((item) =>
      _.omit(item, [
        "scan_datetime",
        "scan_location",
        "scan_status",
        "system_updated_at",
        "update_source",
        "update_time",
      ])
    );
    return {
      ...trackItem,
      status_array: statusArray,
    };
  });

  if (!isEmpty(trackArr)) tracking.track_arr = trackArr;
  if ("courier_parent_name" in tracking) {
    tracking.courier_used = tracking.courier_parent_name;
  }
  return tracking;
};

/**
 * edits tracking response generated from prepareTrackingRes
 * according to track/tracking response (clientTracking)
 * @param {*} trackingObj
 * @returns
 */
const prepareClientTracking = async (trackingObj) => {
  try {
    let tracking = { ...trackingObj };
    if ("response_list" in tracking) {
      const responseList = tracking.response_list;
      responseList.reverse();
      for (let i = 0; i < responseList.length; i += 1) {
        responseList[i] = await prepareTrackObjForClientTracking(responseList[i]);
      }
    } else {
      tracking = await prepareTrackObjForClientTracking(tracking);
    }
    return tracking;
  } catch (error) {
    logger.error("prepareClientTracking error --->", error);
    throw new Error(error);
  }
};

/**
 * edits tracking response generated from prepareTrackingRes
 * according to tracking response (public tracking)
 * @param {*} trackingObj
 * @returns
 */
const preparePublicTracking = async (trackingObj) => {
  try {
    let tracking = { ...trackingObj };
    if ("response_list" in tracking) {
      const responseList = tracking.response_list;
      for (let i = 0; i < responseList.length; i += 1) {
        if (!isEmpty(responseList[i])) {
          responseList[i] = fixStatusMapping(responseList[i]);
        }
      }
    } else if (!isEmpty(tracking)) {
      tracking = fixStatusMapping(tracking);
    }
    return tracking;
  } catch (error) {
    logger.error("preparePublicTracking error --->", error);
    throw new Error(error);
  }
};

module.exports = {
  filterTrackingObj,
  prepareTrackingRes,
  prepareClientTracking,
  preparePublicTracking,
};
