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

module.exports = {
  fetchTrackingModel,
};
