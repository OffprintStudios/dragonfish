export class Alert {
    type: AlertType;
    message: string;
    title: string;
    alertId: string;
    keepAfterRouteChange: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success, Error, Info, Warning
}
