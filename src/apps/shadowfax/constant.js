const SHADOWFAX_CODE_MAPPER = {
  recd_at_rev_hub: "PP",
  sent_to_fwd: "OT",
  recd_at_fwd_hub: "OT",
  recd_at_fwd_dc: "OT",
  assigned_for_delivery: "OT",
  ofd: "OO",
  delivered: "DL",
  cid: "NDR",
  nc: "NDR",
  na: "NDR",
  reopen_ndr: "OT",
  cancelled_by_customer: "NDR",
  cancelled_by_seller: "NDR",
  rts: "RTO",
  rts_d: "RTD",
  lost: "OT",
  on_hold: "OT",
};

const SHADOWFAX_TOPICS_COUNT = 2;

module.exports = {
  SHADOWFAX_CODE_MAPPER,
  SHADOWFAX_TOPICS_COUNT,
};
