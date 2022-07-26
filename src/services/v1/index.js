const sendDataToEventBridge = require("../../connector/eventBridge");
const { prepareTrackDictForV1 } = require("./preparator");

const producerConnection = require("../../utils/producerConnection");
const { produceData } = require("../../utils/kafka");
const { TOPIC_NAME } = require("./constants");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

const {
  V1_EVENT_BRIDGE_SOURCE,
  V1_EVENT_BRIDGE_DETAIL_TYPE,
  V1_EVENT_BRIDGE_BUS_NAME,
  V1_NEW_EVENT_BRIDGE_DETAIL_TYPE,
} = process.env;

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
      "e9b152a54f0fdcaabfb756b89cd42ef8145594",
      "4f35ef1080f59698e68d87c87c1d4f51161604",
      "6fb453249b692a276fdc13dbee37539a134567",
      "4b7b5eb16221972bc132b429ebff9845789063",
      "39d7fe8174829ff6e05c6019757fc2c9123065",
      "7c1e98bd9c06ae0b75b4d2442c23d1ef193845",
      "64a61f6d3c302d2c478adc888aa20d58791587",
    ];
    const trackDict = prepareTrackDictForV1(trackData);

    // For Pickup Service

    if (
      ["OFP", "PPF", "OP", "OM", "OC"].includes(trackData?.status?.current_status_type) ||
      (trackData?.status?.current_status_body || "").toLowerCase() === "pickup_cancelled"
    ) {
      sendDataToEventBridge({
        source: V1_EVENT_BRIDGE_SOURCE,
        detailType: V1_NEW_EVENT_BRIDGE_DETAIL_TYPE,
        data: trackDict,
        eventBusName: V1_EVENT_BRIDGE_BUS_NAME,
      });
      return {};
    }
    sendDataToEventBridge({
      source: V1_EVENT_BRIDGE_SOURCE,
      detailType: V1_NEW_EVENT_BRIDGE_DETAIL_TYPE,
      data: trackDict,
      eventBusName: V1_EVENT_BRIDGE_BUS_NAME,
    });

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
