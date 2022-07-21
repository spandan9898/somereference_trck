/* eslint-disable no-nested-ternary */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable require-jsdoc */

require("dotenv").config();

const moment = require("moment");

const { ObjectId } = require("mongodb");
const initDB = require("../src/connector/db");
const { HOST_NAMES } = require("../src/utils/constants");
const { getDbCollectionInstance } = require("../src/utils");
const logger = require("../logger");
const { convertDate } = require("./helper");

const {
  MONGO_DB_PROD_SERVER_HOST,
  MONGO_DB_REPORT_SERVER_HOST,
  MONGO_DB_REPORT_COLLECTION_NAME,
  MONGO_DB_REPORT_DB_NAME,
} = process.env;

const insertIntoPullDb = async (data, pullDbInstance) => {
  try {
    const result = await pullDbInstance.insertMany(data);
    console.log("result", result);
  } catch (error) {
    console.log("insertIntoPullDb", error);
  }
};

/**
 *
 * @param {*} reportDocItemList
 * @returns
 */
const itemListMaker = (reportDocItemList) => {
  const itemList = [];
  for (let i = 0; i < reportDocItemList.length; i += 1) {
    itemList.push({
      sku: reportDocItemList[i]?.sku || null,
      item_tax_percentage: 0,
      item_height: null,
      name: null,
      item_name: reportDocItemList[i]?.item_name || null,
      price: reportDocItemList[i]?.price || null,
      item_weight: null,
      hsn: reportDocItemList[i]?.hsn_code || null,
      shipping_charge: null,
      tax_per: 0,
      variant_title: null,
      quantity: reportDocItemList[i]?.quantity || null,
      item_breadth: null,
      item_length: null,
    });
  }
  return itemList;
};

/**
 *
 * @param {*} reportDoc
 * @returns
 */
const prepareForPullServer = (reportDoc) => {
  let currentStatusTime = moment(reportDoc.current_status_datetime);
  currentStatusTime = currentStatusTime.isValid() ? currentStatusTime.toDate() : moment().toDate();

  let eddDate = moment(reportDoc.edd_date);
  eddDate = eddDate.isValid() ? eddDate.toDate() : null;

  const pullDoc = {
    breadth: reportDoc.user_breadth || null,
    is_cod: reportDoc.cod_amount > 0,
    weight: parseFloat(reportDoc.user_dead_weight || 0),
    item_tax_percentage: "0",
    billing_zone: reportDoc.order_zone || null,
    dispatch_mode: reportDoc.order_type || null,
    client_order_id: reportDoc.client_order_id || null,
    pickrr_order_id: reportDoc.pickrr_order_id || null,
    sku: itemListMaker(reportDoc.line_items)[0]?.sku || null,
    item_list: itemListMaker(reportDoc.line_items) || null,
    user_id: reportDoc.user_pk || null,
    order_type: reportDoc.order_type || null,
    hsn_code: null,
    company_name: reportDoc.company_name || null,
    product_name: itemListMaker(reportDoc.line_items)[0]?.item_name || null,
    status: {
      current_status_time: currentStatusTime,
      current_status_type: "OP",
      received_by: reportDoc.received_by || null,
      current_status_body: reportDoc.tracking_status || null,
      current_status_location: reportDoc.latest_location || null,
      current_status_val: null,
    },
    info: {
      from_state: reportDoc.pickup_state || null,
      invoice_value: reportDoc.invoice_value || null,
      from_name: reportDoc.pickup_name || null,
      to_address: reportDoc.drop_address || null,
      to_state: reportDoc.drop_state || null,
      courier_name: reportDoc.courier_child,
      to_pincode: reportDoc.drop_pincode || null,
      to_address_id: parseInt(reportDoc.destination_id, 10) || null,
      to_email: reportDoc.destination_email || null,
      from_email: reportDoc.pickup_email || null,
      to_city: reportDoc.drop_city || null,
      source_address_id: reportDoc.wh_id || null,
      to_name: reportDoc.drop_customer_name || null,
      from_phone_number: reportDoc.pickup_phone_number || null,
      from_city: reportDoc.pickup_city || null,
      user_id: reportDoc.user_pk || null,
      cod_amount: parseFloat(reportDoc.cod_amount) || null,
      is_open_ndr: false,
      to_phone_number: reportDoc.drop_customer_phone || null,
      from_pincode: reportDoc.pickup_pincode || null,
      from_address: reportDoc.pickup_address || null,
    },
    is_reverse: reportDoc.is_reverse || false,
    courier_used: reportDoc.courier_child,
    courier_tracking_id: reportDoc.courier_tracking_id,
    height: reportDoc.user_height || null,
    courier_parent_name: reportDoc.courier_used || null,
    client_extra_var: null,
    err: null,
    ops_profile: reportDoc.ops_poc || null,
    track_arr: [
      {
        scan_type: "OP",
        scan_status: "Order Placed",
        scan_datetime: currentStatusTime,
        scan_location: reportDoc.latest_location || null,
        pickrr_sub_status_code: "",
        courier_status_code: "",
      },
    ],
    length: reportDoc.user_length || null,
    edd_stamp: eddDate,
    quantity: reportDoc.item_quantity || null,
    tracking_id: reportDoc.pickrr_tracking_id || null,
    order_created_at:
      reportDoc.placed_date !== undefined || reportDoc.placed_date !== ""
        ? reportDoc.placed_date !== undefined
          ? new Date(reportDoc.placed_date)
          : new Date(reportDoc.placed_date)
        : null,
    user_pk: reportDoc.user_pk || null,
    created_at: new Date(),
    updated_at: new Date(),
    courier_input_weight: reportDoc.updated_dead_weight || null,
    user_email: reportDoc.user_email || null,
    auth_token: reportDoc.auth_token || null,
    website: reportDoc.website || null,
    label_logo: reportDoc.label_logo || null,
    last_update_from: "mongo_trigger",
    ewaybill_number: reportDoc.ewaybill_number,
    is_mps: reportDoc.is_mps || null,
    rto_waybill: reportDoc.rto_waybill || null,
    waybill_type: reportDoc.waybill_type || null,
    pdd_date: reportDoc.pdd_date || null,
    pickup_address_pk: reportDoc.pickup_address_pk || null,
    status_pk: reportDoc.status_pk,
    kam: reportDoc.kam,
    wh_id: reportDoc.wh_id,
    sales_poc: reportDoc.sales_poc,
    shop_platform: reportDoc.shop_platform,
    shop_platform_obj: reportDoc.shop_platform_obj,
    woocom_platform_obj: reportDoc.woocom_platform_obj,
  };
  return pullDoc;
};

/**
 *
 *
 */
const fetchDataFromReportDB = async ({ startDate, endDate, limit }) => {
  try {
    const pullDbInstance = await getDbCollectionInstance();

    const reportDbCollection = await getDbCollectionInstance({
      dbName: MONGO_DB_REPORT_DB_NAME,
      collectionName: MONGO_DB_REPORT_COLLECTION_NAME,
      hostName: HOST_NAMES.REPORT_DB,
    });
    const filters = {
      $and: [],
    };

    filters.$and.push({
      placed_date: {
        $gt: convertDate(startDate, "start"),
        $lt: convertDate(endDate),
      },
    });

    // filters.$and.push({
    //   pickrr_tracking_id: [""],
    // });

    const filtersLength = filters.$and.length;
    if (limit && limit < 4999) {
      let batchData = [];

      const aggCursor = await reportDbCollection.find(filters).limit(limit);

      for await (const doc of aggCursor) {
        batchData.push(doc);
      }
      logger.verbose(`batchData In Loop  For Report to Pull DB Backfilling: ${batchData.length}`);

      batchData = batchData.map(prepareForPullServer);

      insertIntoPullDb(batchData, pullDbInstance);
    } else {
      const LIMIT = 5000;
      let isDataAvailable = false;
      let lastId;

      do {
        if (lastId) {
          filters.$and[filtersLength] = {
            _id: {
              $gt: ObjectId(lastId),
            },
          };
        }

        let isPresent = false;

        let batchData = [];

        const aggCursor = await reportDbCollection.find(filters).limit(LIMIT);

        for await (const doc of aggCursor) {
          batchData.push(doc);
          lastId = doc._id;
          isPresent = true;
        }
        logger.verbose(`batchData In Loop  For Report to Pull DB Backfilling: ${batchData.length}`);

        batchData = batchData.map(prepareForPullServer);

        insertIntoPullDb(batchData, pullDbInstance);

        await new Promise((done) => setTimeout(() => done(), 6000));

        isDataAvailable = isPresent;
      } while (isDataAvailable);
    }
  } catch (error) {
    logger.error("fetchDataFromReportDB", error);
  }
};

/**
 *
 * @param {*} param0
 */
const reportToPullBackfilling = async ({ startDate, endDate, limit }) => {
  await initDB.connectDb(HOST_NAMES.PULL_DB, MONGO_DB_PROD_SERVER_HOST);
  await initDB.connectDb(HOST_NAMES.REPORT_DB, MONGO_DB_REPORT_SERVER_HOST);

  await fetchDataFromReportDB({ startDate, endDate, limit });
};

module.exports = reportToPullBackfilling;
