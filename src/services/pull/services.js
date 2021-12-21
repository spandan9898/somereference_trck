const _ = require("lodash");
const moment = require("moment");
const logger = require("../../../logger");

const { setObject, getObject, checkAwbInCache } = require("../../utils");
const { BLOCK_NDR_STRINGS } = require("./constants");
const { mapStatusToEvent } = require("./helpers");

/**
 * sorring status array desc -> The last scan time will be in the top
 */
const sortStatusArray = (statusArray) =>
  _.orderBy(statusArray, (obj) => new Date(obj.scan_datetime), ["desc"]);

/**
 * Preparing track array data for track/tracking
 */
const prepareTrackDataForTrackingAndStoreInCache = async (trackArr, awb) => {
  try {
    const cachedAwbData = (await getObject(awb)) || {};
    const trackData = cachedAwbData?.track_arr || [];
    let newTrackArr;

    if (_.isEmpty(trackData)) {
      newTrackArr = trackArr.reduce((trackArray, trackObj) => {
        const scanType = trackObj.scan_type;
        const newObj = {
          status_name: scanType,
          status_array: sortStatusArray([_.omit(trackObj, "scan_type")]),
        };
        return [newObj, ...trackArray];
      }, []);
    } else {
      const latestTrackObj = trackArr[0];
      const cachedLastTrackObj = trackData[0];
      if (_.get(latestTrackObj, "scan_type") === _.get(cachedLastTrackObj, "status_name")) {
        cachedLastTrackObj.status_array.push(_.omit(latestTrackObj, "scan_type"));
        cachedLastTrackObj.status_array = sortStatusArray(cachedLastTrackObj.status_array);
      } else {
        trackData.unshift({
          status_name: latestTrackObj.scan_type,
          status_array: sortStatusArray([_.omit(latestTrackObj, "scan_type")]),
        });
      }
      newTrackArr = _.clone(trackData);
    }
    cachedAwbData.track_arr = newTrackArr;
    await setObject(awb, cachedAwbData);
    return cachedAwbData;
  } catch (error) {
    logger.error("prepareTrackDataForTrackingAndStoreInCache", error);
    return error;
  }
};

/** *
 * @param preparedTrackData -> 
 * {
    awb: '75456956632',
    scan_type: 'PPF',
    scan_datetime: '17-06-2019 18:06',
    track_info: 'PICKUP CANCELLED; QUALITY CHECK FAILED',
    track_location: 'MANALI SERVICE CENTRE',
    received_by: '',
    pickup_datetime: '17-06-2019 08:00',
    EDD: '30-12-2021',
    pickrr_status: 'Pickup Failed',
    pickrr_sub_status_code: 'REJ',
    courier_status_code: '016-S'
  }
 * 
  * @desc check in cache and if exists then return false otherwise return tracking object, which will be move forward
 * @returns {string}
 */
const redisCheckAndReturnTrackData = async (preparedTrackData) => {
  const trackObj = preparedTrackData;

  const isExists = await checkAwbInCache(trackObj, prepareTrackDataForTrackingAndStoreInCache);
  if (isExists) {
    return false;
  }
  return trackObj;
};

/**
 *@param {*} trackObj : same as above example
 * preparing track data for pull db update
 */
const prepareTrackDataToUpdateInPullDb = (trackObj) => {
  const trackData = _.cloneDeep(trackObj);
  const {
    scan_type: scanType = "",
    track_info: trackInfo = "",
    scan_datetime: scanDatetime = "",
    track_location: trackLocation = "",
    EDD: edd = "",
    pickrr_sub_status_code: pickrrSubStatusCode = "",
    courier_status_code: courierStatusCode = "",
    received_by: receivedBy = "",
    pickup_datetime: pickupDatetime = "",
  } = trackData;

  if (scanType === "CC") {
    return {
      success: false,
      err: "scanType is CC",
    };
  }

  if (trackInfo.toLowerCase() in BLOCK_NDR_STRINGS && scanType === "NDR") {
    trackData.scan_type = "OT";
  }
  const currentStatusTime = scanDatetime;

  // currentStatusTime = currentStatusTime.isValid() ? currentStatusTime.format() : null;

  const statusMap = {
    "status.current_status_time": moment(currentStatusTime).subtract(330, "m").toDate(),
    "status.current_status_type": scanType,
    "status.current_status_body": trackInfo,
    "status.current_status_location": trackLocation,
    "status.pickrr_sub_status_code": pickrrSubStatusCode,
    "status.courier_status_code": courierStatusCode,
    "status.current_status_val": null,
    "status.received_by": receivedBy,
  };

  const eventObj = mapStatusToEvent(statusMap);
  eventObj.pickrr_sub_status_code = trackData.pickrr_sub_status_code;
  eventObj.courier_status_code = trackData.courier_status_code;
  eventObj.update_source = "kafka";
  eventObj.update_time = moment().toDate();
  eventObj.system_updated_at = moment().toDate();
  if (pickupDatetime) {
    eventObj.pickup_datetime = moment(pickupDatetime).subtract(330, "m").toDate();
  }

  let eddStamp;
  if (edd) {
    const eddDate = moment(edd);
    eddStamp = eddDate.isValid() ? eddDate.subtract(330, "m").toDate() : edd;
    try {
      const isBefore = moment(eddStamp).isBefore(moment(), "year");
      if (isBefore) {
        eddStamp = "";
      }
    } catch (error) {
      logger.error("Edd Date Issue", error);
      eddStamp = "";
    }
  }
  return {
    success: true,
    eddStamp,
    eventObj,
    statusMap,
    awb: trackData.awb,
  };
};

/**
 *
 * @param {*} result: prepared data
 * @desc store data in cache with expected format
 */
const storeDataInCache = async (result) => {
  const { eventObj, awb } = result;
  const { scan_datetime: scanDatetime } = eventObj || {};

  const redisKey = `${eventObj.scan_type}_${moment(scanDatetime).unix()}`;
  const newRedisPayload = {
    [redisKey]: true,
  };
  const dt = (await getObject(awb)) || {};
  const oldData = { ...dt, ...newRedisPayload };
  await setObject(awb, oldData);
};

module.exports = {
  redisCheckAndReturnTrackData,
  prepareTrackDataToUpdateInPullDb,
  storeDataInCache,
  prepareTrackDataForTrackingAndStoreInCache,
};
