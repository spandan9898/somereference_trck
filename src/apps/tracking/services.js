const { isEmpty } = require("lodash");
const { PrepareTrackModelFilters } = require("./preparator");
const commonTrackingInfoCol = require("../../services/pull/model");
const { getObject, setObject } = require("../../utils/redis");
const { findandProject } = require("../../utils/mongo_utils");
const { prepareTrackDataForTrackingAndStoreInCache } = require("../../services/pull/services");

/**
 *
 * @param {gets called by fetchTrackingModel and returns a document} trackingAwb
 */
const getDocumentfromMongo = async (trackingAwb) => {
  console.log("tracking awb", trackingAwb);
  let trackModelDocument;
  try {
    const { query, projection } = await PrepareTrackModelFilters(trackingAwb);
    console.log("query is -->", query, projection);
    const pullcollection = await commonTrackingInfoCol();
    console.log("pull collection is", pullcollection);
    trackModelDocument = await findandProject(query, projection, pullcollection);
  } catch (error) {
    throw new Error("failed to fetch document", error);
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
    trackingobj = (await getObject(trackingAwb)) || {};
    console.log("tracking obj -->", trackingobj);
    if (isEmpty(trackingobj) || !trackingobj?.track_model) {
      console.log("tracking object", trackingobj);
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
      console.log("new track model", trackingobj);
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
