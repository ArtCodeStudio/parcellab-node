export interface CourierDetector {
    code: string;
    patterns: RegExp[];
    tracking_url: (trackNum: string) => string;
}