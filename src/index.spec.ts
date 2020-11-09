import { strictEqual } from "assert";
import { ParcelLabApi, LogLevel, ParcellabOrder, ParcellabTracking } from "./index";

const user = 1;
const token = 'parcelLabAPItoken-30characters';

class ParcelLabApiTest extends ParcelLabApi {

    constructor() {
        super(user, token, true, LogLevel.None)
    }

    run() {

        describe('ParcelLabApi', () => {

            describe("multiplyOnTrackingNumber", () => {
                it("Zip should be removed from colisprivee tracking number", () => {
                    const payload = this.multiplyOnTrackingNumber({
                        courier: 'colisprivee',
                        tracking_number: 'Z6100136949912345',
                        zip_code: '12345',
                        articles: [],
                        destination_country_iso3: 'fr',
                    });

                    strictEqual(payload.length, 1);
                    strictEqual(payload[0].tracking_number, 'Z61001369499');
                });


                it('Should split the tracking number "09445440538272Z,094454405382712" and detect both as "dpd-de"', () => {
                    const payload = this.multiplyOnTrackingNumber({
                        courier: 'colisprivee',
                        tracking_number: '09445440538272Z,094454405382712',
                        zip_code: '33320',
                        articles: [],
                        destination_country_iso3: 'fr',
                    });

                    strictEqual(payload.length, 2);
                    strictEqual(payload[0].tracking_number, "09445440538272Z");
                    strictEqual(payload[0].courier, "dpd-de");
                    strictEqual(payload[1].tracking_number, "094454405382712");
                    strictEqual(payload[1].courier, "dpd-de");
                });

                it('Should detect the tracking number "H1000730000834301047" as "hermes-de"', () => {
                    const payload = this.multiplyOnTrackingNumber({
                        courier: 'dhl',
                        tracking_number: 'H1000730000834301047',
                        zip_code: '12345',
                        articles: [],
                        destination_country_iso3: 'us',
                    });

                    strictEqual(payload.length, 1);
                    strictEqual(payload[0].tracking_number, "H1000730000834301047");
                    strictEqual(payload[0].courier, "hermes-de");
                });

            });


            describe("checkPayload", () => {
                it('Should return missing "orderNo" key for "order" endpoint', () => {
                    const orderPayload = {} as ParcellabOrder;
                    const result = this.checkPayload(orderPayload, 'order');
                    strictEqual(result.isValid, false);
                    strictEqual(result.error, 'Required keys missing: orderNo');
                    strictEqual(result.invalidKeys.length, 1);
                    strictEqual(result.invalidKeys[0], 'orderNo');
                });

                it('Should return all missing keys for "tracking" endpoint', () => {
                    const trackingPayload = {} as ParcellabTracking;
                    const result = this.checkPayload(trackingPayload, 'tracking');
                    strictEqual(result.isValid, false);
                    strictEqual(result.error, 'Required keys missing: tracking_number, courier, zip_code, destination_country_iso3');
                    strictEqual(result.invalidKeys.length, 4);
                    strictEqual(result.invalidKeys[0], 'tracking_number');
                    strictEqual(result.invalidKeys[1], 'courier');
                    strictEqual(result.invalidKeys[2], 'zip_code');
                    strictEqual(result.invalidKeys[3], 'destination_country_iso3');
                });

                it('Should return missing keys "zip_code" and "destination_country_iso3" for "tracking" endpoint', () => {
                    const trackingPayload = {
                        tracking_number: "123456",
                        courier: "abc"
                    } as ParcellabTracking;
                    const result = this.checkPayload(trackingPayload, 'tracking');
                    strictEqual(result.isValid, false);
                    strictEqual(result.error, 'Required keys missing: zip_code, destination_country_iso3');
                    strictEqual(result.invalidKeys.length, 2);
                    strictEqual(result.invalidKeys[0], 'zip_code');
                    strictEqual(result.invalidKeys[1], 'destination_country_iso3');
                });

                it('Should return missing keys "zip_code" for "tracking" endpoint', () => {
                    const trackingPayload = {
                        tracking_number: "123456",
                        courier: "abc",
                        destination_country_iso3: "jp",
                    } as ParcellabTracking;
                    const result = this.checkPayload(trackingPayload, 'tracking');
                    strictEqual(result.isValid, false);
                    strictEqual(result.error, 'Required keys missing: zip_code');
                    strictEqual(result.invalidKeys.length, 1);
                    strictEqual(result.invalidKeys[0], 'zip_code');
                });

                it('Should be valid for "order" endpoint', () => {
                    const orderPayload: ParcellabOrder = {
                        orderNo: '12345'
                    };
                    const result = this.checkPayload(orderPayload, 'order');
                    strictEqual(result.isValid, true);
                });

                it('Should be valid for "tracking" endpoint', () => {
                    const trackingPayload: ParcellabTracking = {
                        tracking_number: "123456",
                        courier: "abc",
                        destination_country_iso3: "jp",
                        zip_code: "1234",
                        articles: [],
                    };
                    const result = this.checkPayload(trackingPayload, 'tracking');
                    strictEqual(result.isValid, true);
                });
            });
        });

    }
}

const test = new ParcelLabApiTest();
test.run();