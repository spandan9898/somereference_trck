const axios = require("axios").default;

/**
 * checks if show client details flag is true
 * @param {*} authToken
 * @returns
 */
const checkShowClientDetails = async (authToken) => {
  if (!authToken) {
    return false;
  }
  const res = await axios.get(
    "https://async.pickrr.com/track/check/show/details/client/",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    },
    { timeout: 2 }
  );
  if ("is_success" in res.data) {
    return res.data.is_success;
  }
  return false;
};

module.exports = { checkShowClientDetails };
