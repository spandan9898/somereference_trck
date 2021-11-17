const BLOCK_NDR_STRINGS = [
  "ndr call - fe remark correct",
  "call placed to consignee",
  "agent remark verified",
];

const { MONGO_DB_PULL_SERVER_HOST } = process.env;
const { MONGO_DB_PULL_SERVER_DATABASE_NAME } = process.env;
const { MONGO_DB_PULL_SERVER_COLLECTION_NAME } = process.env;

module.exports = {
  BLOCK_NDR_STRINGS,
  MONGO_DB_PULL_SERVER_HOST,
  MONGO_DB_PULL_SERVER_DATABASE_NAME,
  MONGO_DB_PULL_SERVER_COLLECTION_NAME,
};
