const moment = require("moment");

const { prepareTrackDataToUpdateInPullDb, storeDataInCache } = require("./services");
const commonTrackingInfoCol = require("./model");

/**
 *
 * @param {*} trackObj
 * @desc sending tracking data to pull mongodb
 * @returns success or error
 */
const updateTrackDataToPullMongo = async (trackObj) => {
  const result = prepareTrackDataToUpdateInPullDb(trackObj);
  if (!result.success) {
    throw new Error(result.err);
  }
  const updatedObj = {
    status: result.statusMap,
    track_arr: [result.eventObj],
    last_update_from: "kafka",
    edd_stamp: result.eddStamp ? new Date(result.eddStamp) : "",
    updated_at: new Date(moment().utc().format()),
  };
  try {
    const pullCollection = await commonTrackingInfoCol();

    const trackArr = updatedObj.track_arr;
    delete updatedObj.track_arr;

    // TODO:

    const response = await pullCollection.findOneAndUpdate(
      { tracking_id: trackObj.awb },
      {
        $set: updatedObj,
        $push: {
          track_arr: { $each: trackArr, $position: 0 },
        },
      },
      {
        upsert: true,
        returnNewDocument: true,
      }
    );
    await storeDataInCache(result);
    return response.value;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  updateTrackDataToPullMongo,
};
