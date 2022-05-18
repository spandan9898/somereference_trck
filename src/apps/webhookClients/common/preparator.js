const _ = require("lodash");

const logger = require("../../../../logger");
const { REMOVE_ELEMENT_KEYS } = require("./constants");
const {
  validateTrackingJson,
  prepareEddStamp,
  checkShowDetailsClient,
  getCurrentStatusTime,
  mapTrackArray,
  removeSecondsFromDateString,
} = require("./helpers");

/**
 *
 * @param {*} trackDict
 */
const filterTrackingParamsForTracker = async (trackDict) => {
  const callCheckClientDetailsApi = false;
  const trackObj = _.cloneDeep(trackDict);

  trackObj.show_details = true;
  trackObj.logo = trackObj.label_logo;
  const authToken = trackObj.auth_token;
  if (authToken) {
    if (["6c96b95bb99c767660312f5fd97c558732735"].includes(authToken)) {
      trackObj.edd_stamp = trackObj.edd_stamp_one_more_day;
    }
  }

  if (!callCheckClientDetailsApi) {
    const isShowDetailsForClient = await checkShowDetailsClient(authToken);
    if (!isShowDetailsForClient) {
      trackObj.show_details = false;
      trackObj.company_name = "";
      trackObj.logo = "";
    }
  }
  trackObj.auth_token = "";

  if (
    !["5967ba6e84528b2dad61df7b94de1106213782", "bcccdd5bae06f93eaf21f4866febf943173741"].includes(
      authToken
    )
  ) {
    _.set(trackObj, "info.to_phone_number", "");
  }
  _.set(trackObj, "info.to_address", "");
  _.set(trackObj, "info.to_address", "");
  _.set(trackObj, "info.invoice_value", "");
  _.set(trackObj, "info.to_email", "");
  _.set(trackObj, "info.to_name", "");

  return trackObj;
};

/**
 *
 * @param {*} payload -> prepared data
 * @desc https://pickrr.atlassian.net/browse/PE-2310
 */
const prepareDataForCred = (payload) => {
  const updatedPayload = _.omit(payload, [
    "edd_stamp_one_more_day",
    "courier_edd",
    "pickup_address_pk",
    "status_pk",
    "promise_edd",
  ]);
  _.set(
    updatedPayload,
    "pickup_datetime",
    removeSecondsFromDateString(_.get(updatedPayload, "pickup_datetime"))
  );
  _.set(
    updatedPayload,
    "edd_stamp",
    removeSecondsFromDateString(_.get(updatedPayload, "edd_stamp"))
  );
  return updatedPayload;
};

/**
 * @param {*} trackingResponse
 * @desc preparing common tracking data from tracing object(document)
 */
const prepareCommonTrackingInfo = async (trackingResponse) => {
  try {
    const trackingInfoDoc = validateTrackingJson(trackingResponse);
    const eddStamp = trackingInfoDoc.edd_stamp;
    if (eddStamp) {
      trackingInfoDoc.edd_stamp = prepareEddStamp(eddStamp);
      trackingInfoDoc.edd_stamp_one_more_day = prepareEddStamp(eddStamp, 1);
    }
    const updatedTrackingInfoDoc = await filterTrackingParamsForTracker(trackingInfoDoc);

    _.set(
      updatedTrackingInfoDoc,
      "status.current_status_time",
      getCurrentStatusTime(updatedTrackingInfoDoc.status.current_status_time)
    );

    const currentStatusType = _.get(updatedTrackingInfoDoc, "status.current_status_type", "");
    if (currentStatusType === "UD") {
      updatedTrackingInfoDoc.status.current_status_type = "NDR";
    }

    _.set(updatedTrackingInfoDoc, "status.current_status_val", "");
    _.set(
      updatedTrackingInfoDoc,
      "track_arr",
      mapTrackArray(_.get(updatedTrackingInfoDoc, "track_arr"), [])
    );
    _.reverse(updatedTrackingInfoDoc.track_arr);

    const courierParentName = updatedTrackingInfoDoc.courier_parent_name;
    if (courierParentName) {
      updatedTrackingInfoDoc.courier_used = courierParentName;
    }
    updatedTrackingInfoDoc.fetched_from = "kafka_lambda";

    let payload = _.omit(updatedTrackingInfoDoc, REMOVE_ELEMENT_KEYS);

    if (["2a5117e87dbec8dbcb003c0c9df483d0243411"].includes(trackingResponse.auth_token)) {
      payload = prepareDataForCred(payload);
    }

    return payload;
  } catch (error) {
    logger.error("prepareCommonTrackingInfo", error);
    return {};
  }
};

module.exports = prepareCommonTrackingInfo;
