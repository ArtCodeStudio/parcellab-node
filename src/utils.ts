/**
 * Based on https://bitbucket.org/parcellab/sdk-node/src/master/utils.js
 */

import { keys, contains } from 'underscore';

/////////////
// objects //
/////////////

/**
 * checks if object has at least all of the keys in the array, but maybe even more
 * @param obj Object to be checked
 * @param arrayOfKeys Keys to be checked for existence
 * @return true if object has all the keys of the array
 */
export const objHasKeys = (
  obj: any,
  arrayOfKeys: string[],
): { hasAllKeys: boolean; missing: string[] } => {
  let hasAllKeys = true;
  const missing: string[] = [];

  for (let i = 0; i < arrayOfKeys.length; i++) {
    if (!obj.hasOwnProperty(arrayOfKeys[i])) {
      hasAllKeys = false;
      missing.push(arrayOfKeys[i]);
    }
  }

  return {
    hasAllKeys,
    missing,
  };
};

/**
 * checks if object has only key in the array, but not necessarily all of them
 * @param obj Object to be checked
 * @param arrayOfKeys Keys to be checked
 * @return true if object has only keys contained in the array
 */
export const objHasOnlyKeys = (obj: any, arrayOfKeys: string[]) => {
  let allAllowed = true;
  const unallowed = [];

  const objKeys = keys(obj);
  for (let i = 0; i < objKeys.length; i++) {
    if (!contains(arrayOfKeys, objKeys[i])) {
      allAllowed = false;
      unallowed.push(objKeys[i]);
    }
  }

  return {
    allAllowed,
    unallowed,
  };
};

export const deleteEmptyValues = (data: any) => {
  for (const key in data) {
    if (typeof data[key] === 'undefined') {
      delete data[key];
    }
    if (typeof data[key] === 'string' && data[key].length <= 0) {
      delete data[key];
    }
    if (data[key] === null) {
      delete data[key];
    }
    if (typeof data[key] === 'object') {
      data[key] = deleteEmptyValues(data[key]);
    }
  }
  return data;
};

/**
 * Removes a substring from a string if the string ends with the substring
 * @param str String to remove the substring from the end
 * @param test The substring to remove from the string
 */
export const removeFromEnd = (str: string, test: string) => {
  return str.replace(new RegExp(test + '$'), '');
};

/**
 * Handle string, converts a string "Abc def" to "avc-def"
 * @param str
 */
export const handle = (str?: string) => {
  if (str) {
    return str.trim().toLowerCase().replace(/\s/g, '-');
  }
  return str;
};
