export default class NumberUtil {

  public static isNumeric(value: string) {
    return !isNaN(parseFloat(value)) && isFinite(value as unknown as number);
  }

}