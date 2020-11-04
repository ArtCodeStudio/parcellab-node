import { strictEqual } from "assert";
import { ParcelLabApi } from "./index";

const user = 1;
const token = 'parcelLabAPItoken-30characters';

class ParcelLabApiTest extends ParcelLabApi {
    run() {

        describe('ParcelLabApi', () => {

            describe("multiplyOnTrackingNumber", () => {
                it("Zip should be removed from colisprivee tracking number", () => {
                    const payload = this.multiplyOnTrackingNumber({
                        courier: 'colisprivee',
                        tracking_number: 'Z6100136949933320',
                        zip_code: '33320',
                        articles: [],
                        destination_country_iso3: 'fr',
                    });

                    strictEqual(payload[0].tracking_number, 'Z61001369499');
                });


                it('Zip should split the tracking number "09445440538272Z,094454405382712" and detect them as "dpd"', () => {
                    const payload = this.multiplyOnTrackingNumber({
                        courier: 'colisprivee',
                        tracking_number: '09445440538272Z,094454405382712',
                        zip_code: '33320',
                        articles: [],
                        destination_country_iso3: 'fr',
                    });

                    strictEqual(payload.length, 2);
                    strictEqual(payload[0].tracking_number, "09445440538272Z");
                    strictEqual(payload[0].courier, "dpd");
                    strictEqual(payload[1].tracking_number, "094454405382712");
                    strictEqual(payload[1].courier, "dpd");
                });
            });
        });

    }
}

const test = new ParcelLabApiTest(user, token);
test.run();