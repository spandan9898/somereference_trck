const _ = require("lodash");

const { prepareAmazeData } = require("../../apps/amaze/services");
const { preparePickrrBluedartDict } = require("../../apps/bluedart/services");
const { prepareDelhiveryData } = require("../../apps/delhivery/services");
const { prepareEcommData } = require("../../apps/ecomm/services");
const { prepareEkartData } = require("../../apps/ekart/services");
const { prepareParceldoData } = require("../../apps/parceldo/services");
const { prepareShadowfaxData } = require("../../apps/shadowfax/services");
const { prepareUdaanData } = require("../../apps/udaan/services");
const { prepareXbsData } = require("../../apps/xpressbees/services");
const logger = require("../../../logger");

const { updateTrackDataToPullMongo } = require("../pull");
const { redisCheckAndReturnTrackData } = require("../pull/services");
const sendDataToNdr = require("../ndr");
const sendTrackDataToV1 = require("../v1");
const triggerWebhook = require("../webhook");
const updateStatusOnReport = require("../report");
const elkClient = require("../../connector/elk");
const { updatePrepareDict } = require("./helpers");

/**
 * @desc get prepare data function and call others tasks like, send data to pull, ndr, v1
 */
class KafkaMessageHandler {
  static getPrepareFunction(courierName) {
    const courierPrepareMapFunctions = {
      amaze: prepareAmazeData,
      bluedart: preparePickrrBluedartDict,
      delhivery: prepareDelhiveryData,
      ecomm: prepareEcommData,
      ekart: prepareEkartData,
      parceldo: prepareParceldoData,
      shadowfax: prepareShadowfaxData,
      udaan: prepareUdaanData,
      xpressbees: prepareXbsData,
    };
    return courierPrepareMapFunctions[courierName];
  }

  static async init(consumedPayload, courierName) {
    const preapreFunc = KafkaMessageHandler.getPrepareFunction(courierName);
    if (!preapreFunc) {
      throw new Error(`${courierName} is not a valid courier`);
    }
    try {
      const { message } = consumedPayload;

      const res = preapreFunc(Object.values(JSON.parse(message.value.toString()))[0]);

      if (!res.awb) return;
      const trackData = await redisCheckAndReturnTrackData(res);

      if (!trackData) {
        logger.info(`data already exists or not found in DB! ${res.awb}`);
        return;
      }

      const updatedTrackData = await updatePrepareDict(trackData);
      if (_.isEmpty(updatedTrackData)) {
        logger.error("Xpresbees reverse map not found", trackData);
        return;
      }

      const result = await updateTrackDataToPullMongo(updatedTrackData, logger);
      sendDataToNdr(result);
      sendTrackDataToV1(result);
      triggerWebhook(result, elkClient);
      updateStatusOnReport(result, logger, elkClient);
    } catch (error) {
      logger.error("KafkaMessageHandler", error);
    }
  }
}

module.exports = KafkaMessageHandler;
