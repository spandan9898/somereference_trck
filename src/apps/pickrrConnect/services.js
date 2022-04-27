const isEmpty = require("lodash/isEmpty");
const omit = require("lodash/omit");

const logger = require("../../../logger");
const { callLambdaFunction } = require("../../connector/lambda");
const { updateStatusELK } = require("../../services/common/services");
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

  sendTrackDataToV1(trackingObj);
  updateStatusOnReport(trackingObj, logger, trackingElkClient);
  updateStatusELK(trackingObj, prodElkClient);

  return true;
};

/**
 *
 * @desc get update tracking object
 *    if isFromPull true then fetch data from DB and prepare data, otherwise fetch data from cache
 */
const getTrackingObj = async ({ trackingId, isFromPull, result, fetchFromCache = false }) => {
  if (result) {
    return result;
  }
  let trackObj;
  if (isFromPull) {
    const response = await getTrackDocumentfromMongo(trackingId);
    if (!response) {
      return false;
    }
    trackObj = response;
  } else if (fetchFromCache) {
    const cacheData = await getObject(trackingId);
    if (cacheData) {
      trackObj = cacheData.track_model;
    } else {
      trackObj = await fetchTrackingModelAndUpdateCache(trackingId);
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
  fetchFromCache = false,
}) => {
  try {
    let trackObj = await getTrackingObj({ trackingId, isFromPull, result, fetchFromCache });

    if (isFromPull) {
      process.nextTick(() => {
        callSendReportDataForPulledEvent(trackObj);
      });
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
