import { AlertType } from './alert-type.enum';

export interface AlertModel {
    message: string;
    type: AlertType;
}
