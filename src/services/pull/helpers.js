const mapStatusToEvent = (statusDict) => {
  const eventDict = {};

  eventDict["scan_datetime"] = statusDict.get("current_status_time", "");
  eventDict["scan_type"] = statusDict.get("current_status_type", "");
  eventDict["scan_status"] = statusDict.get("current_status_body", "");
  eventDict["scan_location"] = statusDict.get("current_status_location", "");

  return eventDict;
};

module.exports = {
  mapStatusToEvent,
};
