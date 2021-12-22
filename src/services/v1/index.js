const sendDataToEventBridge = require("../../connector/eventBridge");
const { prepareTrackDictForV1 } = require("./preparator");

const { V1_EVENT_BRIDGE_SOURCE, V1_EVENT_BRIDGE_DETAIL_TYPE, V1_EVENT_BRIDGE_BUS_NAME } =
  process.env;

/**
 * @param {*} trackData
 * @desc sending track data to v1 event bridge
 */
const sendTrackDataToV1 = (trackData) => {
  const trackDict = prepareTrackDictForV1(trackData);

  sendDataToEventBridge({
    source: V1_EVENT_BRIDGE_SOURCE,
    detailType: V1_EVENT_BRIDGE_DETAIL_TYPE,
    data: trackDict,
    eventBusName: V1_EVENT_BRIDGE_BUS_NAME,
  });
  return true;
};

module.exports = sendTrackDataToV1;
