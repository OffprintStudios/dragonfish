export interface Recovery {
  readonly _id: string;
  readonly accountId: string;
  readonly resetCode: string;
  readonly expires: Date;
}
