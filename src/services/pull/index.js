const { BLOCK_NDR_STRINGS } = require("./constants");

const updateTrackDataToPullMongo = (trackData) => {
  const { scan_type = "", track_info = "", scan_datetime = "" } = trackData;

  if (scan_type === "CC") {
    return {
      success: false,
      err: "scan_type is CC",
    };
  }

  if (track_info.toLowerCase() in BLOCK_NDR_STRINGS && scan_type === "NDR") {
    trackData.scan_type = "OT";
  }
};
