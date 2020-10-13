import { GlobalConstants } from './global-constants';

export class GlobalMethods {
    public static setDefaultTitle(): void {
        document.title = GlobalConstants.OFFPRINT;
    }

    public static setTwoPartTitle(title: string): void {
        document.title = title + GlobalConstants.SEPARATOR + GlobalConstants.OFFPRINT;
    }

    public static setThreePartTitle(title1: string, title2: string): void {
        document.title = title1 + GlobalConstants.SEPARATOR + title2 +
            GlobalConstants.SEPARATOR + GlobalConstants.OFFPRINT;
    }
}