import { ParcellabArticle } from '.';

export interface ParcellabTrackingDetailsResponse {
  articles: ParcellabArticle[];
  articlesOpen: ParcellabArticle[];
  complete: boolean;
  upgrade: boolean;
  cashOnDelivery: number;
  doorstepDelivery: boolean;
  branchDelivery: boolean;
  return: boolean;
  city: string;
  client: string;
  orderNo: string;
  cancelled: boolean;
  customerNo: string;
  deliveryNo: string;
  email: string;
  language_iso3: string;
  market: string;
  order_date: string;
  recipient: string;
  recipient_notification: string;
  statuslink: string;
  street: string;
  weight: string;
  xid: string;
  warehouse: string;
  courierServiceLevel: string;
  customFields: any;
  region: string;
  timezone: string;
  created: string;
  tracking_number: string;
  trackingId: string;
  zip_code: string;
  country: { name: string; code: string };
  courier: {
    name: string;
    prettyname: string;
    trackingurl: string;
    courierLogoUrl: string;
    destination_courier: any; // TODO
    rerouteurl: null;
    brandedtrackingurl: string;
  };
  transport: {
    isTransport: boolean;
    details: any; // TODO
  };
  securityHash: string;
  delivered: boolean;
  destination_timezone: { iso2: string; region: string; name: string };
  import_source_meta: {
    channels: any; // TODO
    first_update: string;
    last_update: string;
    number_of_updates: number;
  };
  service: string;
  updated: string;
}
