"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var index_1 = require("../src/index");
var user = 1;
var token = 'parcelLabAPItoken-30characters';
var payloadTrackingExample1 = {
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
            articleName: 'Test Artikel'
        }
    ]
};
var payloadTrackingExample2 = {
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
            articleName: 'Test Artikel'
        }
    ]
};
var payloadTrackingExample3 = {
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
            articleName: 'Test Artikel'
        }
    ]
};
var payloadTrackingExample4 = {
    courier: 'xxx',
    // You can also pass multiple tracking numbers with different couriers
    tracking_number: { ups: ["1Z74845R6842887612", "1Z74845R6842758029"], dhl: ["003400012321343"] },
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel'
        }
    ]
};
var payloadOrderExample1 = {
    orderNo: 'od12345678',
    zip_code: '12345',
    destination_country_iso3: 'DEU',
    deliveryNo: 'dn12345',
    recipient: 'Max Mustermann',
    email: 'info@parcellab.com',
    articles: [
        {
            articleNo: 'an13579',
            articleName: 'Test Artikel'
        }
    ]
};
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pl, result1, result2, result3, result4, error_1, result1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pl = new index_1.ParcelLabApi(user, token);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, pl.createOrUpdateTracking(payloadTrackingExample1)];
            case 2:
                result1 = _a.sent();
                console.log(result1);
                return [4 /*yield*/, pl.createOrUpdateTracking(payloadTrackingExample2)];
            case 3:
                result2 = _a.sent();
                console.log(result2);
                return [4 /*yield*/, pl.createOrUpdateTracking(payloadTrackingExample3)];
            case 4:
                result3 = _a.sent();
                console.log(result3);
                return [4 /*yield*/, pl.createOrUpdateTracking(payloadTrackingExample4)];
            case 5:
                result4 = _a.sent();
                console.log(result4);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error("Error on transfer tracking", error_1);
                return [3 /*break*/, 7];
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, pl.createOrUpdateOrder(payloadOrderExample1)];
            case 8:
                result1 = _a.sent();
                console.log(result1);
                return [3 /*break*/, 10];
            case 9:
                error_2 = _a.sent();
                console.error("Error on transfer order", error_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
start();
