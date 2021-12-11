const moment = require("moment");
const _ = require("lodash");

const {
  prepareTrackDataToUpdateInPullDb,
  storeDataInCache,
  prepareTrackDataForTrackingAndStoreInCache,
} = require("./services");
const commonTrackingInfoCol = require("./model");

/**
 *
 * @param {*} trackObj
 * @desc sending tracking data to pull mongodb
 * @returns success or error
 */
const updateTrackDataToPullMongo = async (trackObj, logger) => {
  const result = prepareTrackDataToUpdateInPullDb(trackObj);

  if (!result.success) {
    throw new Error(result.err);
  }
  const updatedObj = {
    ...result.statusMap,
    track_arr: [result.eventObj],
    last_update_from: "kafka",
    edd_stamp: result.eddStamp ? new Date(result.eddStamp) : "",
    updated_at: new Date(moment().utc().format()),
  };
  try {
    const pullCollection = await commonTrackingInfoCol();
    const trackArr = updatedObj.track_arr;
    const auditObj = {
      from: "kafka_consumer",
      current_status_type: updatedObj["status.current_status_type"],
      current_status_time: updatedObj["status.current_status_time"],
      pulled_at: new Date(),
    };

    delete updatedObj.track_arr;

    let sortedTrackArray;

    const res = await pullCollection.findOne({ tracking_id: result.awb });

    if (!res) {
      sortedTrackArray = [...trackArr];
    } else {
      let updatedTrackArray = [...trackArr, ...res.track_arr];
      updatedTrackArray = _.orderBy(updatedTrackArray, ["scan_datetime"], ["desc"]);
      sortedTrackArray = updatedTrackArray;
    }
    updatedObj.track_arr = sortedTrackArray;

    const response = await pullCollection.findOneAndUpdate(
      { tracking_id: trackObj.awb },
      {
        $set: updatedObj,
        $push: {
          audit: auditObj,
        },
      },
      {
        upsert: true,
        returnNewDocument: true,
        returnDocument: "after",
      }
    );
    await storeDataInCache(result);
    prepareTrackDataForTrackingAndStoreInCache(trackArr, result.awb);
    return response.value;
  } catch (error) {
    logger.error("updateTrackDataToPullMongo Error", error);
    return false;
  }
};

module.exports = {
  updateTrackDataToPullMongo,
};
