import { ParcellabTrackingBase } from './tracking-base';

/**
 * Orders cannot be explicitly created in parcelLab, but only implicitly.
 * For each tracking in an order, simply a orderNo is given.
 * This orderNo then links all trackings together and consolidate communications via email, SMS etc and also the tracking page.
 * @see https://how.parcellab.works/docs/integration-quick-start/data-model#creating-orders
 */
export interface ParcellabOrderBase extends Partial<ParcellabTrackingBase> {
  /**
   * Order number;
   */
  orderNo: string;
  /**
   * id of delivery before tracking number
   */
  xid?: string;
}
