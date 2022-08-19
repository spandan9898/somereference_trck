const PULL_PARTITION_COUNT = 10;
const PULL_GROUP_NAME = "smartr_pull_group";
const PULL_TOPIC_NAME = "smartr_pull";
const PUSH_PARTITION_COUNT = 10;
const PUSH_TOPIC_NAME = "smartr_push";
const PUSH_GROUP_NAME = "smartr-push-group";

const PULL_MAPPER = {
  "pickup attempt": { scan_type: "PPF", pickrr_sub_status_code: "" },
  "pickup attempt_pickup cancelled by shipper": { scan_type: "OC", pickrr_sub_status_code: "" },
  "pickup attempt_shipment not ready or no shipment today": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  "pickup attempt_holiday- shipper closed": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "pickup attempt_package not travel worthy; shipment hold": {
    scan_type: "PPF",
    pickrr_sub_status_code: "DAM",
  },
  "pickup attempt_pickup not done - destination pin code not serviceable": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "pickup attempt_shipment or package damaged": { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  "pickup attempt_pickup declined-prohibited content": {
    scan_type: "PPF",
    pickrr_sub_status_code: "REJ",
  },
  "pickup attempt_shipment held-regulartory paperworks required": {
    scan_type: "PPF",
    pickrr_sub_status_code: "REGU",
  },
  "pickup attempt_pickup wrongly registered by shipper": {
    scan_type: "PPF",
    pickrr_sub_status_code: "DUP",
  },
  "pickup attempt_pickup not done - contact person not available": {
    scan_type: "PPF",
    pickrr_sub_status_code: "SU",
  },
  "pickup attempt_missed pickup- reached late": { scan_type: "PPF", pickrr_sub_status_code: "NA" },
  "pickup attempt_disturbance or natural disaster or strike": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  "pickup attempt_shippers or consignee request to hold at location": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup attempt_change in product-on shippers request on fresh awb": {
    scan_type: "PPF",
    pickrr_sub_status_code: "DUP",
  },
  "pickup attempt_shipment manifested but not received by destination": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup attempt_shipment lost": { scan_type: "PPF", pickrr_sub_status_code: "LT" },
  "pickup attempt_shipment not connected-space constraint": {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  "pickup attempt_shipment returned back to shipper": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "pickup attempt_canvas bag or shipment received short": {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  "delivery attempt_residence or office closed": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CNA",
  },
  "delivery attempt_consignee refused to accept": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CR",
  },
  "delivery attempt_no such consignee at given address": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CNA",
  },
  "delivery attempt_consignee not available at given address": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CNA",
  },
  "delivery attempt_holiday:scheduled for delivery on next working day": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_shippers or consignee request to hold at location": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CI",
  },
  "delivery attempt_address incomplete or incorrect can not deliver": {
    scan_type: "NDR",
    pickrr_sub_status_code: "AI",
  },
  "delivery attempt_non serviceable area or pin code": {
    scan_type: "NDR",
    pickrr_sub_status_code: "ODA",
  },
  "delivery attempt_consignee shifted": { scan_type: "NDR", pickrr_sub_status_code: "AI" },
  "delivery attempt_shipment manifested but not received by destination": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_tender schedule expired": { scan_type: "NDR", pickrr_sub_status_code: "SD" },
  "delivery attempt_disturbance or natural disaster or strike": {
    scan_type: "NDR",
    pickrr_sub_status_code: "REST",
  },
  "delivery attempt_consignee not yet checked in": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CNA",
  },
  "delivery attempt_consignee out of station": { scan_type: "NDR", pickrr_sub_status_code: "CNA" },
  "delivery attempt_shipment lost": { scan_type: "NDR", pickrr_sub_status_code: "SD" },
  "delivery attempt_shipment destroyed or abandoned": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_shipment redirected to alternate address": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_package interchanged at org or dest": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_late arrival or scheduled for next working day delivery": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_shipment held-regulartory paperworks required": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_shipment misrouted in network": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_time constraint-scheduled for next day delivery": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_return to origin as per sop": {
    scan_type: "NDR",
    pickrr_sub_status_code: "OTH",
  },
  "delivery attempt_shipment impounded by regulatory authority": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_shipment or package damaged": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_shipment partially delivered": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_attempt in secondary address": {
    scan_type: "NDR",
    pickrr_sub_status_code: "AI",
  },
  "delivery attempt_shipment received;paperwork not received": {
    scan_type: "NDR",
    pickrr_sub_status_code: "OTH",
  },
  "delivery attempt_canvas bag or shipment received short": {
    scan_type: "NDR",
    pickrr_sub_status_code: "SD",
  },
  "delivery attempt_dod or fod or cod not ready": {
    scan_type: "NDR",
    pickrr_sub_status_code: "CNR",
  },
  booked: { scan_type: "OP", pickrr_sub_status_code: "" },
  "picked up": { scan_type: "PP", pickrr_sub_status_code: "" },
  accepted: { scan_type: "SHP", pickrr_sub_status_code: "" },
  "return to shipper": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "returned to shipper": { scan_type: "RTO", pickrr_sub_status_code: "" },
  "rto initiated": { scan_type: "RTO", pickrr_sub_status_code: "" },
  departed: { scan_type: "OT", pickrr_sub_status_code: "" },
  arrived: { scan_type: "OT", pickrr_sub_status_code: "" },
  "out for delivery": { scan_type: "OO", pickrr_sub_status_code: "" },
  delivered: { scan_type: "DL", pickrr_sub_status_code: "" },
  "door delivered": { scan_type: "DL", pickrr_sub_status_code: "" },
  voided: { scan_type: "OC", pickrr_sub_status_code: "" },
};

const CODE_MAPPER = {
  man: { scan_type: "OM", pickrr_sub_status_code: "" },
  can: { scan_type: "OC", pickrr_sub_status_code: "" },
  ofp: {
    scan_type: "OFP",
    pickrr_sub_status_code: "",
  },
  pkf_pf001: { scan_type: "PPF", pickrr_sub_status_code: "DAM" },
  pkf: { scan_type: "PPF", pickrr_sub_status_code: "" },
  pkf_pf002: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  pkf_pf003: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  pkf_pf004: { scan_type: "PPF", pickrr_sub_status_code: "OTH" },
  pkf_pf005: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NA",
  },
  pkf_pf006: {
    scan_type: "PPF",
    pickrr_sub_status_code: "REJ",
  },
  pkf_pf007: {
    scan_type: "PPF",
    pickrr_sub_status_code: "NSL",
  },
  pkf_pf008: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  pkf_pf009: { scan_type: "PPF", pickrr_sub_status_code: "SU" },
  pkf_pf010: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  pkf_pf011: {
    scan_type: "PPF",
    pickrr_sub_status_code: "CANC",
  },
  pkf_pf012: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SC",
  },
  pkf_pf013: {
    scan_type: "PPF",
    pickrr_sub_status_code: "SNR",
  },
  pkf_pf014: { scan_type: "PPF", pickrr_sub_status_code: "SNR" },
  pkf_pf015: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  pkf_pf016: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  pkf_pf017: {
    scan_type: "PPF",
    pickrr_sub_status_code: "REGU",
  },
  pkf_pf018: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  pkf_pf019: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  pkf_pf020: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  pkf_pf021: {
    scan_type: "PPF",
    pickrr_sub_status_code: "OTH",
  },
  pkd: {
    scan_type: "PP",
    pickrr_sub_status_code: "",
  },
  ind: {
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  bgd: {
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  bgu: {
    scan_type: "SHP",
    pickrr_sub_status_code: "",
  },
  dpd: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  ard: {
    scan_type: "OT",
    pickrr_sub_status_code: "",
  },
  rdc: {
    scan_type: "RAD",
    pickrr_sub_status_code: "",
  },
  ofd: {
    scan_type: "OO",
    pickrr_sub_status_code: "",
  },
  sud_ud001: {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  sud: {
    scan_type: "UD",
    pickrr_sub_status_code: "",
  },
  sud_ud002: {
    scan_type: "UD",
    pickrr_sub_status_code: "ODA",
  },
  sud_ud003: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  sud_ud004: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud005: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  sud_ud006: {
    scan_type: "UD",
    pickrr_sub_status_code: "CR",
  },
  sud_ud007: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  sud_ud008: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  sud_ud009: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  sud_ud010: {
    scan_type: "UD",
    pickrr_sub_status_code: "OTH",
  },
  sud_ud011: {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  sud_ud012: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  sud_ud013: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  sud_ud014: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud015: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud016: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud017: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud018: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud019: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud020: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud021: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud022: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud023: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud024: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud025: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud026: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud027: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud028: {
    scan_type: "UD",
    pickrr_sub_status_code: "AI",
  },
  sud_ud029: {
    scan_type: "UD",
    pickrr_sub_status_code: "SD",
  },
  sud_ud030: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNR",
  },
  sud_ud031: {
    scan_type: "UD",
    pickrr_sub_status_code: "REST",
  },
  sud_ud032: {
    scan_type: "UD",
    pickrr_sub_status_code: "CNA",
  },
  sud_ud033: {
    scan_type: "UD",
    pickrr_sub_status_code: "CI",
  },
  ddl: {
    scan_type: "DL",
    pickrr_sub_status_code: "",
  },
  rtl: {
    scan_type: "RTO",
    pickrr_sub_status_code: "",
  },
  rts: {
    scan_type: "RTO-OT",
    pickrr_sub_status_code: "",
  },
  rtd: {
    scan_type: "RTD",
    pickrr_sub_status_code: "",
  },
  lst: {
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },
  dmg: {
    scan_type: "DM",
    pickrr_sub_status_code: "",
  },
  dsd: {
    scan_type: "LT",
    pickrr_sub_status_code: "",
  },
};

const STATION_MAPPER = {
  AGR: "KHERIA",
  AGX: "AGATTI ISLAND",
  AJL: "AIZAWL",
  AKD: "AKOLA",
  BEK: "BARELI",
  BEP: "BELLARY",
  BHJ: "RUDRA MATA",
  BHO: "BHOPAL",
  BHU: "BHAVNAGAR",
  BKB: "BIKANER",
  BUP: "BHATINDA",
  CBD: "CAR NICOBAR",
  CDP: "CUDDAPAH",
  COH: "COOCH BEHAR",
  DAE: "DAPARIZO",
  DAI: "DARJEELING",
  DBD: "DHANBAD",
  DHM: "GAGGAL AIRPORT",
  DIB: "CHABUA",
  DIU: "DIU",
  DMU: "DIMAPUR",
  GAY: "GAYA",
  GOP: "GORAKHPUR",
  GUX: "GUNA",
  GWL: "GWALIOR",
  HBX: "HUBLI",
  HJR: "KHAJURAHO",
  HSS: "HISSAR",
  IMF: "MUNICIPAL",
  ISK: "GANDHINAGAR ARPT",
  IXA: "SINGERBHIL",
  IXB: "BAGDOGRA",
  IXD: "BAMRAULI",
  IXE: "BAJPE",
  IXG: "SAMBRE",
  IXH: "KAILASHAHAR",
  IXI: "LILABARI",
  IXJ: "SATWARI",
  IXK: "KESHOD",
  IXL: "LEH",
  IXM: "MADURAI",
  IXN: "KHOWAI",
  IXP: "PATHANKOT",
  IXQ: "KAMALPUR",
  IXS: "KUMBHIRGRAM",
  IXT: "PASIGHAT",
  IXU: "CHIKKALTHANA",
  IXV: "ALONG",
  IXW: "SONARI",
  IXY: "KANDLA",
  IXZ: "PORT BLAIR",
  JDH: "JODHPUR",
  JGA: "GOVARDHANPUR",
  JGB: "JAGDALPUR",
  JLR: "JABALPUR",
  JRH: "ROWRIAH",
  JSA: "JAISALMER",
  KLH: "KOLHAPUR",
  KNU: "KANPUR",
  KTU: "KOTA",
  KUU: "BHUNTAR",
  LDA: "MALDA",
  LUH: "LUDHIANA",
  MOH: "MOHANBARI",
  MYQ: "MYSORE",
  MZA: "MUZAFFARNAGAR",
  MZU: "MUZAFFARPUR",
  NAG: "SONEGAON",
  NDC: "NANDED",
  NMB: "DAMAN",
  NVY: "NEYVELI",
  PAB: "BILASPUR",
  PBD: "PORBANDAR",
  PGH: "PANTNAGAR",
  PNY: "PONDICHERRY",
  PUT: "PUTTAPRATHE",
  PYB: "JEYPORE",
  RAJ: "CIVIL",
  REV: "REV",
  REW: "REWA",
  RGH: "BALURGHAT",
  RJA: "RAJAHMUNDRY",
  RJI: "RAJOURI",
  RMD: "RAMAGUNDAM",
  RPR: "RAIPUR",
  RRK: "ROURKELA",
  RTC: "RATNAGIRI",
  RUP: "RUPSI",
  SHL: "SHILLONG",
  SLV: "SIMLA",
  SSE: "SHOLAPUR",
  SXR: "SRINAGAR",
  SXV: "SALEM",
  TEI: "TEZU",
  TEZ: "SALONIBARI",
  TIR: "TIRUPATI",
  TJV: "THANJAVUR",
  TNI: "SATNA",
  TRZ: "TIRUCHIRAPALLI",
  TVM: "Trivendram",
  UDR: "DABOK",
  VGA: "VIJAYAWADA",
  VNS: "VARANASI",
  VTZ: "VISHAKHAPATNAM",
  WGC: "WARRANGAL",
  ZER: "ZERO",
  BBI: "Bijupattnaik Airport,",
  BBIH: "BHUWANESHWAR",
  BHWP: "EJR SERVICE CENTRE",
  CCU: "Netaji Subhas Chandra Bose Int",
  CCUH: "kOLKATA HUB",
  CDBG: "DARBHANGA - CSP",
  CMFP: "MUZAFARPUR - CSP",
  DALS: "DALHOUSIE",
  IXR: "Birsa Munda Airport, Ranchi",
  IXRH: "Ranchi",
  PAT: "Jayprakash Narayan Internation",
  PATH: "PATNA SERVICE CENTRE",
  SLTL: "SALT LAKE SERVICE CENTER",
  AMRT: "AMRITSAR",
  ASKN: "Ashok Nagar",
  ATQ: "Sri Guru Ram Dass Jee Internat",
  CPLC: "Karol Bagh,Guru Gobind Singh M",
  DED: "DEHRADUN AIRPORT",
  DEDH: "DEHRADUN",
  DEL: "INDIRA GANDHI INTL",
  DELH: "Delhi Hub",
  EDLC: "EAST DELHI LOCATION",
  FDBD: "FARIDABAD",
  GOMN: "Gomti Nagar",
  GZBD: "GHAZIABAD",
  HAUZ: "HAUZ KHAS",
  IXC: "CHANDIGARH AIRPORT",
  IXCH: "CHANDIGARH HUB",
  JAI: "Jaipur International Airport",
  JAIH: "JAIPUR",
  JLND: "JALANDHAR",
  LKO: "LUCKNOW AIRPORT",
  LKOH: "LUCKNOW HUB",
  LUDI: "LUDHIANA",
  MAYA: "MAYAPURI",
  NIDA: "NOIDA SEC-1- 27",
  OKHL: "Tehkhand, Okhla Industrial Are",
  RHNI: "Hari Nagar, Maya Puri",
  RJCX: "Arjun Nagar,Basai Rd,Gurgaon,N",
  SJEX: "Gurgaon road, Kapashera, Mahip",
  SKHX: "Palam Road ,Sahraul",
  ZKPR: "Baltana",
  GAU: "BORJHAR",
  GAUH: "REHABARI OFFICE",
  ALND: "St.Thomas Mount",
  ALVA: "Cochin University",
  ANNR: "Annanagar E. Ext",
  BLR: "Kempegowda International Airpo",
  BLRH: "BENGALURU HUB",
  CALP: "ALLEPPEY - CSP",
  CCJ: "CALICUT AIRPORT",
  CCJH: "CALICUT",
  CCNN: "KANNUR - CSP",
  CHSK: "HOSKOTE",
  CJB: "COIMBATORE,PEELAMEDU",
  CJBH: "COIMBATORE",
  CKYM: "KOTTAYAM - CSP",
  CMVT: "MUVATTUPUZHA - CSP",
  CNYL: "NEYVELLI - CSP",
  COK: "KOCHI",
  COKH: "KOCHI HUB",
  CTHR: "THRISSUR - CSP",
  CTMK: "TUMKUR - CSP",
  DMLR: "EMBASSY GOLF LINK",
  HMNG: "ABIDS",
  HTCY: "MADHAPUR",
  HYD: "BEGUMPET APT",
  HYDH: "HYDERABAD HUB",
  JMLX: "TRINITY",
  JPNG: "J P NAGAR SERVICE CENTRE",
  KPHB: "KUKATPALLY HYDERABAD",
  MAA: "CHENNAI",
  MAAH: "CHENNAI HUB",
  MLRE: "MANGALORE",
  MNPL: "MANIPAL",
  MYSR: "MYSORE",
  PARY: "Chennai GPO",
  PNYX: "PEENYA",
  POND: "PUDUCHERY",
  PTRR: "Gopalapuram",
  SECB: "E.MAREDPALLY",
  SHMH: "SHAMSHABAD",
  SMGD: "SOMAJIGUDA",
  SNOL: "SEMINOL HYDERABAD",
  TRPH: "TIRUPUR",
  TRV: "TRIVENDRUM AIRPORT",
  TRVH: "TRIVENDRUM",
  UPPL: "UPPAL HYDERABAD",
  VYTL: "Vyttila",
  WTFD: "WHITEFIELD OFFICE",
  YLKA: "YELAHANKA",
  ADHR: "ANDHERI",
  AMD: "AHMEDABAD",
  AMDH: "AHMEDABAD HUB",
  AUND: "WAKDEWADI, KHADKI",
  BDQ: "VADODARA",
  BDQH: "Navapura",
  BHIW: "BHIWANDI",
  BOM: "Chhatrapati Shivaji Internatio",
  BOMH: "MUMBAI HUB",
  BOPL: "Jivaraj Park",
  BORV: "BORIVLI",
  CANK: "ANKLESHWAR - CSP",
  CHBR: "CHEMBUR",
  CJLR: "JABALPUR  - CSP",
  FORT: "FORT service centre",
  GANR: "Sabarmati",
  GOI: "DABOLIM",
  GOIH: "GOA",
  IDR: "INDORE",
  IDRH: "INDORE",
  LPRL: "LOWER PAREL",
  MULD: "MULUND",
  NGPR: "NAGPUR",
  PCAR: "CAMP, KOREGAON PARK, BUND GARD",
  PMPC: "CHINCHWAD GAON",
  PNQ: "Pune International Airport",
  PNQH: "PUNE HUB",
  SABG: "Gandhi Road",
  SATL: "Parimal Gardan",
  SNPD: "Sanpada",
  STV: "SURAT AIRPORT",
  STVH: "SURAT",
};

module.exports = {
  PULL_PARTITION_COUNT,
  PULL_GROUP_NAME,
  PULL_TOPIC_NAME,
  PULL_MAPPER,
  PUSH_PARTITION_COUNT,
  CODE_MAPPER,
  PUSH_TOPIC_NAME,
  PUSH_GROUP_NAME,
  STATION_MAPPER,
};
