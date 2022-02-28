/* eslint-disable no-promise-executor-return */
const _ = require("lodash");

const { prepareAmazeData } = require("../../apps/amaze/services");
const { preparePickrrBluedartDict } = require("../../apps/bluedart/services");
const { prepareDelhiveryData } = require("../../apps/delhivery/services");
const { prepareEcommData } = require("../../apps/ecomm/services");
const { prepareEkartData } = require("../../apps/ekart/services");
const { prepareParceldoData } = require("../../apps/parceldo/services");
const {
  prepareShadowfaxData,
  preparePulledShadowfaxData,
} = require("../../apps/shadowfax/services");
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
const {
  updateStatusELK,
  getTrackingIdProcessingCount,
  updateTrackingProcessingCount,
} = require("./services");

// const { preparePickrrConnectLambdaPayloadAndCall } = require("../../apps/pickrrConnect/services");

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
      shadowfax_pull: preparePulledShadowfaxData,
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

  /**
   *
   * @desc about processCount ->
   * 1. first fetch "processCount" from cache's awb object
   * 2. use default value 0
   * 3. Multiply this value with 1000
   * 4. then delay accordingly
   * 5. after DB update decrease "processCount" value by 1, handle negative case
   */
  static async init(consumedPayload, courierName) {
    const prepareFunc = KafkaMessageHandler.getPrepareFunction(courierName);
    if (!prepareFunc) {
      throw new Error(`${courierName} is not a valid courier`);
    }
    try {
      let res;
      let isFromPulled = false;
      try {
        const { message } = consumedPayload;
        res = prepareFunc(Object.values(JSON.parse(message.value.toString()))[0]);
      } catch {
        res = prepareFunc(consumedPayload);
        isFromPulled = (_.get(consumedPayload, "event") || "").includes("pull");
      }

      if (!res.awb) return;

      const processCount = await getTrackingIdProcessingCount({ awb: res.awb });

      await new Promise((done) => setTimeout(() => done(), processCount * 1000));

      await updateTrackingProcessingCount({ awb: res.awb });

      const trackData = await redisCheckAndReturnTrackData(res, isFromPulled);

      if (!trackData) {
        logger.info(`data already exists or not found in DB! ${res.awb}`);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");
        return;
      }

      const updatedTrackData = await updatePrepareDict(trackData);
      if (_.isEmpty(updatedTrackData)) {
        logger.error("Xpresbees reverse map not found", trackData);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");
        return;
      }

      const { prodElkClient } = KafkaMessageHandler.getElkClients();

      const result = await updateTrackDataToPullMongo({
        trackObj: updatedTrackData,
        logger,
        isFromPulled,
      });
      if (!result) {
        return;
      }

      if (process.env.IS_OTHERS_CALL === "false") {
        return;
      }

      sendDataToNdr(result);
      sendTrackDataToV1(result);
      triggerWebhook(result, prodElkClient);
      updateStatusOnReport(result, logger, prodElkClient);
      updateStatusELK(result, prodElkClient);

      // preparePickrrConnectLambdaPayloadAndCall({
      //   trackingId: result.tracking_id,
      //   elkClient: prodElkClient,
      // });
    } catch (error) {
      logger.error("KafkaMessageHandler", error);
    }
  }
}

module.exports = KafkaMessageHandler;
