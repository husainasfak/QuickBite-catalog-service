export interface FileData {
    filename: string;
    fileData: Buffer | string;
}

export interface FileStorage {
    upload(data: FileData): Promise<void>;
    delete(filename: string): Promise<void>;
    getObjectUrl(filename: string): string;
}
