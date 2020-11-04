import { strictEqual } from "assert";
import { ParcelLabApi, LogLevel } from "./index";

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


                it('Should split the tracking number "09445440538272Z,094454405382712" and detect both as "dpd"', () => {
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

                it('Should detect the tracking number "H1000730000834301047" as "hermes"', () => {
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
        });

    }
}

const test = new ParcelLabApiTest();
test.run();