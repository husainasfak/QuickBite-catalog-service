import crypto from "crypto";

export function computeSha256Hash(payload: Buffer | string): string {
    return crypto.createHash("sha256").update(payload).digest("hex");
}
