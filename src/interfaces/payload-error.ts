export interface PayloadError extends Error {
    invalidKeys: string[];
}