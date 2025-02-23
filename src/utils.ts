import crypto from "crypto";

export function computeSha256Hash(payload: Buffer | string): string {
    return crypto.createHash("sha256").update(payload).digest("hex");
}

export function mapToObject(map: Map<string, any>) {
    const obj = {};

    for (const [key, value] of map) {
        // @ts-ignore
        obj[key] = value instanceof Map ? mapToObject(value) : value;
    }
    return obj;
}
