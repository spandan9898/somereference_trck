const moment = require("moment");
const _ = require("lodash");

const { storeDataInCache, updateCacheTrackArray } = require("./services");
const { prepareTrackDataToUpdateInPullDb } = require("./preparator");
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
    edd_stamp: result.eddStamp ? result.eddStamp : "",
    updated_at: moment().toDate(),
  };
  try {
    const pullCollection = await commonTrackingInfoCol();
    const trackArr = updatedObj.track_arr;
    const auditObj = {
      from: "kafka_consumer",
      current_status_type: updatedObj["status.current_status_type"],
      current_status_time: updatedObj["status.current_status_time"],
      pulled_at: moment().toDate(),
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

    const firstTrackObjOfTrackArr = sortedTrackArray[0];

    updatedObj["status.current_status_type"] = firstTrackObjOfTrackArr.scan_type;
    updatedObj["status.courier_status_code"] = firstTrackObjOfTrackArr.courier_status_code;
    updatedObj["status.current_status_body"] = firstTrackObjOfTrackArr.scan_status;
    updatedObj["status.current_status_location"] = firstTrackObjOfTrackArr.scan_location;
    updatedObj["status.current_status_time"] = firstTrackObjOfTrackArr.scan_datetime;
    updatedObj["status.pickrr_sub_status_code"] = firstTrackObjOfTrackArr.pickrr_sub_status_code;

    const response = await pullCollection.findOneAndUpdate(
      { tracking_id: trackObj.awb },
      {
        $set: updatedObj,
        $push: {
          audit: auditObj,
        },
      },
      {
        returnNewDocument: true,
        returnDocument: "after",
        upsert: false,
      }
    );
    await storeDataInCache(result);
    updateCacheTrackArray({
      currentTrackObj: trackArr[0],
      trackArray: trackArr,
      awb: result.awb,
    });
    return response.value;
  } catch (error) {
    logger.error("updateTrackDataToPullMongo Error", error);
    return false;
  }
};

module.exports = {
  updateTrackDataToPullMongo,
};
