const moment = require("moment");
const _ = require("lodash");

const { storeDataInCache, updateCacheTrackArray, softCancellationCheck } = require("./services");
const { prepareTrackDataToUpdateInPullDb } = require("./preparator");
const commonTrackingInfoCol = require("./model");
const { updateTrackingProcessingCount } = require("../common/services");
const { EddPrepareHelper } = require("../common/eddHelpers");

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
  const latestCourierEDD = result?.eddStamp;
  let pickupDateTime = result?.eventObj?.pickup_datetime;
  const statusType = result?.statusMap["status.current_status_type"];

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
    const zone = res?.billing_zone;
    const eddStampInDb = res?.edd_stamp;

    if (!res) {
      sortedTrackArray = [...trackArr];
    } else {
      let updatedTrackArray = [...trackArr, ...res.track_arr];
      updatedTrackArray = _.orderBy(updatedTrackArray, ["scan_datetime"], ["desc"]);
      sortedTrackArray = updatedTrackArray;
    }
    updatedObj.track_arr = sortedTrackArray;
    updatedObj.latest_courier_edd = latestCourierEDD;

    if (softCancellationCheck(sortedTrackArray, trackObj)) {
      return false;
    }
    const firstTrackObjOfTrackArr = sortedTrackArray[0];
    const promiseEdd = res?.promise_edd;
    if (!promiseEdd && latestCourierEDD) {
      updatedObj.promise_edd = latestCourierEDD;
    }

    // Pickrr EDD is fetch over here

    try {
      if (!result.eventObj?.pickup_datetime) {
        pickupDateTime = res?.pickup_datetime;
      }
      const instance = new EddPrepareHelper({ latestCourierEDD, pickupDateTime, eddStampInDb });

      const pickrrEDD = await instance.callPickrrEDDEventFunc({
        zone,
        latestCourierEDD,
        pickupDateTime,
        eddStampInDb,
        statusType,
      });
      if (moment(result.eventObj?.pickup_datetime).isValid()) {
        updatedObj.pickup_datetime = result.eventObj.pickup_datetime;
      }
      updatedObj.edd_stamp = pickrrEDD || null;
    } catch (error) {
      logger.error(error.message);
    }
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
    await updateTrackingProcessingCount(trackObj, "remove");
    updateCacheTrackArray({
      currentTrackObj: trackArr[0],
      trackArray: response.value.track_arr,
      awb: result.awb,
      trackingDocument: response.value,
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
