import { Constants } from './global-constants';

export class Title {
    public static setDefaultTitle(): void {
        document.title = Constants.OFFPRINT;
    }

    public static setTwoPartTitle(title: string): void {
        document.title = title + Constants.SEPARATOR + Constants.OFFPRINT;
    }

    public static setThreePartTitle(title1: string, title2: string): void {
        document.title = title1 + Constants.SEPARATOR + title2 +
            Constants.SEPARATOR + Constants.OFFPRINT;
    }
}