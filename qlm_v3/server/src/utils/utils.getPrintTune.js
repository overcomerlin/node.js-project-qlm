export default function getPrintTune(args) {
  return {
    BUS_NAME: [args[0], args[1], args[2]],
    BUS_ID: [args[3], args[4], args[5]],
    VEH_CODE: [args[6], args[7], args[8]],
    MODEL_SN: [args[9], args[10], args[11]],
    BUS_VSCC: [args[12], args[13], args[14]],
    PUBLISH_DATE: [args[15], args[16], args[17]],
    NEXT_DATE: [args[18], args[19], args[20]],
  };
}
