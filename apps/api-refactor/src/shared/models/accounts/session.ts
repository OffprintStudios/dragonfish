export interface Session {
  readonly _id: string;
  readonly accountId: string;
  readonly expires: Date;
  readonly deviceOS: string;
  readonly deviceBrowser: string;
  readonly ipAddr: string;
  readonly createdAt: Date;
}
