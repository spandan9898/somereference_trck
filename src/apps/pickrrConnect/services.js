const isEmpty = require("lodash/isEmpty");
const set = require("lodash/set");

const { callLambdaFunction } = require("../../connector/lambda");
const { sendDataToElk } = require("../../services/common/elk");
const { fetchTrackingModelAndUpdateCache } = require("../../services/common/trackServices");
const { getObject } = require("../../utils");
const { getUserNotification } = require("./model");

/**
 *
 * @param {*} trackingId: string, isFromPull: boolean
 * @desc if isFromPull true then fetch data from DB and prepare data, otherwise fetch data from cache
 */
const preparePickrrConnectLambdaPayloadAndCall = async ({
  trackingId,
  elkClient,
  isFromPull = false,
}) => {
  let trackObj;

  if (isFromPull) {
    const response = await fetchTrackingModelAndUpdateCache(trackingId);
    if (!response) {
      return false;
    }
    trackObj = response.track_model;
  } else {
    const cacheData = await getObject(trackingId);
    if (cacheData) {
      trackObj = cacheData.track_model;
    } else {
      trackObj = await fetchTrackingModelAndUpdateCache(trackingId);
    }
  }
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
};

module.exports = { preparePickrrConnectLambdaPayloadAndCall };
