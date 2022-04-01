export interface SessionInfo {
    readonly _id: string;
    readonly expires: Date;
    readonly deviceOS: string;
    readonly deviceBrowser: string;
    readonly ipAddr: string;
    readonly createdAt: Date;
}
