const isEmpty = require("lodash/isEmpty");
const omit = require("lodash/omit");

const logger = require("../../../logger");
const { callLambdaFunction } = require("../../connector/lambda");
const { sendDataToElk } = require("../../services/common/elk");
const {
  fetchTrackingModelAndUpdateCache,
  getTrackDocumentfromMongo,
} = require("../../services/common/trackServices");
const { getObject } = require("../../utils");
const { UNUSED_FIELDS_FROM_TRACKING_OBJ } = require("./constant");
const { getUserNotification } = require("./model");

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
  elkClient,
  isFromPull = false,
  result,
  fetchFromCache = false,
}) => {
  try {
    let trackObj = await getTrackingObj({ trackingId, isFromPull, result, fetchFromCache });
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

    //   Update Data in ELK

    const body = {
      awb: trackingId,
      isFromPull,
      payload: JSON.stringify(payload),
      time: new Date(),
    };

    await sendDataToElk({
      indexName: "track-pickrr-connect",
      body,
      elkClient,
    });
    return true;
  } catch (error) {
    logger.error("preparePickrrConnectLambdaPayloadAndCall error", error);
    return false;
  }
};

module.exports = { preparePickrrConnectLambdaPayloadAndCall };
