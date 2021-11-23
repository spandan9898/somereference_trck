const moment = require("moment");

const { prepareTrackDataToUpdateInPullDb } = require("./services");
const commonTrackingInfoCol = require("./model");
const { setObject } = require("../../utils/redis");

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
    edd_stamp: result.eddStamp,
    updated_at: moment().format(),
  };

  try {
    const pullCollection = await commonTrackingInfoCol();

    const trackArr = updatedObj.track_arr;
    delete updatedObj.track_arr;

    const res = await pullCollection.updateOne(
      { tracking_id: trackObj.awb },
      {
        $set: updatedObj,
        $push: {
          track_arr: { $each: trackArr, $position: 0 },
        },
      },
      {
        upsert: true,
      }
    );
    setObject(trackObj.awb, trackObj);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  updateTrackDataToPullMongo,
};
