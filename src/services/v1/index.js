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
    const authTokens = [
      "5a5e8b5ff28c89a0ebb352e5370e60e9805975",
      "b766873b44921425344e1b929a5337da136087",
      "a1c9aa149093d7198572aaac6c1e3837164229",
    ];

    if (
      ["OFP", "PPF", "OP", "OM", "OC"].includes(trackData?.status?.current_status_type) ||
      (trackData?.status?.current_status_body || "").toLowerCase() === "pickup_cancelled"
    ) {
      return false;
    }
    const trackDict = prepareTrackDictForV1(trackData);

    if (!authTokens.includes(trackData.auth_token)) {
      sendDataToEventBridge({
        source: V1_EVENT_BRIDGE_SOURCE,
        detailType: V1_EVENT_BRIDGE_DETAIL_TYPE,
        data: trackDict,
        eventBusName: V1_EVENT_BRIDGE_BUS_NAME,
      });
    }

    if (!authTokens.includes(trackData.auth_token)) {
      return false;
    }

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
