export interface CourierDetector {
  patterns: RegExp[];
  tracking_url: (trackNum: string) => string;
}
