export default class StringUtil {
  public static capitalize(text: string): string {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1);
  }
}
