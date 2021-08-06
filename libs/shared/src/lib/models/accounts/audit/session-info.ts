export interface SessionInfo {
    readonly _id: string;
    readonly expires: Date;
    readonly deviceId: string;
    readonly ipAddr: string;
    readonly createdAt: Date;
}
