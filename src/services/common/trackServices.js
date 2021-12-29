const { isEmpty, omit } = require("lodash");
const moment = require("moment");

const { findOneDocumentFromMongo, getObject, setObject } = require("../../utils");
const { sortStatusArray } = require("./helpers");

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
    let lastScanType = "";
    const newTrackArrayObj = trackArr.reduce((accum, trackItem) => {
      const newTrackObj = { ...accum };
      const scanType = trackItem.scan_type;
      const filteredTrackItem = omit(trackItem, "scan_type");
      filteredTrackItem.status_time = moment(filteredTrackItem.scan_datetime).format(
        "DD MMM YYYY, HH:mm"
      );
      filteredTrackItem.status_body = filteredTrackItem.scan_status;
      if (scanType === lastScanType) {
        newTrackObj[scanType].status_array.push(filteredTrackItem);
      } else {
        newTrackObj[scanType] = {
          status_name: scanType,
          status_array: [filteredTrackItem],
        };
      }
      lastScanType = scanType;
      return newTrackObj;
    }, {});
    let newTrackArray = Object.values(newTrackArrayObj);
    newTrackArray = newTrackArray.map((trackItem) => ({
      ...trackItem,
      status_array: sortStatusArray(trackItem.status_array),
    }));
    return newTrackArray;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * @param {prepares Filter for tracking and returns to tracking/services} trackingAwb
 */
const PrepareTrackModelFilters = async (trackingAwb) => {
  const query = {
    tracking_id: trackingAwb,
  };

  const projection = {
    _id: 0,
    audit: 0,
    user_id: 0,
    ops_profile: 0,
    user_pk: 0,
    updated_at: 0,
    ewaybill_number: 0,
    is_mps: 0,
    rto_waybill: 0,
    waybill_type: 0,
    pdd_date: 0,
    pickup_address_pk: 0,
  };

  return { query, projection };
};

/**
 *
 * @param {gets called by fetchTrackingModelAndUpdateCache and returns a document} trackingAwb
 */
const getTrackDocumentfromMongo = async (trackingAwb) => {
  let trackModelDocument;
  try {
    const { query, projection } = await PrepareTrackModelFilters(trackingAwb);
    trackModelDocument = await findOneDocumentFromMongo({
      queryObj: query,
      projectionObj: projection,
      collectionName: process.env.MONGO_DB_PROD_SERVER_COLLECTION_NAME,
    });
  } catch (error) {
    throw new Error(`failed to fetch document | AWB: ${trackingAwb} | message: ${error.message}`);
  }
  return trackModelDocument;
};

/**
 *
 * b∫ @param {fetches tracking Model from Mongo} trackingAwbs
 */
const fetchTrackingModelAndUpdateCache = async (trackingAwb) => {
  try {
    const trackingObj = (await getObject(trackingAwb)) || {};

    if (isEmpty(trackingObj) || isEmpty(trackingObj?.track_model)) {
      const trackDocument = await getTrackDocumentfromMongo(trackingAwb);

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

      await setObject(trackingAwb, trackingObj);

      return trackingObj;
    }
    return trackingObj;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  fetchTrackingModelAndUpdateCache,
  prepareTrackDataForTracking,
};