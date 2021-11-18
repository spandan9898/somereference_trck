const _ = require("lodash");

const { BLOCK_NDR_STRINGS } = require("./constants");

const updateTrackDataToPullMongo = (trackObj) => {
  const trackData = _.cloneDeep(trackObj);
  const { scanType = "", trackInfo = "" } = trackData;

  if (scanType === "CC") {
    return {
      success: false,
      err: "scanType is CC",
    };
  }

  if (trackInfo.toLowerCase() in BLOCK_NDR_STRINGS && scanType === "NDR") {
    trackData.scan_type = "OT";
  }
  return true;
};

module.exports = {
  updateTrackDataToPullMongo,
};
