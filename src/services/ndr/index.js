const sendDataToEventBridge = require("../../connector/eventBridge");

const { NDR_EVENT_BRIDGE_SOURCE, NDR_EVENT_BRIDGE_DETAIL_TYPE, NDR_EVENT_BRIDGE_BUS_NAME } =
  process.env;

/**
 * @param {*} trackData
 * @desc sending track data to ndr event bridge
 */
const sendDataToNdr = (trackData) =>
  sendDataToEventBridge({
    source: NDR_EVENT_BRIDGE_SOURCE,
    detailType: NDR_EVENT_BRIDGE_DETAIL_TYPE,
    data: trackData,
    eventBusName: NDR_EVENT_BRIDGE_BUS_NAME,
  });

module.exports = sendDataToNdr;
