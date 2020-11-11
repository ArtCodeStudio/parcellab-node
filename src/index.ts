export * from './interfaces'
export * from './params';
export * from './utils';

import params from './params';
import * as utils from './utils';
import { CourierDetector } from './courier-detector';
import { ParcellabTracking, ParcellabOrder, ParcellabSearchResponse, PayloadError, LogLevel } from './interfaces'

// modules
import got from 'got';
import { Agent } from "https";
import ø from 'validator';
import { isUndefined, isNull, isObject, isString, extend, keys } from 'underscore';
import { stringify as QueryString } from 'querystring';

/**
 * Based on https://bitbucket.org/parcellab/sdk-node/src/master/index.js
 */
export class ParcelLabApi {

  public detector = new CourierDetector();

  protected log = {
    info(...data: any[]): void {
      // Ignore
    },
    debug(...data: any[]): void {
      // Ignore
    },
    warn(...data: any[]): void {
      // Ignore
    },
    error(...data: any[]): void {
      // Ignore
    },
  }

  /**
   * @param user parcellab user
   * @param token parcellab token
   * @param autoDetectCourier disable / enable autodetection of courier by tracking number. Enabled by default
   * @param logLevel log level, info, warn and error enabled by default
   */
  constructor(protected user: number, protected token: string, protected autoDetectCourier = true, protected logLevel: LogLevel = LogLevel.Info) {

    // Validate user and token
    if (!ø.isInt(user.toString()) || token.length < 30) {
      throw new Error('Invalid user/ token combination');
    }

    // Set default value for autoDetectCourier
    if (typeof autoDetectCourier === 'undefined') {
      autoDetectCourier = true;
    }

    // Set default value for logLevel
    if (typeof logLevel === 'undefined') {
      logLevel = LogLevel.Info;
    }

    // Enable log levels
    if (this.logLevel >= LogLevel.Debug) {
      this.log.debug = console.debug;
    }
    if (this.logLevel >= LogLevel.Info) {
      this.log.info = console.info;
    }
    if (this.logLevel >= LogLevel.Warn) {
      this.log.warn = console.warn;
    }
    if (this.logLevel >= LogLevel.Error) {
      this.log.error = console.error;
    }
    
    this.user = user;
    this.token = token;
    this.autoDetectCourier = autoDetectCourier;
    this.logLevel = logLevel;
  }



  //////////////////////
  // Public Functions //
  //////////////////////

  /**
   * Creates or updates a new tracking
   * Please note: Only use this method if you have a tracking number, if you want to track a order before you have a tracking number, use `createOrUpdateOrder` instead.
   * @param payload Specifies the tracking to be created
   * @param test For testing only, if true this creates a tracking mock
   */
  public async createOrUpdateTracking(payload: ParcellabTracking, test: boolean = false): Promise<string[]> {
    payload = utils.deleteEmptyValues(payload);
    const { error, isValid, invalidKeys} = this.checkPayload(payload, 'tracking');

    if (!isValid) {
      this.log.error('invalidKeys: ' + invalidKeys);
      const err = new Error(error) as PayloadError;
      err.invalidKeys = invalidKeys;
      throw err;
    }

    const payloads = this.multiplyOnTrackingNumber(payload);
    const results: string[] = [];

    for (const payload of payloads) {
      const result = await this.postTrackingToParcelLabAPI(payload, this.user, this.token, test)
      results.push(result);
    }

    return results;
  }

  protected tackingNumberIs

  /**
   * Creates or updates a new order on the parcelLab API
   *
   * Please note: If you have used this method to track the order the first time you must also use this method to update the order,
   * also if the order has a tracking number.
   * Please not not use both methods `createOrUpdateOrder` and `createOrUpdateTracking` for the same order.
   * @param payload Specifies the order to be created
   * @param test For testing only, if true this creates a tracking mock
   */
  public async createOrUpdateOrder(payload: ParcellabOrder, test: boolean = false): Promise<string[]> {
    payload = utils.deleteEmptyValues(payload);
    const { error, isValid} = this.checkPayload(payload, 'order');

    if (!isValid) {
      throw new Error(error);
    }

    const payloads = this.multiplyOnTrackingNumber(payload);
    const results: string[] = [];

    for (const payload of payloads) {
      const result = await this.postOrderToParcelLabAPI(payload, this.user, this.token, test);
      results.push(result);
    }

    return results;
  }

  /**
   * Checking last transfer
   * @see https://how.parcellab.works/docs/integration-quick-start/creating-a-new-tracking/api#checking-last-transfer-via-api
   * @param search Any search string
   * @param page What page to show (pagination), defaults to 0
   * @param size Number of entries on a page, defaults to 24
   */
  public async search(search?: string, page?: number, size?: number): Promise<ParcellabSearchResponse> {
    const url = params.endpoint + 'v2/search/';
    const query = utils.deleteEmptyValues({ s: search, p: page, pSize: size });
    return this.get(url, query, this.user, this.token, 'json') as Promise<ParcellabSearchResponse>;
  }

  //////////////////////////
  // Dealing with payload //
  //////////////////////////

  /**
   * Checks whether a payload is valid
   * @param payload Payload to be transmitted to parcelLab API
   */
  protected checkPayload(payload: ParcellabOrder | ParcellabTracking, endpoint: 'tracking' | 'order'): { error: string | null, isValid?: boolean, invalidKeys: string[] } {
    const requiredKeys = params[endpoint].requiredKeys;
    const allowedKeys = requiredKeys.concat(params.allowedKeys);
    let isValid = true;
    let error = '';
    let invalidKeys: string[] = [];

    const keyChecker1 = utils.objHasKeys(payload, requiredKeys);
    if (keyChecker1.missing.length > 0) {
      invalidKeys = [...invalidKeys, ...keyChecker1.missing];
      isValid = false;
      error = 'Required keys missing: ' + keyChecker1.missing.join(', ');
      return { error, isValid, invalidKeys };
    }
  
    const keyChecker2 = utils.objHasOnlyKeys(payload, allowedKeys);
    if (!keyChecker2.allAllowed) {
      invalidKeys = [...invalidKeys, ...keyChecker2.unallowed];
      isValid = false;
      error = 'Used not allowed keys: ' + keyChecker2.unallowed.join(', ');
      return { error, isValid, invalidKeys };
    }

    const datachecks = params.datachecks;

    for (let i = 0; i < datachecks.email.length; i++) {
      if (!isNull(payload[datachecks.email[i]]) && !isUndefined(payload[datachecks.email[i]])) {
        const isCurValid = ø.isEmail(payload[datachecks.email[i]]);
        if (!isCurValid) {
          invalidKeys.push(datachecks.email[i]);
          error = 'Field to be required to be an email is not an email';
        }
        isValid = isValid && isCurValid;
      }
    }

    for (let j = 0; j < datachecks.number.length; j++) {
      if (!isNull(payload[datachecks.number[j]]) && !isUndefined(payload[datachecks.number[j]])) {
        const isCurValid = typeof payload[datachecks.number[j]] === 'number';
        if (!isCurValid) {
          invalidKeys.push(datachecks.number[j]);
          error = 'Field to be required to be a number is not a number';
        }
        isValid = isValid && isCurValid;
      }
    }

    for (let k = 0; k < datachecks.boolean.length; k++) {
      if (!isNull(payload[datachecks.boolean[k]]) && !isUndefined(payload[datachecks.boolean[k]])) {
        const isCurValid = (typeof payload[datachecks.boolean[k]] === 'boolean');
        if (!isCurValid) {
          invalidKeys.push(datachecks.number[k]);
          error = 'Field to be required to be a bool is not a bool';
        }
        isValid = isValid && isCurValid;
      }
    }

    return { error, isValid, invalidKeys };
  }
  
  /**
   * Checks whether the payload has multiple tracking numbers in its key
   * @param payload payload to be checked for multieple tracking numbers
   * @return String for termination of tracking number sequence or null if no multiples
   */
  protected hasMultipleTrackingNumbers(payload: ParcellabOrder | ParcellabTracking): string {
    if (isNull(payload.tracking_number)) return null;
    if (isObject(payload.tracking_number)) return 'json';
    if (Array.isArray(payload.tracking_number)) {
      return 'array';
    }
    if (isString(payload.tracking_number)) {
      const terminators = ['|', ','];
      for (let i = 0; i < terminators.length; i++) {
        if (payload.tracking_number.indexOf(terminators[i]) > -1) return terminators[i];
      }
    }
    return null;
  }
  
  /**
   * Creates an array of payloads out of a single payload with multiples in the tracking_number
   * @param payload Payload to be multiplied, with a tracking_number like so:
   *                          {ups:["1Z74845R6842887612","1Z74845R6842758029"]}
   * @return Array of payloads with single tracking numbers
   */
  protected multiplyOnTrackingNumber(payload: ParcellabOrder | ParcellabTracking): (ParcellabOrder | ParcellabTracking)[] {
    const tnos = [];
    const payloads = []; // array of new payloads
    const terminator = this.hasMultipleTrackingNumbers(payload);

    if (terminator === null) {
      const courier = payload.courier;
      const tracking_number = payload.tracking_number;
      tnos.push({
        courier,
        tracking_number
      });
    } else if (terminator === 'json') {
      const json = payload.tracking_number;
      const jsonCouriers = keys(json);
      for (let k = 0; k < jsonCouriers.length; k++) {
          const courier = jsonCouriers[k];
          const jsonTnos = json[jsonCouriers[k]];
          for (let l = 0; l < jsonTnos.length; l++) {
              tnos.push({
                  courier,
                  tracking_number: jsonTnos[l]
              });
          }
      }
    } else if (terminator === 'array') {
      const tracking_numbers = payload.tracking_number as string[];
      for (const tracking_number of tracking_numbers) {
        const courier = payload.courier;
        tnos.push({
          courier,
          tracking_number,
        });
      }
    } else if (terminator.length === 1) {
      const tnos_raw = (payload.tracking_number as string).split(terminator);
      for (let j = 0; j < tnos_raw.length; j++) {
        const courier = payload.courier;
        const tracking_number = tnos_raw[j];
        tnos.push({
          courier,
          tracking_number,
        });
      }
    }

    for (let i = 0; i < tnos.length; i++) {
      const newPayload = extend({}, payload) as ParcellabOrder | ParcellabTracking;
      newPayload.courier = this.guessCourier(tnos[i].courier, payload);
      newPayload.tracking_number = tnos[i].tracking_number;

      if (typeof newPayload.tracking_number === 'string') {

        if (this.autoDetectCourier) {
          const detectedCouriers = this.detector.getCouriers(newPayload.tracking_number);

          if (detectedCouriers.length <= 0) {
            this.log.warn(`[${newPayload.client}] Can't validate courier "${newPayload.courier}" for tracking number "${newPayload.tracking_number}" and order number "${newPayload.orderNo}", please create pull request or issue on https://github.com/ArtCodeStudio/parcellab-node to add support for this courier in pacellab-node or ignore this message if everything works for you.`);
          } else {
            const index = detectedCouriers.indexOf(newPayload.courier);
            if (index === -1) {
              const detectedCourier = detectedCouriers[0];
              this.log.warn(`[${newPayload.client}] Wrong courier code "${newPayload.courier}" for tracking number "${newPayload.tracking_number}" and order number "${newPayload.orderNo}" detected, courier code corrected to "${detectedCourier}. If this is the wrong courier, disable the automatic detection, create a pull request or issue to correct this on https://github.com/ArtCodeStudio/parcellab-node`);
              newPayload.courier = detectedCourier;
            } else {
              this.log.info(`[${newPayload.client}] Courier code "${newPayload.courier}" is valid`);
            }
          }
        }

        // Special case for Colis Prive, remove zip from the end of the tracking code
        if (newPayload.courier === "colisprivee" && payload.zip_code) {
          newPayload.tracking_number = utils.removeFromEnd(newPayload.tracking_number, payload.zip_code)
        }
      }

      payloads.push(newPayload);
    }

    return payloads;
  }
  
  /**
   * Retrieves courier code from mappings for given courier name if available
   * @param input Name of courier as given by input
   * @param destinationCountryIso3
   * @return Mapping to actual courier code
   */
  protected guessCourier(courier: string, payload: ParcellabOrder | ParcellabTracking): string | undefined {
    if (!courier) {
      return courier;
    }
    courier = utils.handle(courier);

    let localeCode = payload.destination_country_iso3 || payload.language_iso3;

    if (params.couriersAppendCountry.includes(courier) && localeCode) {
      localeCode = localeCode.toLowerCase();
      const newOutput = `${courier}-${localeCode}`;

      // Only append localeCode if the resulting courier is known
      if(params.couriers[newOutput]) {
        this.log.warn(`Append country code "${localeCode}" to courier "${courier}": "${newOutput}", please check if this is the correct courier code ${payload.tracking_number ? `for tracking number "${payload.tracking_number}"` : ''}, if not append the country code by your self before you send them to parcellab.`);
        courier = newOutput;
      }
      
    }

    const knownInputs = keys(params.couriers);
    if (knownInputs.indexOf(courier) > -1) {
      courier = params.couriers[courier];
    } else {
      this.log.warn('Unknown courier: ' + courier);
    }

    courier = utils.handle(courier);

    return courier;
  }
  
  ////////////////
  // API Access //
  ////////////////
  
  /**
   * Posts a new tracking to the parcelLab API to be tracked
   * @see https://how.parcellab.works/docs/integration-quick-start/creating-a-new-tracking/api
   * 
   * @param payload Payload to be transmitted to parcelLab API
   * @param user
   * @param token
   * @param test For testing only, if true this creates a tracking mock
   */
  protected async postTrackingToParcelLabAPI(payload: ParcellabOrder | ParcellabTracking, user: number, token: string, test: boolean) {
    this.log.debug('postTrackingToParcelLabAPI', payload);
    
    let url: string;
    if (test) {
      url = params.mockEndpoint + 'track/';
    } else {
      url = params.endpoint + 'track/';
    }

    const res = await this.post(url, payload, user, token);

    if (test) {
      const mock = await this.validateMostRecentTracking(this.user, this.token);
      this.log.debug("postTrackingToParcelLabAPI mock", mock);
    }

    return res;
  }

  /**
   * Posts a new tracking to the parcelLab API to be tracked
   * @see https://how.parcellab.works/docs/integration-quick-start/creating-a-new-order/api
   * 
   * @param payload Payload to be transmitted to parcelLab API
   * @param user
   * @param token
   * @param test For testing only, if true this creates a tracking mock
   */
  protected async postOrderToParcelLabAPI(payload: ParcellabOrder | ParcellabTracking, user: number, token: string, test: boolean) {
    this.log.debug('postOrderToParcelLabAPI', payload);
    
    let url: string;
    if (test) {
      url = params.mockEndpoint + 'presage/';
    } else {
      url = params.endpoint + 'presage/';
    }

    return this.post(url, payload, user, token);
  }

  /**
   * You can view your most request to the mock endpoint for 3 hours after you placed your request by calling the same route with the GET method. For your convenience, user and token can be placed as URL query parameters.
   */
  protected async validateMostRecentTracking(user: number, token: string) {
    const url = params.mockEndpoint + 'track/';
    return this.get(url, { user, token}, user, token);
  }

  /**
   * Make a http POST request
   * @param url The url you want to make the request to
   * @param data The data object which you want to transfer in the body of the post request
   * @param user parcelLab user id
   * @param token parcelLab token
   * @param responseType The response type, by default 'text'
   */
  protected async post(url: string, data: any, user: number, token: string, responseType = 'text'): Promise<any> {
    return this.request('post', url, data, user, token, responseType);
  }

  /**
   * Make a http GET request
   * @param url The url you want to make the request to
   * @param params The query string parameter values
   * @param user parcelLab user id
   * @param token parcelLab token
   * @param responseType The response type, by default 'text'
   */
  protected async get(url: string, params: any, user: number, token: string, responseType = 'text'): Promise<any> {
    return this.request('get', url, params, user, token, responseType);
  }

  /**
   * Make a http request
   * @param url 
   * @param params 
   * @param user 
   * @param token 
   * @param responseType 
   */
  protected async request(method: 'post' | 'get', url: string, data: any = {}, user: number, token: string, responseType = 'text'): Promise<string> {
    // prepare request
    const httpsAgent = new Agent({
      rejectUnauthorized: false
    });

    // GET request can't have a body, so we convert the data to a query string
    if (method === 'get') {
      const queryStr = QueryString(data);
      url = url + (queryStr && queryStr.length > 0 ? "?" + queryStr : "");
    }

    this.log.debug('request url ' + method, url);

    const gotOptions = {
      agent: {
        https: httpsAgent
      },
      https: {
        rejectUnauthorized: false
      },
      json: method === 'post' ? data : undefined,
      responseType,
      headers: {
        // 'Content-Type': 'application/json',
        'user': user.toString(),
        'token': token.toString()
      },
      retry: 3
    };

    const res = await got[method](url, gotOptions as any);
    return res.body;
  }
}

export default ParcelLabApi;
