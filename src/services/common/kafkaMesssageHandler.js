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
const initELK = require("../../connector/elkConnection");

const { updateTrackDataToPullMongo } = require("../pull");
const { redisCheckAndReturnTrackData } = require("../pull/services");
const sendDataToNdr = require("../ndr");
const sendTrackDataToV1 = require("../v1");
const triggerWebhook = require("../webhook");
const updateStatusOnReport = require("../report");
const { updatePrepareDict } = require("./helpers");
const { ELK_INSTANCE_NAMES } = require("../../utils/constants");
const { updateStatusELK } = require("./services");

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

  static getElkClients() {
    let prodElkClient = "";
    let stagingElkClient = "";
    try {
      prodElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.PROD.name);
      stagingElkClient = initELK.getElkInstance(ELK_INSTANCE_NAMES.STAGING.name);

      return {
        prodElkClient,
        stagingElkClient,
      };
    } catch (error) {
      logger.error("getElkClients", error);
      return {
        prodElkClient,
        stagingElkClient,
      };
    }
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

      const { prodElkClient } = KafkaMessageHandler.getElkClients();

      const result = await updateTrackDataToPullMongo(updatedTrackData, logger);
      if (!result) {
        return;
      }

      sendDataToNdr(result);
      sendTrackDataToV1(result);
      triggerWebhook(result, prodElkClient);
      updateStatusOnReport(result, logger, prodElkClient);
      updateStatusELK(result, prodElkClient);
    } catch (error) {
      logger.error("KafkaMessageHandler", error);
    }
  }
}

module.exports = KafkaMessageHandler;
