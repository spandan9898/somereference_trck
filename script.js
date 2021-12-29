const fs = require("fs");

const _ = require("lodash");
const { AMAZE_CODE_MAPPER } = require("./src/apps/amaze/constant");
const { BLUEDART_CODE_MAPPER_V2 } = require("./src/apps/bluedart/constant");
const { DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER } = require("./src/apps/delhivery/constant");
const { ECOMM_CODE_MAPPER } = require("./src/apps/ecomm/constant");
const { EKART_STATUS_MAPPER } = require("./src/apps/ekart/constant");
const { PARCELDO_CODE_MAPPER } = require("./src/apps/parceldo/constant");
const { SHADOWFAX_CODE_MAPPER } = require("./src/apps/shadowfax/constant");
const { UDAAN_STATUS_MAPPING } = require("./src/apps/udaan/constant");
const { XBS_STATUS_MAPPER } = require("./src/apps/xpressbees/constant");

/**
 *
 */
const manipulateMapperData = (codeMapper, fileName) => {
  const res = _.mapKeys(codeMapper, (value, key) => key.toLowerCase());
  fs.writeFileSync(`mapper/${fileName}.json`, JSON.stringify(res));
  console.log("done");
};

/**
 *
 */
const loadScript = () => {
  const fileNameMapper = {
    amaze: AMAZE_CODE_MAPPER,
    bluedart: BLUEDART_CODE_MAPPER_V2,
    delhivery: DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER,
    ecomm: ECOMM_CODE_MAPPER,
    ekart: EKART_STATUS_MAPPER,
    parceldo: PARCELDO_CODE_MAPPER,
    shadowfax: SHADOWFAX_CODE_MAPPER,
    udaan: UDAAN_STATUS_MAPPING,
    xbs: XBS_STATUS_MAPPER,
  };

  for (const file in fileNameMapper) {
    manipulateMapperData(fileNameMapper[file], file);
  }
};

loadScript();
