import { Optional } from '../api/Optional';

/** Return the first 'count' letters from 'str'.
-     *  e.g. first("abcde", 2) === "ab"
-     */
export const first = function (str: string, count: number) {
  return str.substr(0, count);
};

/** Return the last 'count' letters from 'str'.
*  e.g. last("abcde", 2) === "de"
*/
export const last = function (str: string, count: number) {
  return str.substr(str.length - count, str.length);
};

export const head = function (str: string): Optional<string> {
  return str === '' ? Optional.none() : Optional.some(str.substr(0, 1));
};

export const tail = function (str: string): Optional<string> {
  return str === '' ? Optional.none() : Optional.some(str.substring(1));
};
