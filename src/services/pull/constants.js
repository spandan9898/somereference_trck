const BLOCK_NDR_STRINGS = [
  "ndr call - fe remark correct",
  "call placed to consignee",
  "agent remark verified",
];

const PRE_PICKUP_STATUS = ["OP", "PPF", "OC", "OM", "OFP"];
const { MONGO_DB_PROD_SERVER_HOST } = process.env;
const { MONGO_DB_PROD_SERVER_DATABASE_NAME } = process.env;
const { MONGO_DB_PROD_SERVER_COLLECTION_NAME } = process.env;

module.exports = {
  BLOCK_NDR_STRINGS,
  PRE_PICKUP_STATUS,
  MONGO_DB_PROD_SERVER_HOST,
  MONGO_DB_PROD_SERVER_DATABASE_NAME,
  MONGO_DB_PROD_SERVER_COLLECTION_NAME,
};
