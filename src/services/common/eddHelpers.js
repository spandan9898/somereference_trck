/* eslint-disable class-methods-use-this */
const moment = require("moment");
const { PICKRR_EDD_MATRIX, ZONE_REQUIRED_STATUS_SET } = require("./constants");
const { ValidateDateField, getMinDate, getMaxDate } = require("../../utils/helpers");

/**
 * EDD Helper Class
 */
class EddPrepareHelper {
  constructor({ latestCourierEDD, pickupDateTime, eddStampInDb }) {
    this.validatedPickupDate = ValidateDateField(pickupDateTime);
    this.validatedEDDStamp = ValidateDateField(eddStampInDb);
    this.validatedCourierEdd = ValidateDateField(latestCourierEDD);
    this.today = moment().set({ hour: 13, minute: 0, second: 0 }).toDate();
    this.tomorrow = moment().add(1, "days").set({ hour: 13, minute: 0, second: 0 }).toDate();
  }

  getMinMaxTat({ zone }) {
    const minTat = PICKRR_EDD_MATRIX[zone].min_tat;
    const maxTat = PICKRR_EDD_MATRIX[zone].max_tat;
    return { minTat, maxTat };
  }

  /**
   *
   * @prepared EDD for OrderPlaced
   * @returns EDD
   */
  getPickrrEDDforOrderPlaced({ zone, latestCourierEDD }) {
    let minPickrrEDD;
    let maxPickrrEDD;
    const { minTat, maxTat } = this.getMinMaxTat({ zone });
    if (this.validatedCourierEdd) {
      // change today + timedelta

      minPickrrEDD = moment(this.today).add(minTat, "days").toDate();
      maxPickrrEDD = moment(this.tomorrow).add(maxTat, "days").toDate();
      if (moment(latestCourierEDD).isAfter(moment(maxPickrrEDD))) {
        return maxPickrrEDD;
      }
      if (moment(latestCourierEDD).isBefore(minPickrrEDD)) {
        return minPickrrEDD;
      }
      return latestCourierEDD;
    }
    return moment(this.tomorrow).add(minTat, "days").toDate();
  }

  getPickrrEDDforOrderLive({ zone, latestCourierEDD, pickupDateTime, eddStampInDb }) {
    let pickrrEDD;
    const { minTat, maxTat } = this.getMinMaxTat({ zone });
    if (this.validatedPickupDate) {
      const pickupAndMinTat = moment(pickupDateTime).add(minTat, "days").toDate();
      const pickupAndMaxTat = moment(pickupDateTime).add(maxTat, "days").toDate();
      const minPickrrEDD = getMaxDate(pickupAndMinTat, this.tomorrow);
      const maxPickrrEDD = getMaxDate(pickupAndMaxTat, this.tomorrow);
      if (this.validatedCourierEdd) {
        if (moment(latestCourierEDD).isAfter(maxPickrrEDD)) {
          pickrrEDD = maxPickrrEDD;
        } else if (moment(latestCourierEDD).isBefore(minPickrrEDD)) {
          pickrrEDD = minPickrrEDD;
        } else {
          pickrrEDD = latestCourierEDD;
        }
        return pickrrEDD;
      }
      return getMaxDate(pickupAndMinTat, this.tomorrow);
    }

    // courier edd  past date handled over here

    if (this.validatedCourierEdd) {
      if (moment(this.validatedCourierEdd).isAfter(moment())) {
        return getMinDate(latestCourierEDD, this.tomorrow);
      }
      return this.tomorrow;
    }
    if (this.validatedEDDStamp) {
      return getMinDate(eddStampInDb, this.tomorrow);
    }
    return this.tomorrow;
  }

  getPickrrEDDforRTO({ latestCourierEDD }) {
    if (this.validatedCourierEdd) {
      return latestCourierEDD;
    }
    return null;
  }

  getPickrrEDDforOFD() {
    return this.today;
  }

  getPickrrEDDforNDR({ latestCourierEDD }) {
    if (this.validatedCourierEdd) {
      const maxDate = getMaxDate(latestCourierEDD, this.tomorrow);
      return moment(maxDate).add(1, "days").toDate();
    }
    return this.tomorrow;
  }

  /**
   *
   * return PickrrEddEventFuncCall
   */
  async callPickrrEDDEventFunc({
    zone,
    latestCourierEDD,
    pickupDateTime,
    eddStampInDb,
    statusType,
  }) {
    let pickrrEDD;
    if (!PICKRR_EDD_MATRIX?.zone && ZONE_REQUIRED_STATUS_SET.includes(statusType)) {
      return latestCourierEDD;
    }
    if (["OP", "OM", "PPF", "OFP"].includes(statusType)) {
      pickrrEDD = this.getPickrrEDDforOrderPlaced({
        zone,
        latestCourierEDD,
      });
    } else if (["PP", "SHP", "OT", "RAD"].includes(statusType)) {
      pickrrEDD = this.getPickrrEDDforOrderLive({
        zone,
        latestCourierEDD,
        pickupDateTime,
        eddStampInDb,
      });
    } else if (statusType === "OO") {
      pickrrEDD = this.getPickrrEDDforOFD();
    } else if (["UD", "NDR"].includes(statusType)) {
      pickrrEDD = this.getPickrrEDDforNDR({
        latestCourierEDD,
      });
    } else if (["RTO", "RTO-OT", "RTO-OO", "RTO UD"].includes(statusType)) {
      pickrrEDD = this.getPickrrEDDforRTO({ latestCourierEDD });
    } else if (["DL", "RTD", "OC", "LT", "DM"].includes(statusType)) {
      return null;
    } else {
      // changed here from latestCourierEDD

      return latestCourierEDD;
    }
    return pickrrEDD;
  }
}

module.exports = { EddPrepareHelper };
