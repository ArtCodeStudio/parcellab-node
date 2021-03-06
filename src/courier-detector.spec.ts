import { strictEqual } from "assert";
import { CourierDetector } from './courier-detector';

describe('CourierDetector', () => {
  const detector = new CourierDetector();

  describe('getCourier', () => {
    // hermes
    it('"H1000730000834301047" should be detected as "hermes-de"', () => {
      const courier = detector.getCourier("H1000730000834301047");
      strictEqual(courier, "hermes-de");
    });

    it('"H1000730000173901032" should be detected as "hermes-de"', () => {
      const courier = detector.getCourier("H1000730000173901032");
      strictEqual(courier, "hermes-de");
    });

    // dhl-germany
    it('"CR236035058DE" should be detected as "dhl-germany"', () => {
      const courier = detector.getCourier("CR236035058DE");
      strictEqual(courier, "dhl-germany");
    });

    it('"00340434463400055439" should be detected as "dhl-germany"', () => {
      const courier = detector.getCourier("00340434463400055439");
      strictEqual(courier, "dhl-germany");
    });

    // dpd
    it('"09445440528378N" should be detected as "dpd-de"', () => {
      const courier = detector.getCourier("09445440528378N");
      strictEqual(courier, "dpd-de");
    });

    it('"09445440528275T" should be detected as "dpd-de"', () => {
      const courier = detector.getCourier("09445440528275T");
      strictEqual(courier, "dpd-de");
    });

    it('"09445440528213M" should be detected as "dpd-de"', () => {
      const courier = detector.getCourier("09445440528213M");
      strictEqual(courier, "dpd-de");
    });

    it('"094454405280792" should be detected as "dpd-de"', () => {
      const courier = detector.getCourier("094454405280792");
      strictEqual(courier, "dpd-de");
    });

    it('"094454405282712" should be detected as "dpd-de"', () => {
      const courier = detector.getCourier("094454405282712");
      strictEqual(courier, "dpd-de");
    });

    it('"09445440528372Z" should be detected as "dpd-de"', () => {
      const courier = detector.getCourier("09445440528372Z");
      strictEqual(courier, "dpd-de");
    });

    // ups
    it('"1Z0370A00400378816" should be detected as "ups"', () => {
      const courier = detector.getCourier("1Z0370A00400378816");
      strictEqual(courier, "ups");
    });

    // colisprivee
    it('"Z6100126949933330" should be detected as "colisprivee"', () => {
      const courier = detector.getCourier("Z6100126949933330");
      strictEqual(courier, "colisprivee");
    });

    it('"Z6100131760569200" should be detected as "colisprivee"', () => {
      const courier = detector.getCourier("Z6100131760569200");
      strictEqual(courier, "colisprivee");
    });

    it('"Z6100130652674000" should be detected as "colisprivee"', () => {
      const courier = detector.getCourier("Z6100130652674000");
      strictEqual(courier, "colisprivee");
    });

    // wn-direct
    it('"RG0000007949" should be detected as "wn-direct"', () => {
      const courier = detector.getCourier("RG0000007949");
      strictEqual(courier, "wn-direct");
    });

    it('"9L27236131798" should be detected as "wn-direct"', () => {
      const courier = detector.getCourier("9L27236131798");
      strictEqual(courier, "wn-direct");
    });

    // TODO check this
    // it('"1Z0370A00401261779" should be detected as "wn-direct"', () => {
    //   const courier = detector.getCourier("1Z0370A00401261779");
    //   strictEqual(courier, "wn-direct");
    // });



  });

});


