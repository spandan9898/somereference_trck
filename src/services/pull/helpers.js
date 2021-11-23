/**
 *
 * returning event dict from status obj,
 * which is coming from prepared data (pickrr object)
 */
const mapStatusToEvent = (statusObj) => {
  const eventObj = {
    scan_datetime: statusObj.current_status_time || "",
    scan_type: statusObj.current_status_type || "",
    scan_status: statusObj.current_status_body || "",
    scan_location: statusObj.current_status_location || "",
  };

  return eventObj;
};

module.exports = {
  mapStatusToEvent,
};
