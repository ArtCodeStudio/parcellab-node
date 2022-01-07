# Node.js ParcelLab API

This is a simple unofficial wrapper to interface the parcelLab API to [Node.js](https://nodejs.org/), based on [this project](https://bitbucket.org/parcellab/sdk-node) but rewritten in Typescript.

## Shopify

If you need the parcelLab API for a Shopify store we [already have a ready to use integration for you](https://github.com/ArtCodeStudio/parcel-lab-shopify-app), we can also adapt the integration to your needs, just contact us at hi@artandcode.studio.

## Background

To use the API, you have to have a set of valid credentials (`user` and `token`) from [parcelLab](https://portal.parcellab.com/).

Any issues can be submitted in the [Git repository's issue tracker](https://github.com/ArtCodeStudio/parcellab-node/issues).

## Install

Preferred way of installation is through [npm](https://www.npmjs.com/package/parcellab).

```
npm install parcellab --save
```

Alternatively, you can clone the Git [repository on GitHub](https://github.com/ArtCodeStudio/parcellab-node).

```
git clone https://github.com/ArtCodeStudio/parcellab-node.git
```

## Usage

You can find an Javascript and Typescript example in [examples](https://github.com/ArtCodeStudio/parcellab-node/tree/main/examples):

```typescript
import { ParcelLabApi } from ('parcellab'); // or const { ParcelLabApi } = require('parcellab');

const user = 1;
const token = 'ParcelLabApitoken-30characters';
const autoDetectCourier = true; // By default true, set this to false if you do want to detect / validate the courier by tracking number
const logLevel = 3; // By default 3, 3 logs info, warn and error messages 

const parcellab = new ParcelLabApi(1, token, autoDetectCourier, logLevel);

const payloadTracking = {
  courier: 'dhl-germany',
  tracking_number: '1234567890',
  zip_code: '12345',
  destination_country_iso3: 'DEU',
  articles: []
};

try {
  const result = await parcellab.createTracking(payloadTracking);
  console.log(result);
} catch (error) {
  console.error("Error on transfer tracking", error);
}

```

For required and optional properies see the [interfaces](https://github.com/ArtCodeStudio/parcellab-node/tree/main/src/interfaces).

## Dealing with multiple tracking numbers

The module features dealing with multiple tracking numbers embedded in the payload. This allows to use one single call of `createTracking(payload)` for creating multiple trackings for a single order, e.g. when an order from a customer is shipped in several deliveries.

### Multiple deliveries with same courier

If all shipments are done with a single courier, multiple tracking numbers can simply listed with either the delimiter `,` or `|` within the attribute `tracking_number` like so:

```javascript
var payload = {
  courier: 'dhl-germany',
  tracking_number: '1234567890,1234567891,1234567892'
};
```

### Multiple deliveries with multiple couriers

In the more complex case where the deliveries are not performed by the same courier, the tracking numbers can be embedded via `JSON` by using the name of the courier as the key and the associated tracking numbers in an array. Example:

```javascript
var payload = {
  courier: 'XXX', // will be ignored
  tracking_number: {
    'dhl-germany': ['1234567890', '1234567891'],
    'ups': ['1Z1234567']
  }
};
```

## Contributing

### Bug Reporting

* Ensure the bug can be reproduced on the latest master.
* If there is a problem with a particular courier, please let us know the tracking number and courier
* For privacy reasons, please change some digits of the tracking number, even if you use them in tests
* Do not publish any other private data 

### Pull Requests

* Fork the repository and create a topic branch.
* Include tests that cover any changes or additions that you've made.
* Push your topic branch to your fork and submit a pull request. Include details about the changes as well as a reference to related issue(s).

## License (ISC)  

~~~~
ISC License

Copyright (c) 2020, Art+Code Studio (https://artandcode.studio)
Copyright (c) 2019, Julian Krenge <julian@parcellab.com> (https://parcellab.com)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

~~~~
