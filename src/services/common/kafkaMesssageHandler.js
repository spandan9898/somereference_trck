/* eslint-disable no-promise-executor-return */
const _ = require("lodash");

const { getPrepareFunction } = require("./helpers");

const { updateTrackDataToPullMongo } = require("../pull");
const { redisCheckAndReturnTrackData } = require("../pull/services");
const sendDataToNdr = require("../ndr");
const sendTrackDataToV1 = require("../v1");
const triggerWebhook = require("../webhook");
const updateStatusOnReport = require("../report");
const { preparePickrrConnectLambdaPayloadAndCall } = require("../../apps/pickrrConnect/services");

const { updatePrepareDict } = require("./helpers");
const {
  updateStatusELK,
  getTrackingIdProcessingCount,
  updateTrackingProcessingCount,
  commonTrackingDataProducer,
} = require("./services");
const { getElkClients } = require("../../utils");
const logger = require("../../../logger");
const { TrackingLogger } = require("../../../logger");
const { sendDataToElk } = require("./elk");

const trackingLogger = TrackingLogger("tracking/payloads");

/**
 * @desc get prepare data function and call others tasks like, send data to pull, ndr, v1
 */
class KafkaMessageHandler {
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
    const prepareFunc = getPrepareFunction(courierName);
    if (!prepareFunc) {
      return {
        error: `${courierName} is not a valid courier`,
      };
    }
    try {
      let res;
      let isFromPulled = false;
      const { prodElkClient, trackingElkClient } = getElkClients();

      try {
        const { message } = consumedPayload;
        const consumedData = JSON.parse(message.value.toString());

        if (consumedData?.event?.includes("pull")) {
          isFromPulled = true;
          res = prepareFunc(consumedData);
          if (courierName.includes("shadowfax_pull")) {
            sendDataToElk({
              body: {
                courier_name: courierName,
                payload: JSON.stringify(consumedData),
                time: new Date(),
              },
              elkClient: trackingElkClient,
              indexName: "track_courier_pull",
            });
          }
        } else {
          const consumedPayloadData = Object.values(consumedData)[0];
          trackingLogger.info(courierName, {
            data: consumedPayloadData,
          });
          res = prepareFunc(consumedPayloadData);
        }
      } catch (error) {
        res = prepareFunc(consumedPayload);
        isFromPulled = (_.get(consumedPayload, "event") || "").includes("pull");
      }

      if (!res.awb) return {};

      const processCount = await getTrackingIdProcessingCount({ awb: res.awb });

      await new Promise((done) => setTimeout(() => done(), processCount * 1000));

      await updateTrackingProcessingCount({ awb: res.awb });

      const trackData = await redisCheckAndReturnTrackData(res, isFromPulled);

      if (!trackData) {
        logger.info(`data already exists or not found in DB! ${res.awb}`);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");
        return {};
      }

      const updatedTrackData = await updatePrepareDict(trackData);
      if (_.isEmpty(updatedTrackData)) {
        logger.error("Xpresbees reverse map not found", trackData);
        updateTrackingProcessingCount({ awb: res.awb }, "remove");
        return {};
      }

      const result = await updateTrackDataToPullMongo({
        trackObj: updatedTrackData,
        logger,
        isFromPulled,
      });
      if (!result) {
        return {};
      }

      if (process.env.IS_OTHERS_CALL === "false") {
        return {};
      }

      sendDataToNdr(result);
      sendTrackDataToV1(result);
      triggerWebhook(result, trackingElkClient);
      updateStatusOnReport(result, logger, trackingElkClient);
      updateStatusELK(result, prodElkClient);
      preparePickrrConnectLambdaPayloadAndCall({
        trackingId: result.tracking_id,
        elkClient: trackingElkClient,
        result,
      });
      commonTrackingDataProducer(result);
      return {};
    } catch (error) {
      logger.error("KafkaMessageHandler", error);
      return {};
    }
  }
}

module.exports = KafkaMessageHandler;
