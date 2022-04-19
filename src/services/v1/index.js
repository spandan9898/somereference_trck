const { prepareTrackDictForV1 } = require("./preparator");
const producerConnection = require("../../utils/producerConnection");
const { produceData } = require("../../utils/kafka");
const { TOPIC_NAME } = require("./constants");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");

/**
 * @param {*} trackData
 * @desc sending track data to v1 event bridge
 */
const sendTrackDataToV1 = async (trackData) => {
  const trackDict = prepareTrackDictForV1(trackData);

  const producerInstance = await producerConnection.connect(KAFKA_INSTANCE_CONFIG.PROD.name);

  const messages = [
    {
      key: trackDict.awb,
      value: JSON.stringify(trackDict),
    },
  ];

  await produceData({
    topic: TOPIC_NAME,
    producer: producerInstance,
    messages,
  });

  return true;
};

module.exports = sendTrackDataToV1;
