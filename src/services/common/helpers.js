const { orderBy, isEmpty, get, cloneDeep } = require("lodash");

const { prepareAmazeData } = require("../../apps/amaze/services");
const { preparePickrrBluedartDict } = require("../../apps/bluedart/services");
const {
  prepareDelhiveryData,
  prepareDelhiveryPulledData,
} = require("../../apps/delhivery/services");
const { prepareEcommData } = require("../../apps/ecomm/services");
const { prepareEkartData } = require("../../apps/ekart/services");
const { prepareParceldoData } = require("../../apps/parceldo/services");
const {
  prepareShadowfaxData,
  preparePulledShadowfaxData,
} = require("../../apps/shadowfax/services");
const { prepareUdaanData } = require("../../apps/udaan/services");
const { prepareXbsData } = require("../../apps/xpressbees/services");
const { preparePidgeData } = require("../../apps/pidge/services");
const { prepareDtdcData } = require("../../apps/dtdc/services");

const logger = require("../../../logger");
const { DELHIVERY_REVERSE_MAPPER } = require("../../apps/delhivery/constant");
const { XBS_REVERSE_MAPPER } = require("../../apps/xpressbees/constant");
const { getObject } = require("../../utils");
const { PICKRR_STATUS_CODE_MAPPING } = require("../../utils/statusMapping");
const { SHADOWFAX_REVERSE_MAPPER } = require("../../apps/shadowfax/constant");

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
  if (courierUsed.includes("shadowfax")) {
    return SHADOWFAX_REVERSE_MAPPER;
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

    const { isRversed, courierUsed = "" } = await isRervseCheck(clonedPreparedDict);
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

    if (isEmpty(reversedMappedData) && courierUsed.includes("xpressbees")) {
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

/**
 *
 * @param {*} trackingObj -> tracking document
 * @desc check the order type based on three parameters
 * @returns -> order type
 */
const getOrderType = (trackingObj) => {
  try {
    const {
      is_reverse: isReverse,
      is_cod: isCod,
      info: { cod_amount: codAmount } = {},
    } = trackingObj || {};
    switch (true) {
      case isReverse:
        return "reverse";
      case isCod || codAmount:
        return "cod";
      default:
        return "prepaid";
    }
  } catch (error) {
    logger.error("getOrderType", error);
    return "NA";
  }
};

/**
 *
 * @param {*} courierName
 * @desc return mapped prepare funcion
 */
const getPrepareFunction = (courierName) => {
  const courierPrepareMapFunctions = {
    amaze: prepareAmazeData,
    bluedart: preparePickrrBluedartDict,
    delhivery: prepareDelhiveryData,
    delhivery_pull: prepareDelhiveryPulledData,
    ecomm: prepareEcommData,
    ekart: prepareEkartData,
    parceldo: prepareParceldoData,
    shadowfax: prepareShadowfaxData,
    shadowfax_pull: preparePulledShadowfaxData,
    udaan: prepareUdaanData,
    xpressbees: prepareXbsData,
    pidge: preparePidgeData,
    dtdc: prepareDtdcData,
  };
  return courierPrepareMapFunctions[courierName];
};
module.exports = {
  sortStatusArray,
  updatePrepareDict,
  getOrderType,
  getPrepareFunction,
};
