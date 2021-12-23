/* eslint-disable no-await-in-loop */
const _ = require("lodash");
const logger = require("../../../logger");
const { PrepareTrackModelFilters } = require("./preparator");
const commonTrackingInfoCol = require("../../services/pull/model");
const { ALLOWED_IPS, BLOCKED_IPS } = require("../../utils/constants");
const { getObject, getString, setObject } = require("../../utils/redis");
const { findOneDocumentFromMongo, findandProject } = require("../../utils/mongo_utils");
const { prepareTrackDataForTrackingAndStoreInCache } = require("../../services/pull/services");

/**
 *
 * @param {gets called by fetchTrackingModel and returns a document} trackingAwb
 */
const getDocumentfromMongo = async (trackingAwb) => {
  let trackModelDocument;
  try {
    const { query, projection } = await PrepareTrackModelFilters(trackingAwb);
    const pullcollection = await commonTrackingInfoCol();
    trackModelDocument = await findandProject(query, projection, pullcollection);
    // eslint-disable-next-line no-underscore-dangle
    delete trackModelDocument._id;
  } catch (error) {
    console.log("some error at getDocumentfromMongo");
  }
  return trackModelDocument;
};

/**
 *
 * @param {fetches tracking Model from Mongo} trackingAwbs
 */
const fetchTrackingModel = async (trackingAwb) => {
  let trackingobj;
  try {
    trackingobj = getObject(trackingAwb) || [];
    if (!trackingobj?.track_model || trackingobj === []) {
      const getDocument = await getDocumentfromMongo(trackingAwb);
      // eslint-disable-next-line no-underscore-dangle
      delete getDocument._id;
      const trackArr = getDocument?.track_arr || [];
      const modifiedTrackArr = await prepareTrackDataForTrackingAndStoreInCache(
        trackArr,
        trackingAwb
      );
      getDocument.track_arr = modifiedTrackArr?.track_arr;
      const trackModel = {
        track_model: getDocument,
      };
      setObject(trackingAwb, trackModel);
      trackingobj = await getObject(trackingAwb);
    } else {
      return trackingobj;
    }
  } catch (error) {
    console.log("some error at prepareTrackingModel", error);
  }
  return trackingobj;
};

/**
 *
 * @param {*} trackingIds
 * @param {*} clientOrderIds
 * @param {*} authToken
 * @param {*} ip
 */
const fetchTrackingService = async (trackingIds, clientOrderIds, authToken = null, IP = null) => {
  console.log(trackingIds, clientOrderIds);
  try {
    const responseDict = {};
    const responseList = [];

    if (BLOCKED_IPS.includes(IP)) {
      responseDict.responseList = responseList;
      return responseDict;
    }

    if (authToken) {
      if (!ALLOWED_IPS.includes(IP)) {
        responseDict.responseList = responseList;
        return responseDict;
      }
    }

    if (trackingIds) {
      const trackingIdsList = trackingIds.split(",");
      console.log("trackingIdsList", trackingIdsList);
      if (trackingIdsList.length > 30) {
        throw new Error("cannot track more than 30 waybills at once");
      }
      for (let i = 0; i < trackingIdsList.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const cachedTrackData = (await getObject(trackingIdsList[i])) || {};
        console.log("tracking id going to be passed is ", trackingIdsList[i]);
        const trackModel = await fetchTrackingModel(trackingIdsList[i]);
        console.log("track model fetched from service-->", trackModel);
        const cachedTrackDataExist = !_.isEmpty(cachedTrackData?.track_arr);

        if (cachedTrackDataExist) {
          responseList.push(cachedTrackData?.track_arr);
        } else {
          // fetch from mongo against tracking id and then update on cache

          console.log("fetch from mongo against tracking id and then update on cache");

          try {
            // console.log("mongo result", res);

            const pullCollection = await commonTrackingInfoCol();

            // console.log("collection", pullCollection);

            const res = await findOneDocumentFromMongo(
              { tracking_id: trackingIdsList[i] },
              pullCollection
            );

            // const res = (await pullCollection.findOne({ tracking_id: trackingIdsList[i] })) || {};

            if (res) {
              const trackArr = await [...res.track_arr];
              const cachedAwbData = await prepareTrackDataForTrackingAndStoreInCache(
                trackArr,
                trackingIdsList[i]
              );

              // does above function return modified trackArray?

              responseList.push(cachedAwbData?.track_arr);
            }
          } catch (error) {
            logger.error("track/tracking api ", error);
          }
        }
      }
    } else if (clientOrderIds) {
      // client order ids will come in "client_order_id-PICK-user_pk"

      const clientOrderIdsList = clientOrderIds.split(",");
      if (clientOrderIdsList.length > 30) {
        throw new Error("cannot track more than 30 client order ids at once");
      }
      const pullCollection = await commonTrackingInfoCol();

      for (let i = 0; i < clientOrderIdsList.length; i += 1) {
        const clientOrderIdPattern = clientOrderIdsList[i];
        const clientOrderId = clientOrderIdPattern.split("-PICK-")[0];
        const userPK = Number(clientOrderIdPattern.split("-PICK-")[1]);
        console.log(clientOrderId);
        console.log(userPK);

        // console.log(clientOrderIdPattern);

        // check this pattern in redis, fetch key mapped against it else

        const cachedAwb = (await getString(clientOrderIdPattern)) || {};
        const ExistInCache = !_.isEmpty(cachedAwb);
        console.log("ExistInCache", ExistInCache);

        // if awb DOES NOT EXIST in cache

        if (!ExistInCache) {
          // query pull db and find tracking id

          //   console.log("collection", pullCollection);

          const res = await findOneDocumentFromMongo(
            {
              client_order_id: clientOrderId,
              user_pk: userPK,
            },
            pullCollection
          );

          //   console.log("MONGO RESULT", res);

          // if query document EXISTS

          if (!_.isEmpty(res)) {
            const trackArr = res.track_arr;
            const awb = res.tracking_id;
            const cachedAwbData = await prepareTrackDataForTrackingAndStoreInCache(trackArr, awb);
            await setObject(clientOrderIdPattern, awb);
            responseList.push(cachedAwbData?.track_arr);
          }

          // if query document does not EXIST idk what to do == PASS
        } else {
          //  fetch trackData

          const cachedTrackData = (await getObject(cachedAwb)) || {};
          if (!_.isEmpty(cachedTrackData?.track_arr)) {
            responseList.push(cachedTrackData?.track_arr);

            // console.log("responseList", responseList[0]);
          } else {
            // if trackData not exists

            const res = await findOneDocumentFromMongo(
              {
                client_order_id: clientOrderId,
                user_pk: userPK,
              },
              pullCollection
            );

            // if query document EXISTS

            if (!_.isEmpty(res)) {
              const trackArr = res.track_arr;
              const awb = res.tracking_id;
              const cachedAwbData = await prepareTrackDataForTrackingAndStoreInCache(trackArr, awb);
              console.log("cachedAwbData", cachedAwbData);
              await setObject(clientOrderIdPattern, awb);
              responseList.push(cachedAwbData?.track_arr);
            }
          }
        }
      }
    }
    console.log("FINAL RESPONSE LIST", responseList);
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
  fetchTrackingModel,
};
