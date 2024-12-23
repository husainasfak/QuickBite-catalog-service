import { FileData, FileStorage } from "../types/storage";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import config from "config";
import crypto, { BinaryLike } from "crypto";
import createHttpError from "http-errors";
export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("awsS3.region"),
            credentials: {
                accessKeyId: config.get("awsS3.accessKeyId"),
                secretAccessKey: config.get("awsS3.secretAccessKey"),
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const hash = crypto
            .createHash("sha256")
            .update(data.fileData as BinaryLike)
            .digest("hex");
        const objectParams = {
            Bucket: config.get("awsS3.bucket"),
            Key: data.filename,
            Body: data.fileData,
            ContentType: "text/plain", // Or appropriate MIME type
            Metadata: {
                "x-amz-content-sha256": hash, // Custom metadata (if needed)
            },
        };

        // @ts-ignore
        return await this.client.send(new PutObjectCommand(objectParams));
    }

    async delete(filename: string): Promise<void> {
        const objectParams = {
            Bucket: config.get("awsS3.bucket"),
            Key: filename,
        };

        // @ts-ignore
        return await this.client.send(new DeleteObjectCommand(objectParams));
    }

    getObjectUrl(filename: string) {
        // https://quickbite-food.s3.ap-south-1.amazonaws.com/33138689-89e9-4a03-b4bb-9892c5c1e316
        const bucket = config.get("awsS3.bucket");
        const region = config.get("awsS3.region");

        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
        }
        const error = createHttpError(500, "Invalid S3 configuration");
        throw error;
    }
}
