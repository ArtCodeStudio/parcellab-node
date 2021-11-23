import { ParcelLabApi } from '../src/index'
import { ParcellabOrder, ParcellabTracking } from '../src/interfaces'

const user = 1;
const token = 'parcelLabAPItoken-30characters';

const payloadTrackingExample1: ParcellabTracking = {
    courier: 'dhl-germany',
    tracking_number: '1234567890',
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    cashOnDelivery: 102.3,
    complete: true,
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel',
        }
    ]
};

const payloadTrackingExample2: ParcellabTracking = {
    courier: 'dhl-germany',
    // You can pass multiple tracking numbers separated with "|"
    tracking_number: '1234567890|0987654321',
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    cashOnDelivery: 102.3,
    complete: true,
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel',
        }
    ]
};

const payloadTrackingExample3: ParcellabTracking = {
    courier: 'dhl-germany',
    // You can also pass multiple tracking numbers as an array
    tracking_number: ['1234567890', '0987654321'],
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    cashOnDelivery: 102.3,
    complete: true,
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel',
        }
    ]
};


const payloadTrackingExample4: ParcellabTracking = {
    courier: 'xxx',
    // You can also pass multiple tracking numbers with different couriers
    tracking_number: {ups: ["1Z74845R6842887612", "1Z74845R6842758029"], dhl: ["003400012321343"]}, 
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel',
        }
    ]
};

const payloadOrderExample1: ParcellabOrder = {
    orderNo: 'od12345678',
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel',
        }
    ]
};


const start = async () => {
    const pl = new ParcelLabApi(user, token);

    // Use createTracking if you have a tracking number an a courier from the beginning
    try {
        const result1 = await pl.createTracking(payloadTrackingExample1);
        console.log(result1);
        const result2 = await pl.createTracking(payloadTrackingExample2);
        console.log(result2);
        const result3 = await pl.createTracking(payloadTrackingExample3);
        console.log(result3);
        const result4 = await pl.createTracking(payloadTrackingExample4);
        console.log(result4);
    } catch (error) {
        console.error("Error on transfer tracking", error);
    }

    // Use createOrUpdateOrder if you want to transfer the tracking number or courier later,
    // as soon as you have the tracking number you must use the same method and not createTracking
    try {
        const result1 = await pl.createOrUpdateOrder(payloadOrderExample1);
        console.log(result1);
    } catch (error) {
        console.error("Error on transfer order", error);
    }
}
  
start();