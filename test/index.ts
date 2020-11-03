import { ParcelLabApi } from "../src/index";

const user = 1;
const token = 'parcelLabAPItoken-30characters';

class ParcelLabApiTest extends ParcelLabApi {
    run() {
        // Zip should be removed from colisprivee tracking number
        const payload = this.multiplyOnTrackingNumber({
            courier: 'colisprivee',
            tracking_number: 'Z6100126949933320',
            zip_code: '33320',
            articles: [],
            destination_country_iso3: 'fr',
        });

        if (payload[0].tracking_number === 'Z61001269499') {
            console.log("Ok");
        } else {
            throw new Error(`tracking_number should be "Z61001269499" but is "${payload[0].tracking_number}"`);
        }
    }
}

const test = new ParcelLabApiTest(user, token);
test.run();