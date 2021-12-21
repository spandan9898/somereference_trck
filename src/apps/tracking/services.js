/* eslint-disable no-await-in-loop */
const _ = require("lodash");
const { getObject, getString } = require("../../utils/redis");
const commonTrackingInfoCol = require("../../services/pull/model");
const { prepareTrackDataForTrackingAndStoreInCache } = require("../../services/pull/services");

/**
 *
 * @param {*} trackingIds
 * @param {*} clientOrderIds
 * @param {*} authToken
 * @param {*} ip
 */
const fetchTrackingService = async (trackingIds, clientOrderIds) => {
  console.log(trackingIds, clientOrderIds);
  try {
    const responseDict = {};
    const responseList = [];
    if (trackingIds) {
      const trackingIdsList = trackingIds.split(",");
      if (trackingIdsList.length > 30) {
        throw new Error("cannot track more than 30 waybills at once");
      }
      for (let i = 0; i < trackingIdsList.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const cachedTrackData = (await getObject(trackingIdsList[i])) || {};
        console.log("coming from cache", cachedTrackData);
        if (!_.isEmpty(cachedTrackData)) {
          responseList.push(cachedTrackData);
        } else {
          // fetch from mongo against tracking id and then update on cache

          try {
            const pullCollection = await commonTrackingInfoCol();
            const res = (await pullCollection.findOne({ tracking_id: trackingIdsList[i] })) || {};
            if (res) {
              const trackArr = await [...res.track_arr];
              const cachedAwbData = await prepareTrackDataForTrackingAndStoreInCache(
                trackArr,
                trackingIdsList[i]
              );

              // does above function return modified trackArray?

              responseList.push(cachedAwbData);
            }
          } catch (error) {
            // log error (what logger to use?)
          }
        }
      }
    } else if (clientOrderIds) {
      const clientOrderIdsList = clientOrderIds.split(",");
      if (clientOrderIdsList.length > 30) {
        throw new Error("cannot track more than 30 client order ids at once");
      }
      for (let i = 0; i < clientOrderIdsList.length; i += 1) {
        const clientOrderIdPattern = `${clientOrderIdsList[i]}*`;

        // check this pattern in redis, fetch key mapped against it else

        const cachedTrackData = (await getString(clientOrderIdPattern)) || {};
        if (_.isEmpty(cachedTrackData)) {
          const pullCollection = await commonTrackingInfoCol();
          const res =
            (await pullCollection.findOne({ client_order_id: clientOrderIdsList[i] })) || {};
          if (!_.isEmpty(res)) {
            const trackArr = res.track_arr;
            const awb = res.tracking_id;
            const cachedAwbData = await prepareTrackDataForTrackingAndStoreInCache(trackArr, awb);
            responseList.push(cachedAwbData);
          }
        } else {
          responseList.push(cachedTrackData);
        }
      }
    }
    responseDict.response_list = responseList;
    return responseDict;
  } catch (error) {
    // catch error for the service

    console.log("error -->", error);
    throw new Error("some error in the service function");
  }
};

module.exports = {
  fetchTrackingService,
};
