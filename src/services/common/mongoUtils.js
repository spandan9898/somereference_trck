const { isEmpty } = require("lodash");
const commonTrackingInfoCol = require("../pull/model");
const { getObject, setObject } = require("../../utils/redis");
const { findOneDocumentFromMongo } = require("../../utils/mongo_utils");
const { prepareTrackDataForTrackingAndStoreInCache } = require("../pull/services");

/**
 *
 * @param {prepares Filter for tracking and returns to tracking/services} trackingAwb
 */
const PrepareTrackModelFilters = async (trackingAwb) => {
  const query = {
    courier_tracking_id: trackingAwb,
  };

  const projection = {
    _id: 0,
    audit: 0,
    user_id: 0,
    ops_profile: 0,
    user_pk: 0,
    updated_at: 0,
    auth_token: 0,
    label_logo: 0,
    last_update_logo: 0,
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
 * @param {gets called by fetchTrackingModel and returns a document} trackingAwb
 */
const getDocumentfromMongo = async (trackingAwb) => {
  let trackModelDocument;
  try {
    const { query, projection } = await PrepareTrackModelFilters(trackingAwb);
    const pullcollection = await commonTrackingInfoCol();
    trackModelDocument = await findOneDocumentFromMongo(query, projection, pullcollection);
  } catch (error) {
    throw new Error("failed to fetch document", error);
  }
  return trackModelDocument;
};

/**
 *
 * b∫ @param {fetches tracking Model from Mongo} trackingAwbs
 */
const fetchTrackingModel = async (trackingAwb) => {
  let trackingobj;
  try {
    trackingobj = (await getObject(trackingAwb)) || {};
    if (isEmpty(trackingobj) || !trackingobj?.track_model) {
      const getDocument = await getDocumentfromMongo(trackingAwb);
      if (isEmpty(getDocument)) {
        throw new Error("failed to fetch document");
      }
      const trackArr = getDocument?.track_arr || [];
      const modifiedTrackArr = await prepareTrackDataForTrackingAndStoreInCache(
        trackArr,
        trackingAwb
      );
      if (isEmpty(modifiedTrackArr)) {
        throw new Error("track array is empty");
      }
      getDocument.track_arr = modifiedTrackArr;
      trackingobj.track_model = getDocument;
      await setObject(trackingAwb, trackingobj);
      return trackingobj;
    }
    return trackingobj;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  fetchTrackingModel,
};
