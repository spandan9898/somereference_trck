const { isEmpty, omit, get, last } = require("lodash");
const moment = require("moment");

const { findOneDocumentFromMongo, getObject, storeInCache } = require("../../utils");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { sortStatusArray } = require("./helpers");
const { IS_FETCH_FROM_DB } = require("../../utils/constants");
const logger = require("../../../logger");

/**
 *
 * @param {*} trackArr
 * @desc prepare the track array, like the below format
 * [
    {
      status_name: "",
      status_array: [],
    },
  ]
 */
const prepareTrackDataForTracking = (trackArr) => {
  if (isEmpty(trackArr)) {
    return [];
  }

  try {
    let updatedTrackArray = [];

    trackArr.forEach((trackItem) => {
      const scanType = trackItem.scan_type;
      const lastItem = last(updatedTrackArray);
      const filteredTrackItem = omit(trackItem, "scan_type");
      filteredTrackItem.status_time = moment(filteredTrackItem.scan_datetime)
        .add(330, "m")
        .format("DD MMM YYYY, HH:mm");
      filteredTrackItem.status_body = filteredTrackItem.scan_status;
      filteredTrackItem.status_location = filteredTrackItem.scan_location;
      filteredTrackItem.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType];

      if (!lastItem) {
        updatedTrackArray.push({
          status_name: scanType,
          status_array: [filteredTrackItem],
        });
      } else {
        const lastItemScanType = get(lastItem, "status_name");
        if (scanType !== lastItemScanType) {
          updatedTrackArray.push({
            status_name: scanType,
            status_array: [filteredTrackItem],
          });
        } else {
          lastItem.status_array.push(filteredTrackItem);
        }
      }
    });
    updatedTrackArray = updatedTrackArray.map((trackItem) => ({
      ...trackItem,
      status_array: sortStatusArray(trackItem.status_array),
    }));

    return updatedTrackArray;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * @param {prepares Filter for tracking and returns to tracking/services} trackingAwb
 */
const PrepareTrackModelFilters = async (trackingAwb, couriers = []) => {
  let query = {
    tracking_id: trackingAwb,
  };
  if (couriers.length>0){
    query.courier_parent_name = {"$in": couriers};
  }

  const projection = {
    _id: 0,
    audit: 0,
    pickup_address_pk: 0,
    mandatory_status_map: 0,
    kam: 0,
    sales_poc: 0,
    wh_id: 0,
  };

  return { query, projection };
};

/**
 *
 * @param {gets called by fetchTrackingModelAndUpdateCache and returns a document} trackingAwb
 */
const getTrackDocumentfromMongo = async (trackingAwb, couriers=[]) => {
  let trackModelDocument;
  try {
    couriers = couriers instanceof Array ? couriers : [];
    const { query, projection } = await PrepareTrackModelFilters(trackingAwb, couriers);
    trackModelDocument = await findOneDocumentFromMongo({
      queryObj: query,
      projectionObj: projection,
      collectionName: process.env.MONGO_DB_PROD_SERVER_COLLECTION_NAME,
    });
  } catch (error) {
    throw new Error(`failed to fetch document | AWB: ${trackingAwb} | couriers: ${couriers.toString()} | message: ${error.message}`);
  }
  return trackModelDocument;
};

/**
 *
 * b∫ @param {fetches tracking Model from Mongo} trackingAwbs
 */
const fetchTrackingModelAndUpdateCache = async (trackingAwb, couriers = [], fromTrackingApi = false) => {
  try {
    couriers = couriers instanceof Array ? couriers : [];
    let courier = "";
    if (couriers.length > 0) {
      courier = couriers[0];
    }
    const redisKey = `${trackingAwb}_${courier}`;
    let trackingObj = {};
    if (fromTrackingApi){
      if (process.env.USE_REDIS_FOR_TRACKING === "true"){
        trackingObj = (await getObject(redisKey)) || {};
      }
    }else{
      trackingObj = (await getObject(redisKey)) || {};
    }
    let isFetchFromDB = fromTrackingApi;
    if (fromTrackingApi) {
      const updatedAt = trackingObj?.track_model?.updated_at;
      isFetchFromDB = !updatedAt || moment().diff(moment(updatedAt), "minutes") > 60;
    }

    if (
      IS_FETCH_FROM_DB ||
      isEmpty(trackingObj) ||
      isEmpty(trackingObj?.track_model) ||
      isFetchFromDB
    ) {
      const trackDocument = await getTrackDocumentfromMongo(trackingAwb, couriers);

      if (isEmpty(trackDocument)) {
        throw new Error(`failed to fetch document - ${trackingAwb}`);
      }

      const trackArr = trackDocument?.track_arr || [];

      const modifiedTrackArr = prepareTrackDataForTracking(trackArr);

      if (isEmpty(modifiedTrackArr)) {
        throw new Error("track array is empty");
      }

      trackDocument.track_arr = modifiedTrackArr;
      trackingObj.track_model = trackDocument;

      const expiryTime = fromTrackingApi ? 2 * 60 * 60 : undefined;
      if (fromTrackingApi) {
        if (process.env.USE_REDIS_FOR_TRACKING === "true") {
          await storeInCache(redisKey, trackingObj, expiryTime);
        }
      }else{
        await storeInCache(redisKey, trackingObj, expiryTime);
      }
      return trackingObj;
    }
    return trackingObj;
  } catch (error) {
    logger.info(`fetchTrackingModelAndUpdateCache: ${error.message}`);

    return false;
  }
};

module.exports = {
  fetchTrackingModelAndUpdateCache,
  prepareTrackDataForTracking,
  getTrackDocumentfromMongo,
};
