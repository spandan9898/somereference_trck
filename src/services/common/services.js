const get = require("lodash/get");
const moment = require("moment");

const logger = require("../../../logger");
const { NEW_STATUS_TO_OLD_MAPPING } = require("../../apps/webhookClients/common/constants");
const { getObject, setObject } = require("../../utils");
const { elkDataUpdate } = require("./elk");
const producerConnection = require("../../utils/producerConnection");
const { KAFKA_INSTANCE_CONFIG } = require("../../utils/constants");
const { produceData } = require("../../utils/kafka");
const { COMMON_TRACKING_TOPIC_NAME } = require("./constants");

/**
 * @param trackingDoc -> tracking document(same as DB document)
 * @desc prepare current status, current status time and order type and then update ELK
 */
const updateStatusELK = async (trackingDoc, elkClient) => {
  try {
    const trackingId = trackingDoc.tracking_id;
    const currentStatusTime = get(trackingDoc, "status.current_status_time") || "NA";
    const currentStatusType = get(trackingDoc, "status.current_status_type") || "NA";

    await elkDataUpdate({
      elkClient,
      id: trackingId,
      doc: {
        current_status_time: moment(currentStatusTime).subtract(330, "minutes").toDate(),
        current_status_type: NEW_STATUS_TO_OLD_MAPPING[currentStatusType] || currentStatusType,
      },
    });
  } catch (error) {
    logger.error(error.message);
  }
};

/**
 *
 * @param {*} preparedDict
 * @desc fetching processCount, default value is 0
 */
const getTrackingIdProcessingCount = async ({ awb }) => {
  try {
    const cacheData = (await getObject(awb)) || {};
    const { processCount = 0 } = cacheData;
    return processCount;
  } catch (error) {
    logger.error("getTrackingIdProcessingCount", error);
    return 0;
  }
};

/**
 *
 * @param {*} preparedDict
 * @desc update processCount based on provided type, default type is "add". i.e increase value by 1
 */
const updateTrackingProcessingCount = async ({ awb }, type = "add") => {
  try {
    const cacheData = (await getObject(awb)) || {};
    let { processCount = 0 } = cacheData;
    if (type === "add") {
      processCount += 1;
    } else {
      processCount = !processCount ? 0 : processCount - 1;
    }
    cacheData.processCount = processCount;
    await setObject(awb, cacheData);
  } catch (error) {
    logger.error("updateTrackingProcessingCount", error);
  }
};

/**
 *
 * @param {*} trackingObj -> DB Tracking Document
 */
const commonTrackingDataProducer = async (trackingObj) => {
  try {
    const trackingItemList = [
      "is_cod",
      "item_tax_percentage",
      "billing_zone",
      "dispatch_mode",
      "client_order_id",
      "pickrr_order_id",
      "sku",
      "item_list",
      "order_type",
      "hsn_code",
      "company_name",
      "product_name",
      "status",
      "info",
      "is_reverse",
      "courier_used",
      "courier_tracking_id",
      "courier_parent_name",
      "edd_stamp",
      "quantity",
      "tracking_id",
      "order_created_at",
      "courier_input_weight",
      "user_email",
      "auth_token",
      "website",
      "label_logo",
      "ewaybill_number",
      "is_mps",
      "rto_waybill",
      "waybill_type",
      "pdd_date",
      "pickup_address_pk",
      "courier_edd",
      "pickup_datetime",
      "promise_edd",
      "sync_count",
      "is_ndr",
      "is_reverse_qc", // reverse_qc key from order placing
      "latest_otp", // qc_rejection_reason string
      "qc_rejection_reason", // qc_rejection_reason string
      "qc_bill",
      "qcf_bill",
      "order_pk",
    ];

    const defaultValue = {
      is_ndr: false,
    };

    const payload = {};
    trackingItemList.forEach((item) => {
      if (item === "order_pk") {
        payload[item] = trackingObj?.order_pk || null;
      } else {
        payload[item] = trackingObj[item];
      }
      if (item in defaultValue) {
        payload[item] = payload[item] || defaultValue[item];
      }
    });

    const producerInstance = await producerConnection.connect(KAFKA_INSTANCE_CONFIG.PROD.name);

    const messages = [
      {
        key: payload.tracking_id,
        value: JSON.stringify({
          payload,
        }),
      },
    ];

    await produceData({
      topic: COMMON_TRACKING_TOPIC_NAME,
      producer: producerInstance,
      messages,
    });
  } catch (error) {
    logger.error("commonProducer", error);
  }
};

module.exports = {
  updateStatusELK,
  getTrackingIdProcessingCount,
  updateTrackingProcessingCount,
  commonTrackingDataProducer,
};
