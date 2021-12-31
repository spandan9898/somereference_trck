/* eslint-disable no-await-in-loop */

const moment = require("moment");
const isEmpty = require("lodash/isEmpty");
const logger = require("../../../logger");
const { convertDatetimeFormat2 } = require("../../utils");
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
        }
      }
    }
    for (let i = 0; i < TrackJsonInfokeys.length; i += 1) {
      const key = TrackJsonInfokeys[i];
      if (!(key in json.info)) {
        json.info[key] = "";
      }
    }
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
            responseList[i].edd_stamp = await convertDatetimeFormat2(responseList[i].edd_stamp);
          } catch (error) {
            // pass
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
          responseList[i] = fixStatusMapping(responseList[i]);
        }
      }
    } else {
      tracking = await validateTrackingJson(tracking);
      const authToken = tracking.auth_token;
      try {
        tracking.status.current_status_time = await convertDatetimeFormat2(
          tracking.status.current_status_time
        );
        tracking.edd_stamp = await convertDatetimeFormat2(tracking.edd_stamp);
        if (["6c96b95bb99c767660312f5fd97c558732735"].includes(authToken)) {
          tracking.edd_stamp = moment(tracking.edd_stamp, "DD MMM YYYY, HH:mm")
            .add(1, "day")
            .format("DD MMM YYYY HH:mm");
        }
      } catch {
        // pass
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
      if (!isEmpty(tracking)) {
        tracking = fixStatusMapping(tracking);
      }
    }
    return tracking;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = { filterTrackingObj, prepareTrackingRes };
