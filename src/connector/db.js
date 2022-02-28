const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("../../logger");

/**
 * @desc Initialize Multiple DB and get DB instances
 */
class InitDb {
  constructor() {
    this.instances = {};
  }

  /**
   *
   * @param {*} hostName -> like, pullDB
   * @param {*} hostUrl -> pullDb SRV url
   */
  async connectDb(hostName, hostUrl) {
    try {
      const client = await MongoClient.connect(hostUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      });
      this.instances[hostName] = client;
      logger.info(`${hostName} connected`);
    } catch (error) {
      logger.error(`${hostName} connect error`, error);
    }
  }

  /**
   *
   * @param {*} hostName -> like above
   * @desc get already connected db instance
   * @returns db instance
   */
  getDbInstance(hostName) {
    if (!this.instances[hostName]) {
      throw new Error(`${hostName} not found. Please Connect to Database First`);
    }
    return this.instances[hostName];
  }
}

module.exports = new InitDb();
