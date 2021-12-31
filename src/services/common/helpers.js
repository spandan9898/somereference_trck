const { orderBy, isEmpty, get, cloneDeep } = require("lodash");

const logger = require("../../../logger");
const { DELHIVERY_REVERSE_MAPPER } = require("../../apps/delhivery/constant");
const { XBS_REVERSE_MAPPER } = require("../../apps/xpressbees/constant");
const { getObject } = require("../../utils");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");

/**
 * sorring status array desc -> The last scan time will be in the top
 */
const sortStatusArray = (statusArray) =>
  orderBy(statusArray, (obj) => new Date(obj.scan_datetime), ["desc"]);

/**
 *
 * @param {*} courierUsed
 * @desc return reverse mapper
 * @returns
 */
const getCourierReverseStatusMap = (courierUsed) => {
  if (courierUsed.includes("delhivery")) {
    return DELHIVERY_REVERSE_MAPPER;
  }
  if (courierUsed.includes("xpressbees")) {
    return XBS_REVERSE_MAPPER;
  }
  return null;
};

/**
 *
 * @param {*} trackData
 */
const isRervseCheck = async (preparedDict) => {
  const { awb } = preparedDict;

  const cacheData = await getObject(awb);
  const { track_model: trackModel } = cacheData || {};
  const isRversed = get(trackModel, "is_reverse");
  const courierUsed = get(trackModel, "courier_used");
  return { isRversed, courierUsed };
};

/**
 *
 * @param {*} preparedDict
 * @desc update prepared dict if is_reversed is true
 * @returns
 */
const updatePrepareDict = async (preparedDict) => {
  try {
    const clonedPreparedDict = cloneDeep(preparedDict);

    const { isRversed, courierUsed } = await isRervseCheck(clonedPreparedDict);
    if (!isRversed) {
      return clonedPreparedDict;
    }
    const reverseMappings = getCourierReverseStatusMap(courierUsed);
    if (!reverseMappings) {
      return clonedPreparedDict;
    }
    let { courier_status_code: courierStatusCode } = clonedPreparedDict;
    courierStatusCode = courierStatusCode.toLowerCase();

    const reversedMappedData = reverseMappings[courierStatusCode];

    if (isEmpty(reversedMappedData) && courierUsed === "xpressbees") {
      return {};
    }

    if (isEmpty(reversedMappedData)) {
      return clonedPreparedDict;
    }
    const { scan_type: scanType, pickrr_sub_status_code: pickrrSubStatusCode } = reversedMappedData;

    clonedPreparedDict.scan_type = scanType;
    clonedPreparedDict.pickrr_sub_status_code = pickrrSubStatusCode;
    clonedPreparedDict.pickrr_status = PICKRR_STATUS_CODE_MAPPING[scanType];

    return clonedPreparedDict;
  } catch (error) {
    logger.error("updatePrepareDict", error);
    return preparedDict;
  }
};

module.exports = {
  sortStatusArray,
  updatePrepareDict,
};
