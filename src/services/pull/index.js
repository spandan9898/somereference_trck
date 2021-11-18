const { prepareTrackDataToUpdateInPullDb } = require("./services");

/**
 *
 * @param {*} trackObj
 * @desc sending tracking data to pull mongodb
 * @returns success or error
 */
const updateTrackDataToPullMongo = (trackObj) => {
  const result = prepareTrackDataToUpdateInPullDb(trackObj);

  // TODO: update in DB

  console.log("result", result);
  return true;
};

module.exports = {
  updateTrackDataToPullMongo,
};
