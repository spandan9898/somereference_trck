const DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER = {
  "fmofp-101_ud": {
    courier_remark: "Out for Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "fmeod-101_ud": {
    courier_remark: "Incomplete shipper pickup address and shipper not contactable",
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "fmeod-102_ud": {
    courier_remark: "Pick up Attempted within window and shipment not ready",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "fmeod-103_ud": {
    courier_remark: "Shipper is closed",
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  "fmeod-104_ud": {
    courier_remark: "Vehicle breakdown",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fmeod-106_ud": {
    courier_remark: "Pickup not attempted",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fmeod-107_ud": {
    courier_remark: "Damaged Package",
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  "fmeod-108_ud": {
    courier_remark: "Vehicle capacity constraint",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "fmeod-109_ud": {
    courier_remark: "Improper / missing regulatory paper work",
    scan_type: "PPF",
    pickrr_sub_status_code: "REGU",
  },
  "fmeod-111_ud": {
    courier_remark: "Pickup request schedule but no request from shipper",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "fmeod-112_ud": {
    courier_remark: "Duplicate pickup request",
    scan_type: "PPF",
    pickrr_sub_status_code: "DUP",
  },
  "fmeod-110_ud": {
    courier_remark: "Vendor Shifted",
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "fmeod-118_ud": {
    courier_remark: "Seller cancelled order",
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  "x-uci_ud": {
    courier_remark: "Consignment Manifested",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "pnp-101_ud": {
    courier_remark: "Package not picked/received from client'",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "x-pnp_ud": {
    courier_remark: "Package not picked/recieved from client'",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "x-ppom_ud": {
    courier_remark: "Shipment Picked Up from Client Location'",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "x-pponm_ud": {
    courier_remark: "Shipment Picked Up from Client Location but Data Not Recieved'",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "x-prom_ud": {
    courier_remark: "Shipment Picked Up at Origin Center'",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  "x-pronm_ud": {
    courier_remark: "Shipment Picked Up at Origin Center but Data Not Recieved'",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  "x-piom_ud": {
    courier_remark: "Shipment Recieved at Origin Center'",
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  "x-ibd3f_ud": {
    courier_remark: "Received at destination city",
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  "x-ibd1f_ud": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ddd3fd_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x- lm1d_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddd3f_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddd2fd_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddd4fd_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddo3f_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddd1fd_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddd1lf_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-ddd3lf_ud": {
    courier_remark: "Out for delivery",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "eod-600_dl": {
    courier_remark: "Delivered to Courier",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-141_dl": {
    courier_remark: "Delivered to consignee - OTP & QR Verified Delivery",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-145_dl": {
    courier_remark: "Delivered to consignee - QR Verified",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-135_dl": {
    courier_remark: "Delivered to consignee - OTP Verified delivery",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-143_dl": {
    courier_remark: "Delivered to others as instructed by consignee - QR Verified",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-37_dl": {
    courier_remark: "Delivered at Mailroom/Security",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-136_dl": {
    courier_remark: "Delivered without verification",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-144_dl": {
    courier_remark: "Delivered at Mailroom/Security - QR Verified",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-38_dl": {
    courier_remark: "Delivered to consignee",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-36_dl": {
    courier_remark: "Delivered to other as instructed by consignee",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "sc-101_dl": {
    courier_remark: "Delivered to consignee [Self Collect]",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "eod-40_ud": {
    courier_remark: "Payment Mode / Amt Dispute",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "eod-43_ud": {
    courier_remark: "Self Collect",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "eod-3_ud": {
    courier_remark: "Asked to reschedule on",
    scan_type: "UD",
    pickrr_sub_status_code: "CD",
  },
  "eod-6_ud": {
    courier_remark: "Customer Refused to accept/Order Cancelled",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "eod-69_ud": {
    courier_remark: "Customer asked for open delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "eod-134_ud": {
    courier_remark: "Consignee asked for card/wallet on delivery payment",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "eod-105_ud": {
    courier_remark: "Consignment seized by consignee",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "eod-104_ud": {
    courier_remark: "Entry restricted area",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "eod-86_ud": {
    courier_remark: "Not attempted",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "eod-15_ud": {
    courier_remark: "Consignee moved/shifted",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "eod-11_ud": {
    courier_remark: "Consignee unavailable",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "eod-16_ud": {
    courier_remark: "Payment not ready with customer",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "eod-133_ud": {
    courier_remark: "Cheque Data Incorrect",
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  "eod- 146_ud": {
    courier_remark: "No Id Proof",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "eod-111_ud": {
    courier_remark: "Consignee opened the package and refused to accept",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "eod-74_ud": {
    courier_remark: "Bad/Incomplete Address",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "sc-102_ud": {
    courier_remark: "ODA Shipments",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "sc-103_ud": {
    courier_remark: "Self Collect requested by customer",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "sc-106_ud": {
    courier_remark: "Package marked for self collect",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "sc-104_ud": {
    courier_remark: "Bad Address",
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  "x-sc_ud": {
    courier_remark: "Reached out to customer for Self Collect",
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  "covid19 - 001_ud": {
    courier_remark: "Corona Containment /hotspot area",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 002_ud": {
    courier_remark: "Corona No E-Passes",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 003_ud": {
    courier_remark: "Corona Police Shut Down",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 004_ud": {
    courier_remark: "Corona Limited Dispatch Timings",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 005_ud": {
    courier_remark: "Corona No Forward Vehicle Pass",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 006_ud": {
    courier_remark: "Corona Manpower Shortage",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 007_ud": {
    courier_remark: "Corona Client Closed",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 011_ud": {
    courier_remark: "Shipment moved In Red Zone",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "covid19 - 012_ud": {
    courier_remark: "Shipment moved out of Red Zone",
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  "x-dlo2f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld1f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo1f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld0f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dll0f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dll2f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dll1f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld2f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "cs-101_ud": {
    courier_remark: "Inbound against permanent connection [custody scan]",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo0f_ud": {
    courier_remark: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo1f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ill1f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo0f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ild0f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ill2f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo2f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ild1f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ill0f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ild2f_ud": {
    courier_remark: "IST Received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld1r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo1r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dld0r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dll2r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dll0r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo0r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dll1r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dld4r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dld2r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo2r_rt": {
    courier_remark: "Added to IST",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ild2r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ild1r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo1r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ild0r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo0r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ill0r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ill2r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ill1r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo2r_rt": {
    courier_remark: "IST received",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ibd4r_rt": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ibd1r_rt": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ibd3r_rt": {
    courier_remark: "Bag incoming at destination city",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-dro4r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-drd4r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-dro2r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-drd2r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-drd1r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-dro1r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-drd3r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "x-dro3r_rt": {
    courier_remark: "Dispatched for RTO",
    scan_type: "RTO-OO",
    pickrr_sub_status_code: "",
  },
  "rd-pd4_rt": {
    courier_remark: "Client Wants Open Delivery",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd12_rt": {
    courier_remark: "Damaged content",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd7_rt": {
    courier_remark: "Short Shipment",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd8_rt": {
    courier_remark: "Soft data not available with client",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd10_rt": {
    courier_remark: "Content mismatch",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd11_rt": {
    courier_remark: "Content missing",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd17_rt": {
    courier_remark: "Not attempted",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd18_rt": {
    courier_remark: "Incorrect seller information",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd15_rt": {
    courier_remark: "Client capacity constraint",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd3_rt": {
    courier_remark: "Client/ Seller closed",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd20_rt": {
    courier_remark: "Missing invoice",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd21_rt": {
    courier_remark: "Damaged packing",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rd-pd22_rt": {
    courier_remark: "Closure Delay",
    scan_type: "RTO UD",
    pickrr_sub_status_code: "",
  },
  "rt-110_dl": {
    courier_remark: "RTO due to poor packaging",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "rd-ac1_dl": {
    courier_remark: "RTO/DTO Delivered",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "rd-ac_dl": {
    courier_remark: "RETURN Accepted",
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  "dlyrg-125_rt": {
    courier_remark: "Delay due to Disturbance/Strike",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-109_rt": {
    courier_remark: "Vehicle Breakdown",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-124_rt": {
    courier_remark: "Consignment being inspected for duty",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-106_rt": {
    courier_remark: "Flight delayed/cancelled",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlymr-118_rt": {
    courier_remark: "Misrouted",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-130_rt": {
    courier_remark: "Region Specific Off",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-104_rt": {
    courier_remark: "Flight cancelled",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-416_rt": {
    courier_remark: "Hold as per client instrutions",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-127_rt": {
    courier_remark: "Documentation from shipper is insufficient",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-133_rt": {
    courier_remark: "Air Offload - Capacity constraint",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-115_rt": {
    courier_remark: "Air Offload - Security constraint",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-120_rt": {
    courier_remark: "Under inspection by regulatory authorities",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-419_rt": {
    courier_remark: "Not dispatched due to client schedule",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-417_rt": {
    courier_remark: "Physical address doesn't match the soft data",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-102_rt": {
    courier_remark: "Natural Disaster",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-132_rt": {
    courier_remark: "Out of Delivery Area (ODA)",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-107_rt": {
    courier_remark: "Office/Institute closed",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-142_rt": {
    courier_remark: "Delay due to runway closure",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-101_rt": {
    courier_remark: "Heavy Rain/ Fog",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-139_rt": {
    courier_remark: "Checkpost/ Clearance Delay",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "doff-128_rt": {
    courier_remark: "Surface Transit Delay",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-135_rt": {
    courier_remark: "Held for Transit Pass",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "rt-106_rt": {
    courier_remark: "Packaging intact, content mismatch/missing from client at Origin",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "rt-101_rt": {
    courier_remark: "Returned as per Client Instructions",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "rt-113_rt": {
    courier_remark: "Returned as per Security Instructions",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "rt-107_rt": {
    courier_remark: "Unsuccessful NDR Reattempt",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "rt-109_rt": {
    courier_remark: "Returned due to poor packaging",
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  "x-ddd3fp_pp": {
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-asp_pp": {
    courier_remarks: "Auto scheduled",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "eod-77_pu": {
    courier_remarks: "DTO/REPL: Pick Up Completed",
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  "x-nsz_ud": {
    courier_remark: "Non-serviceable location",
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "eod-21_cn": {
    courier_remarks: "Cancelled the pickup request",
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  "eod-68_pp": {
    courier_remarks: "Request for delayed pickup",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "fmeod-152_ud": {
    courier_remark: "Shipment not ready for pickup",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "eod-73_pp": {
    courier_remarks: "Bad/Incomplete address",
    scan_type: "PPF",
    pickrr_sub_status_code: "AI",
  },
  "eod-26_pp": {
    courier_remarks: "Consignee unavailable",
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  "eod-121_pp": {
    courier_remarks: "Entry restricted area",
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "eod-6o_rt": {
    courier_remark: "OTP verified cancellation",
    scan_type: "UD",
    pickrr_sub_status_code: "CR-OTP",
  },
  "x-dbl1f_ud": {
    courier_remark: "Added to Bag",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-125_ud": {
    courier_remark: "Delay due to Disturbance/Strike",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-109_ud": {
    courier_remark: "Vehicle Breakdown",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-124_ud": {
    courier_remark: "Consignment being inspected for duty",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-106_ud": {
    courier_remark: "Flight delayed/cancelled",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlymr-118_ud": {
    courier_remark: "Misrouted",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-104_ud": {
    courier_remark: "Flight cancelled",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "rt-104_ud": {
    courier_remark: "Shipment Damaged",
    scan_type: "DM",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-416_ud": {
    courier_remark: "Hold as per client instrutions",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-127_ud": {
    courier_remark: "Documentation from shipper is insufficient",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-133_ud": {
    courier_remark: "Air Offload - Capacity constraint",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-115_ud": {
    courier_remark: "Air Offload - Security constraint",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-120_ud": {
    courier_remark: "Under inspection by regulatory authorities",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-419_ud": {
    courier_remark: "Not dispatched due to client schedule",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-417_ud": {
    courier_remark: "Physical address doesn't match the soft data",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-102_ud": {
    courier_remark: "Natural Disaster",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-142_ud": {
    courier_remark: "Delay due to runway closure",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-132_ud": {
    courier_remark: "Out of Delivery Area (ODA)",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-107_ud": {
    courier_remark: "Office/Institute closed",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-101_ud": {
    courier_remark: "Heavy Rain/ Fog",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "doff-128_ud": {
    courier_remark: "Surface Transit Delay",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-135_ud": {
    courier_remark: "Held for Transit Pass",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "s-mar_ud": {
    courier_remark: "Package marked for movement by Surface",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-139_ud": {
    courier_remark: "Checkpost/ Clearance Delay",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-416_ud": {
    courier_remark: "Hold as per client instrutions",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyfm-102_ud": {
    courier_remark: "Hold as per client Instructions (FM)",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "pnp-102_ud": {
    courier_remark: "Pickup Dispute - PNPR Initiated",
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "eod-137_ud": {
    courier_remark: "OTP code mismatch",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "eod-138_ud": {
    courier_remark: "OTP not available",
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  "lt-100_lt": {
    courier_remark: "Shipment Lost",
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },
  "dlydg-119_pu": {
    courier_remark: "Shipment Damaged",
    scan_type: "DM",
    pickrr_status_code: "",
  },
  "x-uco_pp": {
    courier_remarks: "Received soft data for consignment",
    scan_type: "OP",
    pickrr_sub_status_code: "",
  },
  "cl-101_pp": {
    courier_remarks: "As per client's instructions",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "x-ddd1fp_pp": {
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-ddd2fp_pp": {
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-ddd4fp_pp": {
    courier_remarks: "Out for pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-ddd4fr_pp": {
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-ddd2fr_pp": {
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-ddd1fr_pp": {
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-ddd3fr_pp": {
    courier_remarks: "Out for Delivery and Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "x-lm1p_pp": {
    courier_remarks: "Out for Pickup",
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  "eod-84_cn": {
    courier_remarks: "Product description mismatch",
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "eod-131_cn": {
    courier_remarks: "Brand Mismatch",
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "eod-132_cn": {
    courier_remarks: "Colour Mismatch",
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "eod-95_cn": {
    courier_remarks: "Damaged/Used product",
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  "eod-106_cn": {
    courier_remarks: "Reached Maximum attempt count",
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "eod-108_cn": {
    courier_remarks: "Product count mismatch",
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "eod-65_pp": {
    courier_remarks: "Not attempted",
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "st-109_cn": {
    courier_remarks: "Out of service area",
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  "st-112_cn": {
    courier_remarks: "Return Center is NSZ",
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  "x-prc_pu": {
    courier_remarks: "Package Recieved",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld1r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dll2r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dll0r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld0r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo0r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dll1r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dld2r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-dlo2r_pu": {
    courier_remarks: "Added to IST",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ild2r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ild1r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ild0r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo1r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo0r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ill2r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ill0r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ill1r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ilo2r_pu": {
    courier_remarks: "IST received",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "x-ibd4r_pu": {
    courier_remarks: "Bag incoming at return city RPC",
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  "x-ibd3r_pu": {
    courier_remarks: "Bag incoming at return city DC",
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  "x-ibd1r_pu": {
    courier_remarks: "Bag incoming at return city PC",
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  "x-dro2r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-drd2r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-drd1r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-drd4r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-dro1r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-dro4r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-drd3r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "x-dro3r_pu": {
    courier_remarks: "Dispatched for DTO",
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  "rd-pd4_pu": {
    courier_remarks: "Client Wants Open Delivery",
    scan_type: "UD",
    pickrr_sub_status_code: "OPDEL",
  },
  "rd-pd12_pu": {
    courier_remarks: "Damaged content",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "rd-pd7_pu": {
    courier_remarks: "Short Shipment",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "rd-pd8_pu": {
    courier_remarks: "Soft data not available with client",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "rd-pd10_pu": {
    courier_remarks: "Content mismatch",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "rd-pd11_pu": {
    courier_remarks: "Content missing",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "rd-pd17_pu": {
    courier_remarks: "Not attempted",
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  "rd-pd18_pu": {
    courier_remarks: "Incorrect seller information",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "rd-pd15_pu": {
    courier_remarks: "Client capacity constraint",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "rd-pd3_pu": {
    courier_remarks: "Client/ Seller closed",
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  "rd-pd20_pu": {
    courier_remarks: "Missing invoice",
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  "rd-pd21_pu": {
    courier_remarks: "Damaged packing",
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  "cl-105_pu": {
    courier_remarks: "Reversal of Return closure",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "rt-111_dl": {
    courier_remarks: "DTO due to poor packaging",
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  "cl-102_pp": {
    courier_remarks: "As per client's instructions",
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  "cl-103_pp": {
    courier_remarks: "As per client's instructions",
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
  "rd-ac_dto": {
    courier_remarks: "RETURN Accepted",
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  "dlyrg-125_pu": {
    courier_remarks: "Delay due to Disturbance/Strike",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-109_pu": {
    courier_remarks: "Vehicle Breakdown",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-124_pu": {
    courier_remarks: "Consignment being inspected for duty",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-106_pu": {
    courier_remarks: "Flight delayed/cancelled",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlymr-118_pu": {
    courier_remarks: "Misrouted",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-130_pu": {
    courier_remarks: "Region Specific Off",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-104_pu": {
    courier_remarks: "Flight cancelled",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-416_pu": {
    courier_remarks: "Hold as per client instrutions",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-127_pu": {
    courier_remarks: "Documentation from shipper is insufficient",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-133_pu": {
    courier_remarks: "Air Offload - Capacity constraint",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-115_pu": {
    courier_remarks: "Air Offload - Security constraint",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrg-120_pu": {
    courier_remarks: "Under inspection by regulatory authorities",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-419_pu": {
    courier_remarks: "Not dispatched due to client schedule",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlyrpc-417_pu": {
    courier_remarks: "Physical address doesn't match the soft data",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlydc-102_pp": {
    courier_remarks: "Natural Disaster",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "dlydc-107_pp": {
    courier_remarks: "Office/Institute closed",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "dlydc-101_pp": {
    courier_remarks: "Heavy Rain/ Fog",
    scan_type: "OM",
    pickrr_sub_status_code: "",
  },
  "doff-128_pu": {
    courier_remarks: "Surface Transit Delay",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-139_pu": {
    courier_remarks: "Checkpost/ Clearance Delay",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "dlylh-142_pu": {
    courier_remarks: "Delay due to runway closure",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "eod-140_pu": {
    courier_remarks: "Shipments Count Mismatch",
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  "cl-107_cn": {
    courier_remarks: "Closed Reverse Pickup",
    scan_type: "OC",
    pickrr_sub_status_code: "",
  },
};
const TOTAL_TOPIC_COUNT = 8;

module.exports = {
  DELHIVERY_NSL_CODE_TO_STATUS_TYPE_MAPPER,
  TOTAL_TOPIC_COUNT,
};
