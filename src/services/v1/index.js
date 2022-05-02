const sendDataToEventBridge = require("../../connector/eventBridge");
const { prepareTrackDictForV1 } = require("./preparator");

const producerConnection = require("../../utils/producerConnection");
const { produceData } = require("../../utils/kafka");
const { TOPIC_NAME } = require("./constants");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

const { V1_EVENT_BRIDGE_SOURCE, V1_EVENT_BRIDGE_DETAIL_TYPE, V1_EVENT_BRIDGE_BUS_NAME } =
  process.env;

/**
 * @param {*} trackData
 * @desc sending track data to v1 event bridge
 */
const sendTrackDataToV1 = async (trackData) => {
  try {
    const trackDict = prepareTrackDictForV1(trackData);

    sendDataToEventBridge({
      source: V1_EVENT_BRIDGE_SOURCE,
      detailType: V1_EVENT_BRIDGE_DETAIL_TYPE,
      data: trackDict,
      eventBusName: V1_EVENT_BRIDGE_BUS_NAME,
    });

    const producerInstance = await producerConnection.connect(KAFKA_INSTANCE_CONFIG.PROD.name);
    const messages = [
      {
        key: trackDict.awb,
        value: JSON.stringify({
          request: trackDict,
        }),
      },
    ];

    await produceData({
      topic: TOPIC_NAME,
      producer: producerInstance,
      messages,
    });

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = sendTrackDataToV1;
