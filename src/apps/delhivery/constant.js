const DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER = {
  "FMOFP-101_UD": {
    courier_remark: "Out for Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "FMEOD-101_UD": {
    courier_remark: "Incomplete shipper pickup address and shipper not contactable",
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "FMEOD-102_UD": {
    courier_remark: "Pick up Attempted within window and shipment not ready",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "FMEOD-103_UD": {
    courier_remark: "Shipper is closed",
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "FMEOD-104_UD": {
    courier_remark: "Vehicle breakdown",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "FMEOD-106_UD": {
    courier_remark: "Pickup not attempted",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "FMEOD-107_UD": {
    courier_remark: "Damaged Package",
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  "FMEOD-108_UD": {
    courier_remark: "Vehicle capacity constraint",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "FMEOD-109_UD": {
    courier_remark: "Improper / missing regulatory paper work",
    scan_type: "PPF",
    pickrr_sub_status_code: "REGU",
  },
  "FMEOD-111_UD": {
    courier_remark: "Pickup request schedule but no request from shipper",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "FMEOD-112_UD": {
    courier_remark: "Duplicate pickup request",
    scan_type: "PPF",
    pickrr_sub_status_code: "DUP",
  },
  "FMEOD-110_UD": {
    courier_remark: "Vendor Shifted",
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "FMEOD-118_UD": {
    courier_remark: "Seller cancelled order",
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  "X-UCI_UD": {
    courier_remark: "Consignment Manifested",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "PNP-101_UD": {
    courier_remark: "Package not picked/received from client'",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "X-PNP_UD": {
    courier_remark: "Package not picked/recieved from client'",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "X-PPOM_UD": {
    courier_remark: "Shipment Picked Up from Client Location'",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "X-PPONM_UD": {
    courier_remark: "Shipment Picked Up from Client Location but Data Not Recieved'",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "X-PROM_UD": {
    courier_remark: "Shipment Picked Up at Origin Center'",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  "X-PRONM_UD": {
    courier_remark: "Shipment Picked Up at Origin Center but Data Not Recieved'",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  "X-PIOM_UD": {
    courier_remark: "Shipment Recieved at Origin Center'",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  "X-IBD3F_UD": {
    courier_remark: "Received at destination city",
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  "X-IBD1F_UD": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DDD3FD_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X- LM1D_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDD3F_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDD2FD_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDD4FD_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDO3F_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDD1FD_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDD1LF_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "X-DDD3LF_UD": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "EOD-600_DL": {
    courier_remark: "Delivered to Courier",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-141_DL": {
    courier_remark: "Delivered to consignee - OTP & QR Verified Delivery",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-145_DL": {
    courier_remark: "Delivered to consignee - QR Verified",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-135_DL": {
    courier_remark: "Delivered to consignee - OTP Verified delivery",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-143_DL": {
    courier_remark: "Delivered to others as instructed by consignee - QR Verified",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-37_DL": {
    courier_remark: "Delivered at Mailroom/Security",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-136_DL": {
    courier_remark: "Delivered without verification",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-144_DL": {
    courier_remark: "Delivered at Mailroom/Security - QR Verified",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-38_DL": {
    courier_remark: "Delivered to consignee",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-36_DL": {
    courier_remark: "Delivered to other as instructed by consignee",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "SC-101_DL": {
    courier_remark: "Delivered to consignee [Self Collect]",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "EOD-40_UD": {
    courier_remark: "Payment Mode / Amt Dispute",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "EOD-43_UD": {
    courier_remark: "Self Collect",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "EOD-3_UD": {
    courier_remark: "Asked to reschedule on",
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "EOD-6_UD": {
    courier_remark: "Customer Refused to accept/Order Cancelled",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "EOD-69_UD": {
    courier_remark: "Customer asked for open delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "EOD-134_UD": {
    courier_remark: "Consignee asked for card/wallet on delivery payment",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "EOD-105_UD": {
    courier_remark: "Consignment seized by consignee",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "EOD-104_UD": {
    courier_remark: "Entry restricted area",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "EOD-86_UD": {
    courier_remark: "Not attempted",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "EOD-15_UD": {
    courier_remark: "Consignee moved/shifted",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "EOD-11_UD": {
    courier_remark: "Consignee unavailable",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "EOD-16_UD": {
    courier_remark: "Payment not ready with customer",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "EOD-133_UD": {
    courier_remark: "Cheque Data Incorrect",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "EOD- 146_UD": {
    courier_remark: "No Id Proof",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "EOD-111_UD": {
    courier_remark: "Consignee opened the package and refused to accept",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "EOD-74_UD": {
    courier_remark: "Bad/Incomplete Address",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "SC-102_UD": {
    courier_remark: "ODA Shipments",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "SC-103_UD": {
    courier_remark: "Self Collect requested by customer",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "SC-106_UD": {
    courier_remark: "Package marked for self collect",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "SC-104_UD": {
    courier_remark: "Bad Address",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "X-SC_UD": {
    courier_remark: "Reached out to customer for Self Collect",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "COVID19 - 001_UD": {
    courier_remark: "Corona Containment /hotspot area",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 002_UD": {
    courier_remark: "Corona No E-Passes",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 003_UD": {
    courier_remark: "Corona Police Shut Down",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 004_UD": {
    courier_remark: "Corona Limited Dispatch Timings",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 005_UD": {
    courier_remark: "Corona No Forward Vehicle Pass",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 006_UD": {
    courier_remark: "Corona Manpower Shortage",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 007_UD": {
    courier_remark: "Corona Client Closed",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 011_UD": {
    courier_remark: "Shipment moved In Red Zone",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "COVID19 - 012_UD": {
    courier_remark: "Shipment moved out of Red Zone",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "X-DLO2F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD1F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLO1F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD0F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLL0F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLL2F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLL1F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD2F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "CS-101_UD": {
    courier_remark: "Inbound against permanent connection [custody scan]",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLO0F_UD": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILO1F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILL1F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILO0F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILD0F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILL2F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILO2F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILD1F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILL0F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-ILD2F_UD": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD1R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLO1R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD0R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLL2R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLL0R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLO0R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLL1R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD4R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLD2R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DLO2R_RT": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILD2R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILD1R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILO1R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILD0R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILO0R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILL0R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILL2R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILL1R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-ILO2R_RT": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-IBD4R_RT": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-IBD1R_RT": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-IBD3R_RT": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DRO4R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRD4R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRO2R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRD2R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRD1R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRO1R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRD3R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "X-DRO3R_RT": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "RD-PD4_RT": {
    courier_remark: "Client Wants Open Delivery",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD12_RT": {
    courier_remark: "Damaged content",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD7_RT": {
    courier_remark: "Short Shipment",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD8_RT": {
    courier_remark: "Soft data not available with client",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD10_RT": {
    courier_remark: "Content mismatch",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD11_RT": {
    courier_remark: "Content missing",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD17_RT": {
    courier_remark: "Not attempted",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD18_RT": {
    courier_remark: "Incorrect seller information",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD15_RT": {
    courier_remark: "Client capacity constraint",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD3_RT": {
    courier_remark: "Client/ Seller closed",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD20_RT": {
    courier_remark: "Missing invoice",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD21_RT": {
    courier_remark: "Damaged packing",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RD-PD22_RT": {
    courier_remark: "Closure Delay",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "RT-110_DL": {
    courier_remark: "RTO due to poor packaging",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "RD-AC1_DL": {
    courier_remark: "RTO/DTO Delivered",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "RD-AC_DL": {
    courier_remark: "RETURN Accepted",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "DLYRG-125_RT": {
    courier_remark: "Delay due to Disturbance/Strike",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-109_RT": {
    courier_remark: "Vehicle Breakdown",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-124_RT": {
    courier_remark: "Consignment being inspected for duty",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-106_RT": {
    courier_remark: "Flight delayed/cancelled",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYMR-118_RT": {
    courier_remark: "Misrouted",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-130_RT": {
    courier_remark: "Region Specific Off",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-104_RT": {
    courier_remark: "Flight cancelled",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRPC-416_RT": {
    courier_remark: "Hold as per client instrutions",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-127_RT": {
    courier_remark: "Documentation from shipper is insufficient",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-133_RT": {
    courier_remark: "Air Offload - Capacity constraint",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-115_RT": {
    courier_remark: "Air Offload - Security constraint",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-120_RT": {
    courier_remark: "Under inspection by regulatory authorities",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRPC-419_RT": {
    courier_remark: "Not dispatched due to client schedule",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYRPC-417_RT": {
    courier_remark: "Physical address doesn't match the soft data",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-102_RT": {
    courier_remark: "Natural Disaster",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-132_RT": {
    courier_remark: "Out of Delivery Area (ODA)",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-107_RT": {
    courier_remark: "Office/Institute closed",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-142_RT": {
    courier_remark: "Delay due to runway closure",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-101_RT": {
    courier_remark: "Heavy Rain/ Fog",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-139_RT": {
    courier_remark: "Checkpost/ Clearance Delay",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DOFF-128_RT": {
    courier_remark: "Surface Transit Delay",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-135_RT": {
    courier_remark: "Held for Transit Pass",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "RT-106_RT": {
    courier_remark: "Packaging intact, content mismatch/missing from client at Origin",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "RT-101_RT": {
    courier_remark: "Returned as per Client Instructions",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "RT-113_RT": {
    courier_remark: "Returned as per Security Instructions",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "RT-107_RT": {
    courier_remark: "Unsuccessful NDR Reattempt",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "RT-109_RT": {
    courier_remark: "Returned due to poor packaging",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "RT- 108_RT": {
    courier_remark: "No client instructions to Reattempt",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "X-DDD3FP_PP": {
    courier_remark: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "X-ASP_PP": {
    courier_remark: "Pickup scheduled",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "EOD-77_PU": {
    courier_remark: "Pickup completed",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "X-NSZ_UD": {
    courier_remark: "Non-serviceable location",
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "EOD-21_CN": {
    courier_remark: "Pickup/KYC request cancelled",
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  "EOD-68_PP": {
    courier_remark: "Request for delayed pickup/KYC",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "FMEOD-152_UD": {
    courier_remark: "Shipment not ready for pickup",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "EOD-73_PP": {
    courier_remark: "Bad/Incomplete address",
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "EOD-26_PP": {
    courier_remark: "Consignee unavailable",
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  "EOD-121_PP": {
    courier_remark: "Entry restricted area",
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "EOD-6O_RT": {
    courier_remark: "OTP verified cancellation",
    scan_type: "UD",
    pickrr_sub_status_code: "CR-OTP",
  },
  "X-DBL1F_UD": {
    courier_remark: "Added to Bag",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-125_UD": {
    courier_remark: "Delay due to Disturbance/Strike",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-109_UD": {
    courier_remark: "Vehicle Breakdown",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-124_UD": {
    courier_remark: "Consignment being inspected for duty",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-106_UD": {
    courier_remark: "Flight delayed/cancelled",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYMR-118_UD": {
    courier_remark: "Misrouted",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-104_UD": {
    courier_remark: "Flight cancelled",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "RT-104_UD": {
    courier_remark: "Shipment Damaged",
    scan_type: "DM",
    pickrr_sub_status_code: "",
  },
  "DLYRPC-416_UD": {
    courier_remark: "Hold as per client instrutions",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-127_UD": {
    courier_remark: "Documentation from shipper is insufficient",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-133_UD": {
    courier_remark: "Air Offload - Capacity constraint",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-115_UD": {
    courier_remark: "Air Offload - Security constraint",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYRG-120_UD": {
    courier_remark: "Under inspection by regulatory authorities",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYRPC-419_UD": {
    courier_remark: "Not dispatched due to client schedule",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYRPC-417_UD": {
    courier_remark: "Physical address doesn't match the soft data",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-102_UD": {
    courier_remark: "Natural Disaster",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-142_UD": {
    courier_remark: "Delay due to runway closure",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-132_UD": {
    courier_remark: "Out of Delivery Area (ODA)",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-107_UD": {
    courier_remark: "Office/Institute closed",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-101_UD": {
    courier_remark: "Heavy Rain/ Fog",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DOFF-128_UD": {
    courier_remark: "Surface Transit Delay",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-135_UD": {
    courier_remark: "Held for Transit Pass",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "S-MAR_UD": {
    courier_remark: "Package marked for movement by Surface",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYLH-139_UD": {
    courier_remark: "Checkpost/ Clearance Delay",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYDC-416_UD": {
    courier_remark: "Hold as per client instrutions",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "DLYFM-102_UD": {
    courier_remark: "Hold as per client Instructions (FM)",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "PNP-102_UD": {
    courier_remark: "Pickup Dispute - PNPR Initiated",
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "EOD-137_UD": {
    courier_remark: "OTP code mismatch",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "EOD-138_UD": {
    courier_remark: "OTP not available",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "LT-100_LT": {
    courier_remark: "Shipment Lost",
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },
  "DLYDG-119_PU": {
    courier_remark: "Shipment Damaged",
    scan_type: "DM",
    pickrr_status_code: "",
  },
  "R_X-ILL0R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_X-DLO0R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_X-ILO0R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_RD-PD12_PU": {
    pickrr_sub_status_code: "CR",
    courier_remarks: "Damaged content",
    scan_type: "UD",
  },
  "R_X-DLD1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_X-DLL2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_EOD-84_CN": {
    pickrr_sub_status_code: "OTH",
    courier_remarks: "Product description mismatch",
    scan_type: "PPF",
  },
  "R_DLYDC-101_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Heavy Rain/ Fog",
    scan_type: "OM",
  },
  "R_X-DLD2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_RD-PD10_PU": {
    pickrr_sub_status_code: "CR",
    courier_remarks: "Content mismatch",
    scan_type: "UD",
  },
  "R_DLYRG-120_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Under inspection by regulatory authorities",
    scan_type: "OT",
  },
  "R_DLYRPC-417_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Physical address doesn't match the soft data",
    scan_type: "OT",
  },
  "R_DLYLH-109_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Vehicle Breakdown",
    scan_type: "OT",
  },
  "R_RD-PD15_PU": {
    pickrr_sub_status_code: "CI",
    courier_remarks: "Client capacity constraint",
    scan_type: "UD",
  },
  "R_EOD-106_CN": {
    pickrr_sub_status_code: "SNR",
    courier_remarks: "Reached Maximum attempt count",
    scan_type: "PPF",
  },
  "R_X-DRD4R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_DLYRG-125_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Delay due to Disturbance/Strike",
    scan_type: "OT",
  },
  "R_X-IBD1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Bag incoming at return city PC",
    scan_type: "RAD",
  },
  "R_CL-105_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Reversal of Return closure",
    scan_type: "OT",
  },
  "R_RD-PD8_PU": {
    pickrr_sub_status_code: "CI",
    courier_remarks: "Soft data not available with client",
    scan_type: "UD",
  },
  "R_RD-AC_DTO": {
    pickrr_sub_status_code: "",
    courier_remarks: "RETURN Accepted",
    scan_type: "DL",
  },
  "R_X-DLL0R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_X-ASP_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Auto scheduled",
    scan_type: "OM",
  },
  "R_X-DDD4FR_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
  },
  "R_EOD-26_PP": {
    pickrr_sub_status_code: "SU",
    courier_remarks: "Consignee unavailable",
    scan_type: "PPF",
  },
  "R_DLYRG-124_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Consignment being inspected for duty",
    scan_type: "OT",
  },
  "R_X-ILO1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_X-DRO3R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_X-DRD3R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_RD-PD11_PU": {
    pickrr_sub_status_code: "CR",
    courier_remarks: "Content missing",
    scan_type: "UD",
  },
  "R_X-DLD0R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_DLYLH-133_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Air Offload - Capacity constraint",
    scan_type: "OT",
  },
  "R_DLYLH-104_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Flight cancelled",
    scan_type: "OT",
  },
  "R_EOD-95_CN": {
    pickrr_sub_status_code: "DAM",
    courier_remarks: "Damaged/Used product",
    scan_type: "PPF",
  },
  "R_EOD-65_PP": {
    pickrr_sub_status_code: "NA",
    courier_remarks: "Not attempted",
    scan_type: "PPF",
  },
  "R_X-ILL1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_X-IBD4R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Bag incoming at return city RPC",
    scan_type: "RAD",
  },
  "R_DLYDC-102_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Natural Disaster",
    scan_type: "OM",
  },
  "R_X-UCO_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Received soft data for consignment",
    scan_type: "OP",
  },
  "R_X-ILD1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_RD-PD3_PU": {
    pickrr_sub_status_code: "CNA",
    courier_remarks: "Client/ Seller closed",
    scan_type: "UD",
  },
  "R_RD-PD17_PU": {
    pickrr_sub_status_code: "SD",
    courier_remarks: "Not attempted",
    scan_type: "UD",
  },
  "R_DOFF-128_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Surface Transit Delay",
    scan_type: "OT",
  },
  "R_DLYLH-115_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Air Offload - Security constraint",
    scan_type: "OT",
  },
  "R_DLYRG-127_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Documentation from shipper is insufficient",
    scan_type: "OT",
  },
  "R_X-IBD3R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Bag incoming at return city DC",
    scan_type: "RAD",
  },
  "R_EOD-73_PP": {
    pickrr_sub_status_code: "AI",
    courier_remarks: "Bad/Incomplete address",
    scan_type: "PPF",
  },
  "R_DLYRPC-419_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Not dispatched due to client schedule",
    scan_type: "OT",
  },
  "R_X-ILL2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_CL-101_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "As per client's instructions",
    scan_type: "OM",
  },
  "R_EOD-132_CN": {
    pickrr_sub_status_code: "OTH",
    courier_remarks: "Colour Mismatch",
    scan_type: "PPF",
  },
  "R_X-DDD4FP_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
  },
  "R_ST-109_CN": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out of service area",
    scan_type: "OC",
  },
  "R_X-DDD3FR_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
  },
  "R_X-DDD2FP_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
  },
  "R_EOD-140_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Shipments Count Mismatch",
    scan_type: "OT",
  },
  "R_EOD-108_CN": {
    pickrr_sub_status_code: "OTH",
    courier_remarks: "Product count mismatch",
    scan_type: "PPF",
  },
  "R_X-DRD2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_X-DRO2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_X-PRC_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Package Recieved",
    scan_type: "OT",
  },
  "R_DLYRG-130_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Region Specific Off",
    scan_type: "OT",
  },
  "R_X-DRO4R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_X-DRD1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_DLYRPC-416_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Hold as per client instrutions",
    scan_type: "OT",
  },
  "R_X-ILO2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_EOD-121_PP": {
    pickrr_sub_status_code: "NSL",
    courier_remarks: "Entry restricted area",
    scan_type: "PPF",
  },
  "R_X-DDD1FR_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
  },
  "R_DLYLH-139_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Checkpost/ Clearance Delay",
    scan_type: "OT",
  },
  "R_CL-103_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "As per client's instructions",
    scan_type: "OC",
  },
  "R_X-LM1P_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for Pickup",
    scan_type: "OFP",
  },
  "R_EOD-131_CN": {
    pickrr_sub_status_code: "OTH",
    courier_remarks: "Brand Mismatch",
    scan_type: "PPF",
  },
  "R_RD-PD4_PU": {
    pickrr_sub_status_code: "OPDEL",
    courier_remarks: "Client Wants Open Delivery",
    scan_type: "UD",
  },
  "R_EOD-68_PP": {
    pickrr_sub_status_code: "SNR",
    courier_remarks: "Request for delayed pickup",
    scan_type: "PPF",
  },
  "R_RD-PD18_PU": {
    pickrr_sub_status_code: "CNA",
    courier_remarks: "Incorrect seller information",
    scan_type: "UD",
  },
  "R_RD-PD7_PU": {
    pickrr_sub_status_code: "CR",
    courier_remarks: "Short Shipment",
    scan_type: "UD",
  },
  "R_X-DRO1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
  },
  "R_RT-111_DL": {
    pickrr_sub_status_code: "",
    courier_remarks: "DTO due to poor packaging",
    scan_type: "OC",
  },
  "R_DLYLH-106_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Flight delayed/cancelled",
    scan_type: "OT",
  },
  "R_RD-PD20_PU": {
    pickrr_sub_status_code: "CI",
    courier_remarks: "Missing invoice",
    scan_type: "UD",
  },
  "R_X-ILD0R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_X-DLL1R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
  "R_RD-PD21_PU": {
    pickrr_sub_status_code: "CR",
    courier_remarks: "Damaged packing",
    scan_type: "UD",
  },
  "R_X-ILD2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "IST received",
    scan_type: "OT",
  },
  "R_X-DDD2FR_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
  },
  "R_DLYMR-118_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Misrouted",
    scan_type: "OT",
  },
  "R_X-DDD1FP_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
  },
  "R_DLYLH-142_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Delay due to runway closure",
    scan_type: "OT",
  },
  "R_EOD-77_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "DTO/REPL: Pick Up Completed",
    scan_type: "PP",
  },
  "R_X-DDD3FP_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
  },
  "R_EOD-21_CN": {
    pickrr_sub_status_code: "CANC",
    courier_remarks: "Cancelled the pickup request",
    scan_type: "PPF",
  },
  "R_ST-112_CN": {
    pickrr_sub_status_code: "",
    courier_remarks: "Return Center is NSZ",
    scan_type: "OC",
  },
  "R_DLYDC-107_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "Office/Institute closed",
    scan_type: "OM",
  },
  "R_CL-102_PP": {
    pickrr_sub_status_code: "",
    courier_remarks: "As per client's instructions",
    scan_type: "OC",
  },
  "R_X-DLO2R_PU": {
    pickrr_sub_status_code: "",
    courier_remarks: "Added to IST",
    scan_type: "OT",
  },
};

module.exports = {
  DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER,
};
