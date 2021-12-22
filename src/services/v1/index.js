const sendDataToEventBridge = require("../../connector/eventBridge");
const { prepareTrackDictForV1 } = require("./preparator");

const { TO_V1_EB_EVENT_BUS_SOURCE, TO_V1_EB_EVENT_BUS_DETAIL_TYPE, TO_V1_EB_EVENT_BUS_NAME } =
  process.env;

/**
 * @param {*} trackData
 * @desc sending track data to v1 event bridge
 */
const sendTrackDataToV1 = (trackData) => {
  const trackDict = prepareTrackDictForV1(trackData);

  sendDataToEventBridge({
    source: TO_V1_EB_EVENT_BUS_SOURCE,
    detailType: TO_V1_EB_EVENT_BUS_DETAIL_TYPE,
    data: trackDict,
    eventBusName: TO_V1_EB_EVENT_BUS_NAME,
  });
  return true;
};

module.exports = sendTrackDataToV1;
