const isEmpty = require("lodash/isEmpty");
const omit = require("lodash/omit");
const _ = require("lodash");

const logger = require("../../../logger");
const { callLambdaFunction } = require("../../connector/lambda");
const {
  updateStatusELK,
  commonTrackingDataProducer,
  updateFreshdeskTrackingTicket,
} = require("../../services/common/services");
const {
  fetchTrackingModelAndUpdateCache,
  getTrackDocumentfromMongo,
} = require("../../services/common/trackServices");
const updateStatusOnReport = require("../../services/report");
const sendTrackDataToV1 = require("../../services/v1");
const { getObject, getElkClients } = require("../../utils");
const { UNUSED_FIELDS_FROM_TRACKING_OBJ } = require("./constant");
const { getUserNotification } = require("./model");

/**
 *
 * @param {dict} trackingObj
 * @desc preapre data and call updateStatusOnReport
 */
const callSendReportDataForPulledEvent = (trackingObj) => {
  const { trackingElkClient, prodElkClient } = getElkClients();
  const statusChangedFromPull = true;
  sendTrackDataToV1(trackingObj);
  updateStatusOnReport(trackingObj, logger, trackingElkClient, false, statusChangedFromPull);
  updateStatusELK(trackingObj, prodElkClient);
  commonTrackingDataProducer(trackingObj);
  updateFreshdeskTrackingTicket(trackingObj);

  return true;
};

/**
 *
 * @desc get update tracking object
 *    if isFromPull true then fetch data from DB and prepare data, otherwise fetch data from cache
 */
const getTrackingObj = async ({ trackingId, isFromPull, result, courier, fetchFromCache = false }) => {
  if (result) {
    return result;
  }
  let couriers = [];
  if(courier){
    couriers.push(courier);
  }else{
    courier = "";
  }
  const redisKey = `${trackingId}_${courier}`;
  let trackObj;
  if (isFromPull) {
    const response = await getTrackDocumentfromMongo(trackingId, couriers);
    if (!response) {
      return false;
    }
    trackObj = response;
  } else if (fetchFromCache) {
    const cacheData = await getObject(redisKey);
    if (cacheData) {
      trackObj = cacheData.track_model;
    } else {
      trackObj = await fetchTrackingModelAndUpdateCache(trackingId, couriers=couriers);
    }
  }
  return trackObj;
};

/**
 *
 * @param {*} trackingId: string, isFromPull: boolean
 * @desc if isFromPull true then fetch data from DB and prepare data, otherwise fetch data from cache
 */
const preparePickrrConnectLambdaPayloadAndCall = async ({
  trackingId,
  isFromPull = false,
  result,
  courier,
  fetchFromCache = false,
}) => {
  try {
    fetchFromCache = false;
    let trackObj = await getTrackingObj({ trackingId, isFromPull, courier: null, result, fetchFromCache });

    if (isFromPull) {
      process.nextTick(() => {
        // trackObj contains order_pk
        callSendReportDataForPulledEvent(trackObj);
      });
    }

    // BLOCKING ALL pickrr connect events from this flow

    if (isFromPull) {
      return false;
    }
    const currentStatus = _.get(trackObj, "status.current_status_type", "");
    const parentCourier = trackObj?.courier_parent_name;
    if (isFromPull && ["Delhivery", "Ekart", "Ecom Express", "ShadowFax"].includes(parentCourier)) {
      return false;
    }
    if (["UD", "NDR"].includes(currentStatus)) {
      return false;
    }
    trackObj = omit(trackObj, UNUSED_FIELDS_FROM_TRACKING_OBJ);

    const email = trackObj.user_email;
    if (!email) {
      return false;
    }
    const userNotificationData = await getUserNotification(email);

    if (isEmpty(userNotificationData)) {
      return false;
    }

    const lambdaFunctionName =
      process.env.PICKRR_CONNECT_LAMBDA_FUNCTION_NAME ||
      "communication-SendNotificationFunction-e50PoANHl8DS";

    const payload = {
      data: [
        {
          ...trackObj,
          notification_user: userNotificationData,
        },
      ],
    };
    await callLambdaFunction(payload, lambdaFunctionName);
    return true;
  } catch (error) {
    logger.error("preparePickrrConnectLambdaPayloadAndCall error", error.message);
    return false;
  }
};

module.exports = { preparePickrrConnectLambdaPayloadAndCall };
