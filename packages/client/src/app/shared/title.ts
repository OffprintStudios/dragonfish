import { Constants } from './constants';

export namespace Title {
    export function setDefaultTitle(): void {
        document.title = Constants.OFFPRINT;
    }

    export function setTwoPartTitle(title: string): void {
        document.title = title + Constants.SEPARATOR + Constants.OFFPRINT;
    }

    export function setThreePartTitle(title1: string, title2: string): void {
        document.title = title1 + Constants.SEPARATOR + title2 +
            Constants.SEPARATOR + Constants.OFFPRINT;
    }
}