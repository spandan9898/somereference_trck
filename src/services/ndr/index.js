const sendDataToEventBridge = require("../../connector/eventBridge");
const { checkIfTriggerNDREb, updateIsNDRinCache } = require("./helpers");
const { prepareTrackingEventDictForNDR } = require("./preparator");
const { prepareOtherDetailsFromTrackDataForNDR } = require("./preparator");

const { NDR_EVENT_BRIDGE_SOURCE, NDR_EVENT_BRIDGE_DETAIL_TYPE, NDR_EVENT_BRIDGE_BUS_NAME } =
  process.env;

/**
 * @param {*} trackData
 * @desc sending track data to ndr event bridge
 */
const sendDataToNdr = async (trackData) => {
  // deprecated
  const currentStatusType = trackData?.status?.current_status_type;
  const redisKey = trackData?.redis_key;

  if (!(await checkIfTriggerNDREb(currentStatusType, redisKey))) {
    return false;
  }

  const otherDetails = prepareOtherDetailsFromTrackDataForNDR(trackData);
  const trackingEvent = prepareTrackingEventDictForNDR(trackData);
  const payload = {
    tracking_event: trackingEvent,
    other_details: otherDetails,
  };
  sendDataToEventBridge({
    source: NDR_EVENT_BRIDGE_SOURCE,
    detailType: NDR_EVENT_BRIDGE_DETAIL_TYPE,
    data: payload,
    eventBusName: NDR_EVENT_BRIDGE_BUS_NAME,
  });
  updateIsNDRinCache(trackData.redis_key);
  return true;
};
module.exports = sendDataToNdr;
